CREATE database if not exists databaseFox ;
USE databaseFox	;

/* create schema `foxPlataformData`; */


/*
 * Usuários
*/

create table if not exists tblTypeUser(
	id tinyint(1) not null AUTO_INCREMENT,
	type varchar(40) not null,
	created datetime default current_timestamp(),
	updated datetime on update current_timestamp(),
	primary key (id)
);

create table if not exists tblAuth (
	email varchar(200) not null unique,
	password varchar(255) not null,
	logged enum ('0', '1') default '0',
	token varchar(255) default '',
	primary key (email)
);

create table if not exists tblUser(
	userID bigint not null bigserial,
	created datetime default current_timestamp,
	updated datetime on update current_timestamp,
	email varchar(200) not null unique,
	name varchar(50) not null,
	wallet double default 0.00,
	linkID varchar(255) not null unique,
	indicator varchar(255),
	type tinyint(1) not null default 1,
	primary key (userID),
	foreign key (type) references tblTypeUser(id),
	foreign key (email) references tblAuth(email)
);

/*
 * Produtos
*/

create table if not exists tblCategoryProducts(
	idCategory integer not null AUTO_INCREMENT unique,
	name varchar(150) not null unique,
	description longtext,
	created datetime default current_timestamp,
	updated datetime on update current_timestamp,
	primary key (idCategory)
);

create table if not exists tblProduct(
	idProduct bigint not null AUTO_INCREMENT,
	name varchar(100) not null, 
	description longtext not null,
	price double not null,
	category integer not null,
	created datetime default current_timestamp,
	updated datetime on update current_timestamp,
	primary key (idProduct), 
	foreign key (category) references tblCategoryProducts(idCategory)
);

create table if not exists tblProductsUser(
	idUser bigint not null,
	idProduct bigint not null,
	transaction bigint not null,
	primary key (idUser, idProduct),
	foreign key (idUser) references  tblUser(userID),
	foreign key (idProduct) references tblProduct(idProduct),
	foreign key (transaction) references tblSales(id)
);

/* Shoppings */

create table if not exists tblSales(
	id bigint not null AUTO_INCREMENT,
	price double not null,
	ocurrency datetime default current_timestamp,
	seller varchar(255) default null
	primary key (id)
);


/* withdraw */

create table if not exists tblWithdraw(
	id bigint not null AUTO_INCREMENT,
	idUser bigint not null, 
	value double not null,
	ocurrency datetime default current_timestamp,
	primary key (id),
	foreign key (idUser) references tblUser(userID)
);

/* Comissitons */

create table if not exists tblCommission(
	level tinyint(2) not null unique,
	percentual  double not null,
	primary key (level)
);

/*
*
* INSERTING BASIC DATA ON DATABASE;
*
*/

insert into tblTypeUser(type) values('default');
insert into tblTypeUser(type) values('adm');
insert into tblTypeUser(type) values('director');

insert into tblCommission(level, percentual) values(1, 20);
insert into tblCommission(level, percentual) values(2, 5);
insert into tblCommission(level, percentual) values(3, 5);
insert into tblCommission(level, percentual) values(4, 5);
insert into tblCommission(level, percentual) values(5, 5);

/*use databaseFox;

select * from tblAuth;*/

/* ALTERACOES 

tblProductUser
- Purchacased => idTransacao;

tblSales
- [ADD] seller varchar(255) default null
*/