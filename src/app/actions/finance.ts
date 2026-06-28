'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { CategoryInputSchema, TransactionInputSchema } from '@/utils/schemas';
import type { Category, Transaction, CategoryInput, TransactionInput } from '@/types/finance';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object') {
    if ('message' in err) return String((err as { message: unknown }).message);
    if ('error_description' in err) return String((err as { error_description: unknown }).error_description);
  }
  return String(err);
}

/**
 * Fetch all categories for the authenticated user, optionally filtered by type.
 */
export async function getCategories(type?: 'debit' | 'credit'): Promise<{ success: boolean; data?: Category[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    let query = supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data: data as Category[] };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * Create a new custom category.
 */
export async function addCategory(input: CategoryInput): Promise<{ success: boolean; data?: Category; error?: string }> {
  try {
    // Validate inputs
    const parsed = CategoryInputSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: parsed.data.name.trim(),
        type: parsed.data.type,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Category with this name and type already exists.' };
      }
      throw error;
    }

    revalidatePath('/dashboard', 'layout');
    return { success: true, data: data as Category };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * Fetch all transactions for the authenticated user, joined with category details.
 */
export async function getTransactions(): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data as Transaction[] };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * Add a new financial transaction (debit/credit).
 */
export async function addTransaction(input: TransactionInput): Promise<{ success: boolean; data?: Transaction; error?: string }> {
  try {
    // Validate inputs
    const parsed = TransactionInputSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify category belongs to user if provided
    if (parsed.data.category_id) {
      const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', parsed.data.category_id)
        .eq('user_id', user.id)
        .single();

      if (catError || !category) {
        return { success: false, error: 'Invalid category selected.' };
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: parsed.data.amount,
        type: parsed.data.type,
        category_id: parsed.data.category_id || null,
        description: parsed.data.description?.trim() || null,
        date: parsed.data.date,
      })
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;

    revalidatePath('/dashboard', 'layout');
    return { success: true, data: data as Transaction };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * Delete a transaction.
 */
export async function deleteTransaction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard', 'layout');
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * Batch insert multiple transactions for the authenticated user.
 */
export async function addTransactions(inputs: TransactionInput[]): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
  try {
    if (inputs.length === 0) {
      return { success: false, error: 'No transactions provided.' };
    }

    // Validate all inputs
    const validatedInputs = [];
    for (const input of inputs) {
      const parsed = TransactionInputSchema.safeParse(input);
      if (!parsed.success) {
        return { success: false, error: `Invalid input: ${parsed.error.issues[0].message}` };
      }
      validatedInputs.push(parsed.data);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Prepare inputs with user_id
    const payload = validatedInputs.map(item => ({
      user_id: user.id,
      amount: item.amount,
      type: item.type,
      category_id: item.category_id || null,
      description: item.description?.trim() || null,
      date: item.date,
    }));

    const { data, error } = await supabase
      .from('transactions')
      .insert(payload)
      .select('*, category:categories(*)');

    if (error) throw error;

    revalidatePath('/dashboard', 'layout');
    return { success: true, data: data as Transaction[] };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}
