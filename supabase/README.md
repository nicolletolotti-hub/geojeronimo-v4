# Supabase — GeoJeronimo v4

## Configuração

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Copie `app/.env.example` para `app/.env.local` e preencha:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Execute o SQL em `migrations/001_initial_schema.sql` no SQL Editor.
4. Em **Authentication → Providers**, habilite Email.
5. Para realtime futuro: **Database → Replication** → inclua `pacientes` e `visitas`.

## Perfis (`usuarios.perfil`)

| Perfil | Permissões |
|--------|------------|
| `admin` | Leitura/escrita pacientes e visitas |
| `acs` | Leitura/escrita pacientes e visitas |
| `visualizacao` | Somente leitura |

Defina o perfil no metadata do cadastro (`perfil: acs`) ou atualize na tabela `usuarios`.

## Tabelas

- `usuarios` — perfil vinculado a `auth.users`
- `pacientes` — cadastro territorial
- `visitas` — visitas ACS (pendente / realizada / cancelada)

Sem `.env.local` o app continua com dados locais e `pacientes.js` base.
