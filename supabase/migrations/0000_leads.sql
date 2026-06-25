-- Create Enums
create type lead_status as enum ('pending', 'contacted', 'scheduled', 'discarded');
create type lead_commitment as enum ('ready', 'doubts', 'info_only');

-- Create Leads Table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),

  -- Paso 1: Datos Personales
  full_name text not null,
  email text not null,
  sex text,
  country_code text,
  whatsapp text not null,
  age integer,
  gestas integer default 0,
  location text, -- Argentina / Brasil / Otro

  -- Paso 2 y 3: Contexto Médico
  medical_context jsonb, -- { reason, symptoms, hasUterus, app, apf, cancer_history, surgical_history, allergies }

  -- Paso 4: Estudios
  lab_file_url text,

  -- Paso 5: Compromiso
  investment_ok boolean default false,
  commitment lead_commitment,

  -- Scoring / CRM
  score integer default 0,
  status lead_status default 'pending'
);

-- Enable RLS
alter table leads enable row level security;

-- Policies
create policy "Enable insert for everyone"
  on leads for insert
  with check (true);

create policy "Enable read for authenticated users only"
  on leads for select
  using (auth.role() = 'authenticated');