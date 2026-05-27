-- GeoJeronimo v4 — schema inicial (usuarios, pacientes, visitas)
-- Execute no SQL Editor do Supabase ou via CLI

-- Perfis de usuário vinculados ao Auth
create table if not exists public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  nome text,
  perfil text not null default 'visualizacao'
    check (perfil in ('admin', 'acs', 'visualizacao')),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pacientes ACS / operacionais
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text,
  prioridade text,
  bairro text,
  lat double precision,
  lng double precision,
  origem text default 'supabase',
  created_by uuid references public.usuarios (id) on delete set null,
  criado_em timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Visitas domiciliares / territoriais
create table if not exists public.visitas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes (id) on delete cascade,
  acs_id uuid references public.usuarios (id) on delete set null,
  data_visita timestamptz not null default now(),
  status text not null default 'pendente'
    check (status in ('pendente', 'realizada', 'cancelada')),
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pacientes_bairro_idx on public.pacientes (bairro);
create index if not exists visitas_paciente_idx on public.visitas (paciente_id);
create index if not exists visitas_acs_idx on public.visitas (acs_id);
create index if not exists visitas_status_idx on public.visitas (status);

-- Trigger: criar perfil ao registrar usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, email, nome, perfil)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'perfil', 'visualizacao')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.usuarios enable row level security;
alter table public.pacientes enable row level security;
alter table public.visitas enable row level security;

-- Usuários: leitura própria; admin lê todos
create policy usuarios_select_own on public.usuarios
  for select using (auth.uid() = id);

create policy usuarios_select_admin on public.usuarios
  for select using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.perfil = 'admin'
    )
  );

create policy usuarios_update_own on public.usuarios
  for update using (auth.uid() = id);

-- Pacientes: leitura autenticada; escrita admin/acs
create policy pacientes_select_auth on public.pacientes
  for select to authenticated using (true);

create policy pacientes_insert_staff on public.pacientes
  for insert to authenticated with check (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.perfil in ('admin', 'acs')
    )
  );

create policy pacientes_update_staff on public.pacientes
  for update to authenticated using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.perfil in ('admin', 'acs')
    )
  );

create policy pacientes_delete_staff on public.pacientes
  for delete to authenticated using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.perfil in ('admin', 'acs')
    )
  );

-- Visitas: leitura autenticada; escrita admin/acs
create policy visitas_select_auth on public.visitas
  for select to authenticated using (true);

create policy visitas_insert_staff on public.visitas
  for insert to authenticated with check (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.perfil in ('admin', 'acs')
    )
  );

create policy visitas_update_staff on public.visitas
  for update to authenticated using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.perfil in ('admin', 'acs')
    )
  );

create policy visitas_delete_staff on public.visitas
  for delete to authenticated using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid() and u.perfil in ('admin', 'acs')
    )
  );

-- Realtime (habilitar no dashboard: Database > Replication)
-- alter publication supabase_realtime add table public.pacientes;
-- alter publication supabase_realtime add table public.visitas;
