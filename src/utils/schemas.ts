import { z } from 'zod';

export const CategoryInputSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long'),
  type: z.enum(['debit', 'credit']),
});

export const TransactionInputSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['debit', 'credit']),
  category_id: z.string().uuid('Invalid category ID').nullable().optional(),
  description: z.string().max(250, 'Description is too long').nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
