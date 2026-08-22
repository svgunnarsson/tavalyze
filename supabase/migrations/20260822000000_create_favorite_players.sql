create table if not exists public.favorite_players (
  user_id uuid not null references auth.users(id) on delete cascade,
  player_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, player_id)
);

alter table public.favorite_players enable row level security;

grant select, insert, delete on table public.favorite_players to authenticated;

create policy "Users can view their own favorite players"
on public.favorite_players
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can add their own favorite players"
on public.favorite_players
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can remove their own favorite players"
on public.favorite_players
for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists favorite_players_user_id_idx
on public.favorite_players (user_id);
