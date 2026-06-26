-- Create Enums
create type lead_status as enum ('pending', 'contacted', 'scheduled', 'discarded');
create type lead_commitment as enum ('ready', 'doubts', 'info_only');

-- Create Leads Table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  full_name text not null,
  email text not null,
  sex text,
  country_code text,
  whatsapp text not null,
  age integer,
  gestas integer default 0,
  location text,
  medical_context jsonb,
  lab_file_path text,
  investment_ok boolean default false,
  commitment lead_commitment,
  score integer default 0,
  status lead_status default 'pending'
);

-- Enable RLS
alter table leads enable row level security;

-- Policies: Leads
create policy "Enable insert for everyone"
  on leads for insert
  with check (true);

create policy "Enable read for authenticated users only"
  on leads for select
  using (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only"
  on leads for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage: lab-files bucket (crearlo manualmente como privado)
-- Policies: Storage
create policy "Allow public uploads"
  on storage.objects for insert
  with check (bucket_id = 'lab-files');

create policy "Allow authenticated reads"
  on storage.objects for select
  using (auth.role() = 'authenticated' and bucket_id = 'lab-files');