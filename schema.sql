-- 1. Create Categories Table
create table public.categories (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    type text not null check (type in ('debit', 'credit')),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    
    -- Ensure a user can't create duplicate category name + type combinations
    constraint unique_user_category_type unique (user_id, name, type)
);

-- Enable RLS on Categories
alter table public.categories enable row level security;

-- Categories RLS Policies
create policy "Users can view their own categories"
    on public.categories for select
    using (auth.uid() = user_id);

create policy "Users can insert their own categories"
    on public.categories for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own categories"
    on public.categories for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
    on public.categories for delete
    using (auth.uid() = user_id);


-- 2. Create Transactions Table
create table public.transactions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    amount numeric(12, 2) not null check (amount > 0),
    type text not null check (type in ('debit', 'credit')),
    category_id uuid references public.categories(id) on delete set null,
    description text,
    date date default current_date not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS on Transactions
alter table public.transactions enable row level security;

-- Transactions RLS Policies
create policy "Users can view their own transactions"
    on public.transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
    on public.transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
    on public.transactions for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
    on public.transactions for delete
    using (auth.uid() = user_id);


-- 3. Automatic Default Categories Trigger for New Users
create or replace function public.handle_new_user_categories()
returns trigger as $$
begin
  insert into public.categories (user_id, name, type) values
    (new.id, 'Salary', 'credit'),
    (new.id, 'Investments', 'credit'),
    (new.id, 'Gifts & Refunds', 'credit'),
    (new.id, 'Food & Dining', 'debit'),
    (new.id, 'Rent & Housing', 'debit'),
    (new.id, 'Utilities', 'debit'),
    (new.id, 'Transportation', 'debit'),
    (new.id, 'Entertainment', 'debit'),
    (new.id, 'Shopping', 'debit'),
    (new.id, 'Medical & Health', 'debit');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger associated with auth.users insert
create or replace trigger on_auth_user_created_categories
  after insert on auth.users
  for each row execute procedure public.handle_new_user_categories();
