-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed initial categories
insert into categories (name) values
  ('Food'),
  ('Transport'),
  ('Rent'),
  ('Bills'),
  ('Entertainment'),
  ('Health'),
  ('Shopping'),
  ('Others');

-- Create budgets table
create table budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references categories(id) not null,
  monthly_limit decimal(10, 2) not null check (monthly_limit > 0),
  month_year text not null, -- Format: 'YYYY-MM'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, category_id, month_year)
);

-- Create expenses table
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references categories(id) not null,
  amount decimal(10, 2) not null check (amount > 0),
  merchant text not null,
  date timestamp with time zone not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table categories enable row level security;
alter table budgets enable row level security;
alter table expenses enable row level security;

-- RLS Policies

-- Profiles: Users can view and update their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Categories: Everyone can view categories (public reference data)
create policy "Categories are viewable by everyone" on categories
  for select using (true);

-- Budgets: Users can only view and manage their own budgets
create policy "Users can view own budgets" on budgets
  for select using (auth.uid() = user_id);

create policy "Users can insert own budgets" on budgets
  for insert with check (auth.uid() = user_id);

create policy "Users can update own budgets" on budgets
  for update using (auth.uid() = user_id);

create policy "Users can delete own budgets" on budgets
  for delete using (auth.uid() = user_id);

-- Expenses: Users can only view and manage their own expenses
create policy "Users can view own expenses" on expenses
  for select using (auth.uid() = user_id);

create policy "Users can insert own expenses" on expenses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own expenses" on expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete own expenses" on expenses
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

