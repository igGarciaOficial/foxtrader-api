CREATE database if not exists databaseFox;
USE databaseFox;

/*
 * Usuários
*/

create table if not exists tblTypeUser(
	colId smallserial not null,
	colType varchar(40) not null,
	colCreated TIMESTAMPTZ default current_timestamp,
	/*colUpdated TIMESTAMPTZ UPDATE ON current_timestamp,*/
	primary key (colId)
);

create table if not exists tblAuth (
    /*colCreated TIMESTAMPTZ DEFAULT current_timestamp,*/
    /*colUpdated TIMESTAMPTZ UPDATE ON current_timestamp,*/
	colEmail varchar(200) not NULL unique,
	colPassword varchar(255) not null,
	/*colLogged varchar(1) not null default '0',*/
	/*colToken varchar(255) default '', */
	primary key (colEmail)
);

create table if not exists tblUser(
	colUserID BIGSERIAL NOT NULL,
	colCreated TIMESTAMPTZ DEFAULT current_timestamp,
	/*colUpdated TIMESTAMPTZ UPDATE ON current_timestamp, */
	colEmail VARCHAR(200) NOT NULL unique,
	colName VARCHAR(50) NOT NULL,
	colWallet MONEY default 0,
	colLinkID VARCHAR(255) NOT NULL unique,
	colIndicator VARCHAR(255),
	colType SMALLINT NOT NULL default 1,
	PRIMARY KEY (colUserID),
	FOREIGN KEY (colType) REFERENCES tblTypeUser(colId),
	FOREIGN KEY (colEmail) REFERENCES tblAuth(colEmail)
);

/*
 * Produtos
*/

/* PEGAR AQUI ... */
CREATE TABLE if not exists tblCategoryProducts(
	colIdCategory SMALLSERIAL NOT NULL unique,
	colName VARCHAR(150) NOT NULL unique,
	colDescription TEXT,
	colCreated TIMESTAMPTZ DEFAULT current_timestamp,
	/*colUpdated TIMESTAMPTZ UPDATE ON current_timestamp,*/
	PRIMARY KEY (colIdCategory)
);

CREATE TABLE if not exists tblProduct(
	colIdProduct SERIAL not null,
	colName VARCHAR(100) not null, 
	colDescription TEXT not null,
	colPrice MONEY not null,
	colCategory SMALLSERIAL not null,
	colCreated TIMESTAMPTZ default current_timestamp,
	/*colUpdated TIMESTAMPTZ UPDATE ON current_timestamp,*/
	primary key (colIdProduct), 
	foreign key (colCategory) references tblCategoryProducts(colIdCategory)
);

/* Shoppings */

create table if not exists tblSales(
	colId BIGSERIAL not null,
	colPrice MONEY not null,
	colOcurrency TIMESTAMPTZ default current_timestamp,
	colSeller varchar(255) default null,
    colProduct SERIAL not null,
	primary key (colId),
    FOREIGN KEY (colProduct) references tblProduct(colIdProduct)
);

create table if not exists tblProductsUser(
	colIdUser BIGSERIAL not null,
	colIdProduct SERIAL not null,
	colTransaction BIGSERIAL not null,
	primary key (colIdUser, colIdProduct),
	foreign key (colIdUser) references  tblUser(colUserID),
	foreign key (colIdProduct) references tblProduct(colIdProduct),
	foreign key (colTransaction) references tblSales(colId)
);

/* withdraw */

create table if not exists tblWithdraw(
	colId BIGSERIAL not null,
	colIdUser BIGSERIAL not null, 
	colValue MONEY not null,
	colOcurrency TIMESTAMPTZ default current_timestamp,
	colDebited BOOLEAN default FALSE, 
	primary key (colId),
	foreign key (colIdUser) references tblUser(colUserID)
);

/* Comissitons */

create table if not exists tblCommission(
	colLevel SMALLINT not null unique,
	colPercentual double precision not null,
	primary key (colLevel)
);

insert into tblTypeUser(colType) values('default');
insert into tblTypeUser(colType) values('adm');
insert into tblTypeUser(colType) values('director');

insert into tblCommission(colLevel, colPercentual) values(1, 20);
insert into tblCommission(colLevel, colPercentual) values(2, 5);
insert into tblCommission(colLevel, colPercentual) values(3, 5);
insert into tblCommission(colLevel, colPercentual) values(4, 5);
insert into tblCommission(colLevel, colPercentual) values(5, 5);