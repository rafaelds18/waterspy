IF NOT EXISTS (
    SELECT * FROM sys.databases WHERE name = 'WaterSpy') 
CREATE DATABASE [WaterSpy];
USE [WaterSpy];

CREATE TABLE [User] (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(255)NOT NULL UNIQUE,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    ImageName VARCHAR(255),
    Image VARBINARY(MAX),
    ImageType VARCHAR(255),
	EmailConfirmed BIT NOT NULL,
    Deleted BIT NOT NULL,
    CreatedOn DATETIME NOT NULL,
    CreatedBy VARCHAR(255) NOT NULL,
    UpdatedOn DATETIME NOT NULL,
    UpdatedBy VARCHAR(255) NOT NULL,
    Version INT NOT NULL);

CREATE TABLE [Role] (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Description VARCHAR(255)NOT NULL);

CREATE TABLE [UserRole] (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    PRIMARY KEY(UserId, RoleId),
    CONSTRAINT FK_User FOREIGN KEY (UserId) REFERENCES [User](Id),
    CONSTRAINT FK_Role FOREIGN KEY (RoleId) REFERENCES Role(Id));

CREATE TABLE [Supplier] (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(255) NOT NULL,
    Tin INT NOT NULL,
    Deleted BIT NOT NULL);

CREATE TABLE [Contract](
    Id INT NOT NULL IDENTITY(1,1),
    SupplierId INT NOT NULL,
    ContractNumber INT NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Deleted BIT NOT NULL,
    PRIMARY KEY (Id),
    CONSTRAINT FK_Supplier FOREIGN KEY (SupplierId) REFERENCES [Supplier](Id));

CREATE TABLE [UserContract] (
    UserId INT NOT NULL,
    ContractId INT NOT NULL,
    PRIMARY KEY(UserId, ContractId),
    CONSTRAINT FK_UserContract FOREIGN KEY (UserId) REFERENCES [User](Id),
    CONSTRAINT FK_Contract FOREIGN KEY (ContractId) REFERENCES [Contract](Id));

CREATE TABLE [Notification](
    Id INT NOT NULL IDENTITY(1,1),
    UserId INT,
    SupplierId INT,
    Content VARCHAR(255) NOT NULL,
    Date DATETIME NOT NULL,
    NotificationType VARCHAR(255) NOT NULL,
    PRIMARY KEY (Id),
    CONSTRAINT FK_UserNotif FOREIGN KEY (UserId) REFERENCES [User](Id),
    CONSTRAINT FK_SupplierNotif FOREIGN KEY (SupplierId) REFERENCES [Supplier](Id));

CREATE TABLE [Meter](
    Id INT NOT NULL IDENTITY(1,1),
    ContractId INT NOT NULL,
    MeterNumber INT NOT NULL,
    Deleted BIT NOT NULL,
    PRIMARY KEY (Id),
    CONSTRAINT FK_ContractMeter FOREIGN KEY (ContractId) REFERENCES [Contract](Id));

CREATE TABLE [Consumption](
    Id INT NOT NULL IDENTITY(1,1),
    MeterId INT NOT NULL,
    Value VARCHAR(255) NOT NULL,
    Date DATETIME NOT NULL,
    PRIMARY KEY (Id),
    CONSTRAINT FK_Meter FOREIGN KEY (MeterId) REFERENCES [Meter](Id));