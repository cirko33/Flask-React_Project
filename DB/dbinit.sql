use drsdb;

create table user
(
    email varchar(64) unique,
    password varchar(64) not null,
    firstName varchar(32) not null,
    lastName varchar(32) not null,
    address varchar(64) not null,
    city varchar(32) not null,
    phoneNumber varchar(16) not null,
    verified tinyint not null,
    accountNumber integer primary key AUTO_INCREMENT,    
    cardNumber varchar(16)
);

create table transaction
(
    id integer primary key AUTO_INCREMENT,
    sender varchar(64) not null,
    receiver varchar(64) not null,
    amount float(12, 2) not null,
    currency varchar(3) not null,
    state varchar(32) not null,
    type varchar(8) not null
);

create table credit_card
(
    cardNumber varchar(16) primary key,
    userName varchar(32) not null,
    expirationDate varchar(5) not null,
    cvc integer not null,
    amount float(12, 2) not null,
    bankAccountNumber varchar(10) not null
);

create table balance
(
    pk integer primary key AUTO_INCREMENT,
    accountNumber integer not null,
    amount float(12, 2) not null,
    currency varchar(3) not null
);

insert into user (email, password, firstName, lastName, address, city, phoneNumber, verified, cardNumber) values ("pera@gmail.com", "444db0769f5def09b6d29363c6a0fed1f87102511cae3a65c5d2c23c39ed3806", "Petar", "Petrovic", "Kisacka 24", "Novi Sad", "123456789", 1, "1212121212121212");
insert into user (email, password, firstName, lastName, address, city, phoneNumber, verified) values ("sima@gmail.com", "cc21023552ed7b7805f20c759357d7482e16093273fa805b0f96c643e5c8fc55", "Sima", "Simic", "Ive Andrica 5", "Beograd", "555555555", 0);

insert into credit_card (cardNumber, userName, expirationDate, cvc, amount, bankAccountNumber) values ("1212121212121212", "Petar", "01/30", 123, 500, "1234567890");
insert into credit_card (cardNumber, userName, expirationDate, cvc, amount, bankAccountNumber) values ("1234567891234567", "Sima", '12/30', 555, 1000, "5555555555");
insert into credit_card (cardNumber, userName, expirationDate, cvc, amount, bankAccountNumber) values ("1111222233334444", "Zdravko", '12/30', 321, 20000, "9876543210");
insert into credit_card (cardNumber, userName, expirationDate, cvc, amount, bankAccountNumber) values ("5555666677778888", "Laza", '01/30', 321, 20000, "88888888");

insert into balance (accountNumber, amount, currency) values (1, 50, "EUR");
insert into balance (accountNumber, amount, currency) values (1, 20, "USD");
insert into balance (accountNumber, amount, currency) values (1, 2000, "RSD");
insert into balance (accountNumber, amount, currency) values (1, 60, "KM");

insert into transaction ( sender, receiver, amount, currency, state, type) values ("pera@gmail.com", "sima@gmail.com", 1000, "RSD", "Denied", "online");
insert into transaction ( sender, receiver, amount, currency, state, type) values ("zdravko@gmail.com", "pera@gmail.com", 100, "EUR", "Accepted", "online");
insert into transaction ( sender, receiver, amount, currency, state, type) values ("pera@gmail.com", "RS35105008123123123173_OPPBRS22XXX", 2000, "RSD", "Accepted", "bank");
insert into transaction ( sender, receiver, amount, currency, state, type) values ("pera@gmail.com", "IT60X0542811101000000123456_ACDHITMMXXX", 50, "EUR", "Denied", "bank");