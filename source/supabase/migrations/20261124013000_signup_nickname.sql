begin;

create function public.signup_nickname_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select char_length(trim(candidate)) between 2 and 20
    and not exists (
      select 1 from public.profiles where nickname = trim(candidate)
    );
$$;

revoke all on function public.signup_nickname_available(text) from public;
grant execute on function public.signup_nickname_available(text) to anon, authenticated;

create function public.create_signup_nickname()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate text := trim(new.raw_user_meta_data ->> 'signup_nickname');
begin
  if candidate is not null and candidate <> '' then
    if char_length(candidate) not between 2 and 20 then
      raise exception 'Invalid nickname' using errcode = '22023';
    end if;
    insert into public.profiles (user_id, nickname) values (new.id, candidate);
  end if;
  return new;
end;
$$;

revoke all on function public.create_signup_nickname() from public;

create trigger create_signup_nickname
after insert on auth.users
for each row execute function public.create_signup_nickname();

commit;
