export type TransactionType = 'debit' | 'credit';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category_id: string | null;
  description: string | null;
  date: string;
  created_at: string;
  category?: Category; // Joined category details
}

export type CategoryInput = Omit<Category, 'id' | 'user_id' | 'created_at'>;
export type TransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'category'>;
