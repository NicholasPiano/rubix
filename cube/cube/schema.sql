drop table if exists cubes;
drop table if exists faces;
drop table if exists pieces;
drop table if exists pieces_faces;
drop table if exists cell;

create table cubes (
	id integer primary key autoincrement,
	name text not null,
	net integer not null,
	focus integer not null
);

create table faces (
	id integer primary key autoincrement,
	name text not null,
	cube_id integer not null references cubes(id)
);

create table pieces (
	id integer primary key autoincrement
);
create table pieces_faces (
	id integer primary key autoincrement,
	piece_id integer not null references pieces(id),
	parent_face_id integer not null references faces(id),
	parent_x integer not null,
	parent_y integer not null,
	current_face_id integer not null references faces(id),
	current_x integer not null,
	current_y integer not null
);

create table cell (
	id integer primary key autoincrement,
	piece_id integer not null references pieces(id),
	x integer not null,
	y integer not null,
	z integer not null default 0
);
