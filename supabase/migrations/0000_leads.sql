-- Create Enums
create type lead_status as enum ('nuevo', 'contactado', 'meet_agendado', 'finalizado');
create type lead_commitment as enum ('ready', 'doubts', 'info_only');

-- Create Leads Table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  age integer,
  location text, -- Argentina / Brasil / Otro
  medical_context jsonb, -- { reason: string, symptoms: string, ... }
  lab_file_url text,
  investment_ok boolean default false,
  commitment lead_commitment,
  score integer default 0,
  status lead_status default 'nuevo'
);

-- Enable RLS
alter table leads enable row level security;

-- Policies
-- Allow anyone to insert (public form)
create policy "Enable insert for everyone" 
  on leads for insert 
  with check (true);

-- Allow authenticated users (Admins) to view all
create policy "Enable read for authenticated users only" 
  on leads for select 
  using (auth.role() = 'authenticated');
