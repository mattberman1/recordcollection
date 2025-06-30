create or replace function get_random_album()
returns setof albums
language sql
as $$
  select * from albums
  order by random()
  limit 1;
$$;
