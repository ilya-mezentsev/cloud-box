package schema

const Schema = `
create table if not exists account(
	id serial,
	hash character(32) primary key
);

create table if not exists account_credentials(
	id serial,
	mail character(320) unique,
	password character(32),
	account_hash character(32)
);

create table if not exists box(
	id serial,
	tunnel_domain character(60),
	alias character(255) default '',
	uuid character(36) unique,
	account_hash character(32) default null
);


alter table account_credentials drop constraint if exists fk_account_credentials;
alter table account_credentials
add constraint fk_account_credentials
foreign key(account_hash)
references account(hash)
on delete cascade;

alter table box drop constraint if exists fk_box;
alter table box
add constraint fk_box
foreign key(account_hash)
references account(hash)
on delete cascade
`
