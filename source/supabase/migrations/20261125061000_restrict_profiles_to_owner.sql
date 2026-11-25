begin;

alter table public.profiles enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;

drop policy if exists "select_profiles" on public.profiles;
create policy "select_profiles" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "insert_own_profile" on public.profiles;
create policy "insert_own_profile" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "update_own_profile" on public.profiles;
create policy "update_own_profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "delete_own_profile" on public.profiles;
create policy "delete_own_profile" on public.profiles
  for delete to authenticated
  using ((select auth.uid()) = user_id);

commit;
