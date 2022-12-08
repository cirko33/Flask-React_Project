use drsdb;

create table user
(
    id varchar(64) primary key,
    password varchar(64) not null,
    firstName varchar(32) not null,
    lastName varchar(32) not null,
    address varchar(64) not null,
    city varchar(32) not null,
    phoneNumber integer not null,
    verified tinyint not null
);

create table transaction
(
    id integer primary key AUTO_INCREMENT,
    sender varchar(64),
    receiver varchar(64) not null,
    amount float(12, 2) not null,
    state varchar(32) not null
);

create table credit_card
(
    cardNumber integer primary key,
    userName varchar(32) not null,
    expirationDate datetime not null,
    cvc integer not null,
    userEmail varchar(64) not null,
    amount float(12, 2) not null
);

create table balance
(
    pk integer primary key AUTO_INCREMENT,
    accountNumber integer not null,
    amount float(12, 2) not null,
    currency varchar(3) not null
);

create table account
(
    accountNumber integer primary key AUTO_INCREMENT,
    userEmail varchar(64) not null,
    cardNumber integer
);

insert into user values ("pera@gmail.com", "perica123", "Petar", "Petrovic", "Kisacka 24", "Novi Sad", 123456789, 1);
insert into user values ("sima@gmail.com", "simex2", "Sima", "Simic", "Ive Andrica 5", "Beograd", 555555555, 0);

insert into account (userEmail, cardNumber) values ("pera@gmail.com", 121212121);
insert into account (userEmail) values ("sima@gmail.com");

insert into credit_card (cardNumber, userName, expirationDate, cvc, userEmail, amount) values (121212121, "Petar", '2030-01-01', 123, "pera@gmail.com", 500);
insert into credit_card (cardNumber, userName, expirationDate, cvc, userEmail, amount) values (123456789, "Sima", '2030-05-12', 555, "sima@gmail.com", 1000);

insert into balance (accountNumber, amount, currency) values (1, 50, "EUR");
insert into balance (accountNumber, amount, currency) values (1, 20, "USD");
insert into balance (accountNumber, amount, currency) values (1, 2000, "RSD");
insert into balance (accountNumber, amount, currency) values (1, 60, "KM");
