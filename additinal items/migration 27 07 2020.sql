-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.21 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table central_auth.apiclaims
CREATE TABLE IF NOT EXISTS `apiclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) NOT NULL,
  `ApiResourceId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiClaims_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiClaims_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.apiclaims: ~0 rows (approximately)
/*!40000 ALTER TABLE `apiclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiclaims` ENABLE KEYS */;

-- Dumping structure for table central_auth.apiproperties
CREATE TABLE IF NOT EXISTS `apiproperties` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Key` varchar(250) NOT NULL,
  `Value` varchar(2000) NOT NULL,
  `ApiResourceId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiProperties_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiProperties_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.apiproperties: ~0 rows (approximately)
/*!40000 ALTER TABLE `apiproperties` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiproperties` ENABLE KEYS */;

-- Dumping structure for table central_auth.apiresources
CREATE TABLE IF NOT EXISTS `apiresources` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Enabled` bit(1) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `DisplayName` varchar(200) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `Created` datetime(6) NOT NULL,
  `Updated` datetime(6) DEFAULT NULL,
  `LastAccessed` datetime(6) DEFAULT NULL,
  `NonEditable` bit(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_ApiResources_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.apiresources: ~1 rows (approximately)
/*!40000 ALTER TABLE `apiresources` DISABLE KEYS */;
INSERT INTO `apiresources` (`Id`, `Enabled`, `Name`, `DisplayName`, `Description`, `Created`, `Updated`, `LastAccessed`, `NonEditable`) VALUES
	(5, b'1', 'general_approval', 'General Approval', NULL, '2020-07-10 13:31:25.587106', NULL, NULL, b'0');
/*!40000 ALTER TABLE `apiresources` ENABLE KEYS */;

-- Dumping structure for table central_auth.apiscopeclaims
CREATE TABLE IF NOT EXISTS `apiscopeclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) NOT NULL,
  `ApiScopeId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiScopeClaims_ApiScopeId` (`ApiScopeId`),
  CONSTRAINT `FK_ApiScopeClaims_ApiScopes_ApiScopeId` FOREIGN KEY (`ApiScopeId`) REFERENCES `apiscopes` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.apiscopeclaims: ~0 rows (approximately)
/*!40000 ALTER TABLE `apiscopeclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `apiscopeclaims` ENABLE KEYS */;

-- Dumping structure for table central_auth.apiscopes
CREATE TABLE IF NOT EXISTS `apiscopes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) NOT NULL,
  `DisplayName` varchar(200) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `Required` bit(1) NOT NULL,
  `Emphasize` bit(1) NOT NULL,
  `ShowInDiscoveryDocument` bit(1) NOT NULL,
  `ApiResourceId` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_ApiScopes_Name` (`Name`),
  KEY `IX_ApiScopes_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiScopes_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.apiscopes: ~2 rows (approximately)
/*!40000 ALTER TABLE `apiscopes` DISABLE KEYS */;
INSERT INTO `apiscopes` (`Id`, `Name`, `DisplayName`, `Description`, `Required`, `Emphasize`, `ShowInDiscoveryDocument`, `ApiResourceId`) VALUES
	(3, 'general_approval', NULL, NULL, b'0', b'1', b'1', 5);
/*!40000 ALTER TABLE `apiscopes` ENABLE KEYS */;

-- Dumping structure for table central_auth.apisecrets
CREATE TABLE IF NOT EXISTS `apisecrets` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(1000) DEFAULT NULL,
  `Value` longtext NOT NULL,
  `Expiration` datetime(6) DEFAULT NULL,
  `Type` varchar(250) NOT NULL,
  `Created` datetime(6) NOT NULL,
  `ApiResourceId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiSecrets_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiSecrets_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.apisecrets: ~0 rows (approximately)
/*!40000 ALTER TABLE `apisecrets` DISABLE KEYS */;
INSERT INTO `apisecrets` (`Id`, `Description`, `Value`, `Expiration`, `Type`, `Created`, `ApiResourceId`) VALUES
	(1, NULL, 'aMJ0IQBqg661508BcV174YZ0AhQ4faYMYnTm2SoW1+s=', NULL, 'SharedSecret', '2020-07-10 21:30:42.000000', 5);
/*!40000 ALTER TABLE `apisecrets` ENABLE KEYS */;

-- Dumping structure for table central_auth.aspnetroleclaims
CREATE TABLE IF NOT EXISTS `aspnetroleclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` varchar(255) NOT NULL,
  `ClaimType` longtext,
  `ClaimValue` longtext,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.aspnetroleclaims: ~0 rows (approximately)
/*!40000 ALTER TABLE `aspnetroleclaims` DISABLE KEYS */;
INSERT INTO `aspnetroleclaims` (`Id`, `RoleId`, `ClaimType`, `ClaimValue`) VALUES
	(4, '9011d225-fd5b-47d0-9b86-2f5e2de75682', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role', 'general_approval:=coba_claim');
/*!40000 ALTER TABLE `aspnetroleclaims` ENABLE KEYS */;

-- Dumping structure for table central_auth.aspnetroles
CREATE TABLE IF NOT EXISTS `aspnetroles` (
  `Id` varchar(255) NOT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `NormalizedName` varchar(256) DEFAULT NULL,
  `ConcurrencyStamp` longtext,
  `ProjectApiName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`),
  KEY `IX_AspNetRoles_ProjectApiName` (`ProjectApiName`),
  CONSTRAINT `FK_AspNetRoles_Projects_ProjectApiName` FOREIGN KEY (`ProjectApiName`) REFERENCES `projects` (`ApiName`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.aspnetroles: ~5 rows (approximately)
/*!40000 ALTER TABLE `aspnetroles` DISABLE KEYS */;
INSERT INTO `aspnetroles` (`Id`, `Name`, `NormalizedName`, `ConcurrencyStamp`, `ProjectApiName`) VALUES
	('9011d225-fd5b-47d0-9b86-2f5e2de75682', 'general_approval:=test', 'GENERAL_APPROVAL:=TEST', '2a9d9ae1-ad5b-49d4-8cd1-48e29dd1db4c', 'general_approval'),
	('ADMIN', 'ADMIN', 'ADMIN', NULL, NULL),
	('DEVELOPER', 'DEVELOPER', 'DEVELOPER', NULL, NULL),
	('SUPERADMIN', 'SUPERADMIN', 'SUPERADMIN', NULL, NULL),
	('USER', 'USER', 'USER', NULL, NULL);
/*!40000 ALTER TABLE `aspnetroles` ENABLE KEYS */;

-- Dumping structure for table central_auth.aspnetuserclaims
CREATE TABLE IF NOT EXISTS `aspnetuserclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) NOT NULL,
  `ClaimType` longtext,
  `ClaimValue` longtext,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.aspnetuserclaims: ~0 rows (approximately)
/*!40000 ALTER TABLE `aspnetuserclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserclaims` ENABLE KEYS */;

-- Dumping structure for table central_auth.aspnetuserlogins
CREATE TABLE IF NOT EXISTS `aspnetuserlogins` (
  `LoginProvider` varchar(255) NOT NULL,
  `ProviderKey` varchar(255) NOT NULL,
  `ProviderDisplayName` longtext,
  `UserId` varchar(255) NOT NULL,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  KEY `IX_AspNetUserLogins_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.aspnetuserlogins: ~0 rows (approximately)
/*!40000 ALTER TABLE `aspnetuserlogins` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserlogins` ENABLE KEYS */;

-- Dumping structure for table central_auth.aspnetuserroles
CREATE TABLE IF NOT EXISTS `aspnetuserroles` (
  `UserId` varchar(255) NOT NULL,
  `RoleId` varchar(255) NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.aspnetuserroles: ~8 rows (approximately)
/*!40000 ALTER TABLE `aspnetuserroles` DISABLE KEYS */;
INSERT INTO `aspnetuserroles` (`UserId`, `RoleId`) VALUES
	('a6fb5ef3-68e2-4108-896c-17c6e154c689', '9011d225-fd5b-47d0-9b86-2f5e2de75682'),
	('96cd9034-d036-4bbd-84d7-37c0caf2b2cb', 'ADMIN'),
	('a6fb5ef3-68e2-4108-896c-17c6e154c689', 'SUPERADMIN'),
	('16136a91-8800-4c1a-bab5-c23aa2b966b0', 'USER'),
	('85114850-bf2b-4884-8235-71a4aa504e5e', 'USER'),
	('96cd9034-d036-4bbd-84d7-37c0caf2b2cb', 'USER'),
	('a6fb5ef3-68e2-4108-896c-17c6e154c689', 'USER');
/*!40000 ALTER TABLE `aspnetuserroles` ENABLE KEYS */;

-- Dumping structure for table central_auth.aspnetusers
CREATE TABLE IF NOT EXISTS `aspnetusers` (
  `Id` varchar(255) NOT NULL,
  `UserName` varchar(256) DEFAULT NULL,
  `NormalizedUserName` varchar(256) DEFAULT NULL,
  `Email` varchar(256) DEFAULT NULL,
  `NormalizedEmail` varchar(256) DEFAULT NULL,
  `EmailConfirmed` bit(1) NOT NULL,
  `PasswordHash` longtext,
  `SecurityStamp` longtext,
  `ConcurrencyStamp` longtext,
  `PhoneNumber` longtext,
  `PhoneNumberConfirmed` bit(1) NOT NULL,
  `TwoFactorEnabled` bit(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` bit(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  `DetailNik` varchar(255) NOT NULL,
  `DetailNik1` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `AK_AspNetUsers_DetailNik` (`DetailNik`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `IX_AspNetUsers_DetailNik1` (`DetailNik1`),
  KEY `EmailIndex` (`NormalizedEmail`),
  CONSTRAINT `FK_AspNetUsers_Users_DetailNik1` FOREIGN KEY (`DetailNik1`) REFERENCES `users` (`Nik`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.aspnetusers: ~2 rows (approximately)
/*!40000 ALTER TABLE `aspnetusers` DISABLE KEYS */;
INSERT INTO `aspnetusers` (`Id`, `UserName`, `NormalizedUserName`, `Email`, `NormalizedEmail`, `EmailConfirmed`, `PasswordHash`, `SecurityStamp`, `ConcurrencyStamp`, `PhoneNumber`, `PhoneNumberConfirmed`, `TwoFactorEnabled`, `LockoutEnd`, `LockoutEnabled`, `AccessFailedCount`, `DetailNik`, `DetailNik1`) VALUES
	('16136a91-8800-4c1a-bab5-c23aa2b966b0', '123', '123', 'qwe@gmail.com', 'QWE@GMAIL.COM', b'0', 'AQAAAAEAACcQAAAAEEnHiG0RVmqieT//YTBDuXD5AP2xxdX3FifrBft+A8669F16raxn/vaOS4vN1gxuag==', 'H5ALMXZVMG57EMPQ4WJHQ4PENC2O4BR4', 'b905b312-6183-4890-868c-c0ad606da5d2', NULL, b'0', b'0', NULL, b'1', 0, '123', NULL),
	('85114850-bf2b-4884-8235-71a4aa504e5e', '112', '112', 'asd@gmail.com', 'ASD@GMAIL.COM', b'0', 'AQAAAAEAACcQAAAAEO8d4Hsy7UfQ5Kf3SU1wnYXpMlXZmxIrlVmf4DqIxUBa4zbEZr9T2TjQRNO+SL/piA==', 'RYHZZOB4PWZHLPB7H4TVJ2HZFOH3PKXW', '03ba51dd-1ad3-45fd-8b09-6b8da02585ab', NULL, b'0', b'0', NULL, b'1', 0, '112', NULL),
	('96cd9034-d036-4bbd-84d7-37c0caf2b2cb', '2015169765', '2015169765', 'sulaimantriarjo@indomaret.co.id', 'SULAIMANTRIARJO@INDOMARET.CO.ID', b'0', 'AQAAAAEAACcQAAAAEC7xOK/Z0RawS2JfEJfv79lLWIajTtLyo53rIAl/FMOp60pnjJSqHFObQLmKF8Hhmw==', 'ZPLV7CEZXBMYNGWCK6ET4VNANBL3T533', 'ed411514-85d2-4e6f-aacb-e2337e518f8d', NULL, b'0', b'0', NULL, b'1', 0, '2015169765', NULL),
	('a6fb5ef3-68e2-4108-896c-17c6e154c689', '000', '000', 'sulaimantriarjo@indomaret.co.id', 'SULAIMANTRIARJO@INDOMARET.CO.ID', b'0', 'AQAAAAEAACcQAAAAEC7xOK/Z0RawS2JfEJfv79lLWIajTtLyo53rIAl/FMOp60pnjJSqHFObQLmKF8Hhmw==', 'J7II6JTX6U2SNDN62MFCKEZLOYFWARA5', '56f902a2-88c2-4e28-ae9a-c7b98fca7aaf', NULL, b'0', b'0', NULL, b'1', 0, '000', NULL);
/*!40000 ALTER TABLE `aspnetusers` ENABLE KEYS */;

-- Dumping structure for table central_auth.aspnetusertokens
CREATE TABLE IF NOT EXISTS `aspnetusertokens` (
  `UserId` varchar(255) NOT NULL,
  `LoginProvider` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Value` longtext,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.aspnetusertokens: ~0 rows (approximately)
/*!40000 ALTER TABLE `aspnetusertokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetusertokens` ENABLE KEYS */;

-- Dumping structure for table central_auth.branches
CREATE TABLE IF NOT EXISTS `branches` (
  `Kode` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `Singkatan` varchar(255) NOT NULL,
  `NamaCabang` longtext NOT NULL,
  `Keterangan` longtext,
  `Alamat` longtext,
  PRIMARY KEY (`Kode`),
  UNIQUE KEY `IX_Branches_Singkatan` (`Singkatan`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.branches: ~0 rows (approximately)
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;

-- Dumping structure for table central_auth.branchunits
CREATE TABLE IF NOT EXISTS `branchunits` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `CabangKode` varchar(255) DEFAULT NULL,
  `UnitKode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_BranchUnits_CabangKode` (`CabangKode`),
  KEY `IX_BranchUnits_UnitKode` (`UnitKode`),
  CONSTRAINT `FK_BranchUnits_Branches_CabangKode` FOREIGN KEY (`CabangKode`) REFERENCES `branches` (`Kode`) ON DELETE RESTRICT,
  CONSTRAINT `FK_BranchUnits_Units_UnitKode` FOREIGN KEY (`UnitKode`) REFERENCES `units` (`Kode`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.branchunits: ~0 rows (approximately)
/*!40000 ALTER TABLE `branchunits` DISABLE KEYS */;
/*!40000 ALTER TABLE `branchunits` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientclaims
CREATE TABLE IF NOT EXISTS `clientclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Type` varchar(250) NOT NULL,
  `Value` varchar(250) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientClaims_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientClaims_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientclaims: ~0 rows (approximately)
/*!40000 ALTER TABLE `clientclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientclaims` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientcorsorigins
CREATE TABLE IF NOT EXISTS `clientcorsorigins` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Origin` varchar(150) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientCorsOrigins_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientCorsOrigins_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientcorsorigins: ~0 rows (approximately)
/*!40000 ALTER TABLE `clientcorsorigins` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientcorsorigins` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientgranttypes
CREATE TABLE IF NOT EXISTS `clientgranttypes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GrantType` varchar(250) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientGrantTypes_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientGrantTypes_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientgranttypes: ~4 rows (approximately)
/*!40000 ALTER TABLE `clientgranttypes` DISABLE KEYS */;
INSERT INTO `clientgranttypes` (`Id`, `GrantType`, `ClientId`) VALUES
	(11, 'password', 6),
	(12, 'client_credentials', 6);
/*!40000 ALTER TABLE `clientgranttypes` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientidprestrictions
CREATE TABLE IF NOT EXISTS `clientidprestrictions` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Provider` varchar(200) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientIdPRestrictions_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientIdPRestrictions_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientidprestrictions: ~0 rows (approximately)
/*!40000 ALTER TABLE `clientidprestrictions` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientidprestrictions` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientpostlogoutredirecturis
CREATE TABLE IF NOT EXISTS `clientpostlogoutredirecturis` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PostLogoutRedirectUri` varchar(2000) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientPostLogoutRedirectUris_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientPostLogoutRedirectUris_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientpostlogoutredirecturis: ~0 rows (approximately)
/*!40000 ALTER TABLE `clientpostlogoutredirecturis` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientpostlogoutredirecturis` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientproperties
CREATE TABLE IF NOT EXISTS `clientproperties` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Key` varchar(250) NOT NULL,
  `Value` varchar(2000) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientProperties_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientProperties_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientproperties: ~0 rows (approximately)
/*!40000 ALTER TABLE `clientproperties` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientproperties` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientredirecturis
CREATE TABLE IF NOT EXISTS `clientredirecturis` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RedirectUri` varchar(2000) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientRedirectUris_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientRedirectUris_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientredirecturis: ~0 rows (approximately)
/*!40000 ALTER TABLE `clientredirecturis` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientredirecturis` ENABLE KEYS */;

-- Dumping structure for table central_auth.clients
CREATE TABLE IF NOT EXISTS `clients` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Enabled` bit(1) NOT NULL,
  `ClientId` varchar(200) NOT NULL,
  `ProtocolType` varchar(200) NOT NULL,
  `RequireClientSecret` bit(1) NOT NULL,
  `ClientName` varchar(200) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `ClientUri` varchar(2000) DEFAULT NULL,
  `LogoUri` varchar(2000) DEFAULT NULL,
  `RequireConsent` bit(1) NOT NULL,
  `AllowRememberConsent` bit(1) NOT NULL,
  `AlwaysIncludeUserClaimsInIdToken` bit(1) NOT NULL,
  `RequirePkce` bit(1) NOT NULL,
  `AllowPlainTextPkce` bit(1) NOT NULL,
  `AllowAccessTokensViaBrowser` bit(1) NOT NULL,
  `FrontChannelLogoutUri` varchar(2000) DEFAULT NULL,
  `FrontChannelLogoutSessionRequired` bit(1) NOT NULL,
  `BackChannelLogoutUri` varchar(2000) DEFAULT NULL,
  `BackChannelLogoutSessionRequired` bit(1) NOT NULL,
  `AllowOfflineAccess` bit(1) NOT NULL,
  `IdentityTokenLifetime` int NOT NULL,
  `AccessTokenLifetime` int NOT NULL,
  `AuthorizationCodeLifetime` int NOT NULL,
  `ConsentLifetime` int DEFAULT NULL,
  `AbsoluteRefreshTokenLifetime` int NOT NULL,
  `SlidingRefreshTokenLifetime` int NOT NULL,
  `RefreshTokenUsage` int NOT NULL,
  `UpdateAccessTokenClaimsOnRefresh` bit(1) NOT NULL,
  `RefreshTokenExpiration` int NOT NULL,
  `AccessTokenType` int NOT NULL,
  `EnableLocalLogin` bit(1) NOT NULL,
  `IncludeJwtId` bit(1) NOT NULL,
  `AlwaysSendClientClaims` bit(1) NOT NULL,
  `ClientClaimsPrefix` varchar(200) DEFAULT NULL,
  `PairWiseSubjectSalt` varchar(200) DEFAULT NULL,
  `Created` datetime(6) NOT NULL,
  `Updated` datetime(6) DEFAULT NULL,
  `LastAccessed` datetime(6) DEFAULT NULL,
  `UserSsoLifetime` int DEFAULT NULL,
  `UserCodeType` varchar(100) DEFAULT NULL,
  `DeviceCodeLifetime` int NOT NULL,
  `NonEditable` bit(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Clients_ClientId` (`ClientId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clients: ~2 rows (approximately)
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` (`Id`, `Enabled`, `ClientId`, `ProtocolType`, `RequireClientSecret`, `ClientName`, `Description`, `ClientUri`, `LogoUri`, `RequireConsent`, `AllowRememberConsent`, `AlwaysIncludeUserClaimsInIdToken`, `RequirePkce`, `AllowPlainTextPkce`, `AllowAccessTokensViaBrowser`, `FrontChannelLogoutUri`, `FrontChannelLogoutSessionRequired`, `BackChannelLogoutUri`, `BackChannelLogoutSessionRequired`, `AllowOfflineAccess`, `IdentityTokenLifetime`, `AccessTokenLifetime`, `AuthorizationCodeLifetime`, `ConsentLifetime`, `AbsoluteRefreshTokenLifetime`, `SlidingRefreshTokenLifetime`, `RefreshTokenUsage`, `UpdateAccessTokenClaimsOnRefresh`, `RefreshTokenExpiration`, `AccessTokenType`, `EnableLocalLogin`, `IncludeJwtId`, `AlwaysSendClientClaims`, `ClientClaimsPrefix`, `PairWiseSubjectSalt`, `Created`, `Updated`, `LastAccessed`, `UserSsoLifetime`, `UserCodeType`, `DeviceCodeLifetime`, `NonEditable`) VALUES
	(6, b'1', '1d1dec5b-e5b6-408a-a543-50733ab2334emTDO', 'oidc', b'1', 'general_approval', NULL, 'http:192.168.2.28', NULL, b'0', b'1', b'1', b'0', b'0', b'1', NULL, b'1', NULL, b'1', b'1', 43200, 43200, 300, NULL, 2592000, 1296000, 1, b'1', 0, 0, b'1', b'1', b'1', 'client_', NULL, '2020-07-10 13:31:25.342717', NULL, NULL, NULL, NULL, 300, b'0');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientscopes
CREATE TABLE IF NOT EXISTS `clientscopes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Scope` varchar(200) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientScopes_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientScopes_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientscopes: ~5 rows (approximately)
/*!40000 ALTER TABLE `clientscopes` DISABLE KEYS */;
INSERT INTO `clientscopes` (`Id`, `Scope`, `ClientId`) VALUES
	(31, 'general_approval', 6),
	(33, 'openid', 6),
	(34, 'profile', 6),
	(35, 'email', 6),
	(36, 'offline_access', 6);
/*!40000 ALTER TABLE `clientscopes` ENABLE KEYS */;

-- Dumping structure for table central_auth.clientsecrets
CREATE TABLE IF NOT EXISTS `clientsecrets` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(2000) DEFAULT NULL,
  `Value` longtext NOT NULL,
  `Expiration` datetime(6) DEFAULT NULL,
  `Type` varchar(250) NOT NULL,
  `Created` datetime(6) NOT NULL,
  `ClientId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientSecrets_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientSecrets_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.clientsecrets: ~2 rows (approximately)
/*!40000 ALTER TABLE `clientsecrets` DISABLE KEYS */;
INSERT INTO `clientsecrets` (`Id`, `Description`, `Value`, `Expiration`, `Type`, `Created`, `ClientId`) VALUES
	(6, NULL, 'aMJ0IQBqg661508BcV174YZ0AhQ4faYMYnTm2SoW1+s=', NULL, 'SharedSecret', '2020-07-10 13:31:25.343391', 6);
/*!40000 ALTER TABLE `clientsecrets` ENABLE KEYS */;

-- Dumping structure for table central_auth.departments
CREATE TABLE IF NOT EXISTS `departments` (
  `Kode` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `NamaDepartemen` longtext NOT NULL,
  `DirektoratKode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Kode`),
  KEY `IX_Departments_DirektoratKode` (`DirektoratKode`),
  CONSTRAINT `FK_Departments_Directorates_DirektoratKode` FOREIGN KEY (`DirektoratKode`) REFERENCES `directorates` (`Kode`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.departments: ~0 rows (approximately)
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;

-- Dumping structure for table central_auth.directorates
CREATE TABLE IF NOT EXISTS `directorates` (
  `Kode` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `NamaDirektorat` longtext NOT NULL,
  PRIMARY KEY (`Kode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.directorates: ~0 rows (approximately)
/*!40000 ALTER TABLE `directorates` DISABLE KEYS */;
/*!40000 ALTER TABLE `directorates` ENABLE KEYS */;

-- Dumping structure for table central_auth.identityclaims
CREATE TABLE IF NOT EXISTS `identityclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) NOT NULL,
  `IdentityResourceId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_IdentityClaims_IdentityResourceId` (`IdentityResourceId`),
  CONSTRAINT `FK_IdentityClaims_IdentityResources_IdentityResourceId` FOREIGN KEY (`IdentityResourceId`) REFERENCES `identityresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.identityclaims: ~17 rows (approximately)
/*!40000 ALTER TABLE `identityclaims` DISABLE KEYS */;
INSERT INTO `identityclaims` (`Id`, `Type`, `IdentityResourceId`) VALUES
	(1, 'sub', 1),
	(2, 'name', 2),
	(3, 'family_name', 2),
	(4, 'given_name', 2),
	(5, 'middle_name', 2),
	(6, 'nickname', 2),
	(7, 'preferred_username', 2),
	(8, 'profile', 2),
	(9, 'picture', 2),
	(10, 'website', 2),
	(11, 'gender', 2),
	(12, 'birthdate', 2),
	(13, 'zoneinfo', 2),
	(14, 'locale', 2),
	(15, 'updated_at', 2),
	(16, 'email', 3),
	(17, 'email_verified', 3);
/*!40000 ALTER TABLE `identityclaims` ENABLE KEYS */;

-- Dumping structure for table central_auth.identityproperties
CREATE TABLE IF NOT EXISTS `identityproperties` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Key` varchar(250) NOT NULL,
  `Value` varchar(2000) NOT NULL,
  `IdentityResourceId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_IdentityProperties_IdentityResourceId` (`IdentityResourceId`),
  CONSTRAINT `FK_IdentityProperties_IdentityResources_IdentityResourceId` FOREIGN KEY (`IdentityResourceId`) REFERENCES `identityresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.identityproperties: ~0 rows (approximately)
/*!40000 ALTER TABLE `identityproperties` DISABLE KEYS */;
/*!40000 ALTER TABLE `identityproperties` ENABLE KEYS */;

-- Dumping structure for table central_auth.identityresources
CREATE TABLE IF NOT EXISTS `identityresources` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Enabled` bit(1) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `DisplayName` varchar(200) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `Required` bit(1) NOT NULL,
  `Emphasize` bit(1) NOT NULL,
  `ShowInDiscoveryDocument` bit(1) NOT NULL,
  `Created` datetime(6) NOT NULL,
  `Updated` datetime(6) DEFAULT NULL,
  `NonEditable` bit(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_IdentityResources_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.identityresources: ~4 rows (approximately)
/*!40000 ALTER TABLE `identityresources` DISABLE KEYS */;
INSERT INTO `identityresources` (`Id`, `Enabled`, `Name`, `DisplayName`, `Description`, `Required`, `Emphasize`, `ShowInDiscoveryDocument`, `Created`, `Updated`, `NonEditable`) VALUES
	(1, b'1', 'openid', 'Your user identifier', NULL, b'1', b'0', b'1', '2020-06-24 07:16:31.673850', NULL, b'0'),
	(2, b'1', 'profile', 'User profile', 'Your user profile information (first name, last name, etc.)', b'0', b'1', b'1', '2020-06-24 07:17:46.142626', NULL, b'0'),
	(3, b'1', 'email', 'Your email address', NULL, b'0', b'1', b'1', '2020-06-24 07:17:47.467105', NULL, b'0');
/*!40000 ALTER TABLE `identityresources` ENABLE KEYS */;

-- Dumping structure for table central_auth.projectclaims
CREATE TABLE IF NOT EXISTS `projectclaims` (
  `Id` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `ProjekApiName` varchar(255) NOT NULL,
  `ClaimName` longtext NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ProjectClaims_ProjekApiName` (`ProjekApiName`),
  CONSTRAINT `FK_ProjectClaims_Projects_ProjekApiName` FOREIGN KEY (`ProjekApiName`) REFERENCES `projects` (`ApiName`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.projectclaims: ~0 rows (approximately)
/*!40000 ALTER TABLE `projectclaims` DISABLE KEYS */;
INSERT INTO `projectclaims` (`Id`, `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`, `ProjekApiName`, `ClaimName`) VALUES
	('ad3c7985-8bb6-40da-a21c-60bd0c64adb5', '2020-07-13 19:41:42.871085', NULL, NULL, NULL, 'general_approval', 'general_approval:=coba_claim');
/*!40000 ALTER TABLE `projectclaims` ENABLE KEYS */;

-- Dumping structure for table central_auth.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `ApiName` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `Url` longtext NOT NULL,
  `Type` longtext NOT NULL,
  `NamaProject` longtext NOT NULL,
  `ClientId` varchar(255) NOT NULL,
  `ClientSecret` longtext NOT NULL,
  `DeveloperNik` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ApiName`),
  UNIQUE KEY `IX_Projects_ClientId` (`ClientId`),
  KEY `IX_Projects_DeveloperNik` (`DeveloperNik`),
  CONSTRAINT `FK_Projects_Users_DeveloperNik` FOREIGN KEY (`DeveloperNik`) REFERENCES `users` (`Nik`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.projects: ~1 rows (approximately)
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` (`ApiName`, `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`, `Url`, `Type`, `NamaProject`, `ClientId`, `ClientSecret`, `DeveloperNik`) VALUES
	('general_approval', '2020-07-10 20:31:24.648130', NULL, NULL, NULL, 'http:192.168.2.28', 'Dev', 'General Approval', '1d1dec5b-e5b6-408a-a543-50733ab2334emTDO', 'GqCDs0dvxvPi9SP5ewz4vyC', '000');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;

-- Dumping structure for table central_auth.projecttoprojects
CREATE TABLE IF NOT EXISTS `projecttoprojects` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `ProjekApiName` varchar(255) NOT NULL,
  `KolaborasiApiName` varchar(255) NOT NULL,
  `Approve` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ProjectToProjects_ProjekApiName` (`ProjekApiName`),
  KEY `IX_ProjectToProjects_KolaborasiApiName` (`KolaborasiApiName`),
  CONSTRAINT `FK_ProjectToProjects_Projects_KolaborasiApiName` FOREIGN KEY (`KolaborasiApiName`) REFERENCES `projects` (`ApiName`) ON DELETE CASCADE,
  CONSTRAINT `FK_ProjectToProjects_Projects_ProjekApiName` FOREIGN KEY (`ProjekApiName`) REFERENCES `projects` (`ApiName`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.projecttoprojects: ~1 rows (approximately)
/*!40000 ALTER TABLE `projecttoprojects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projecttoprojects` ENABLE KEYS */;

-- Dumping structure for table central_auth.subdepartments
CREATE TABLE IF NOT EXISTS `subdepartments` (
  `Kode` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `NamaSubDepartemen` longtext NOT NULL,
  `DepartemenKode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Kode`),
  KEY `IX_SubDepartments_DepartemenKode` (`DepartemenKode`),
  CONSTRAINT `FK_SubDepartments_Departments_DepartemenKode` FOREIGN KEY (`DepartemenKode`) REFERENCES `departments` (`Kode`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.subdepartments: ~0 rows (approximately)
/*!40000 ALTER TABLE `subdepartments` DISABLE KEYS */;
/*!40000 ALTER TABLE `subdepartments` ENABLE KEYS */;

-- Dumping structure for table central_auth.units
CREATE TABLE IF NOT EXISTS `units` (
  `Kode` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `NamaUnit` longtext NOT NULL,
  `Keterangan` longtext,
  PRIMARY KEY (`Kode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.units: ~0 rows (approximately)
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
/*!40000 ALTER TABLE `units` ENABLE KEYS */;

-- Dumping structure for table central_auth.userprojects
CREATE TABLE IF NOT EXISTS `userprojects` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `PenggunaNik` varchar(255) DEFAULT NULL,
  `ProjekApiName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_UserProjects_PenggunaNik` (`PenggunaNik`),
  KEY `IX_UserProjects_ProjekApiName` (`ProjekApiName`),
  CONSTRAINT `FK_UserProjects_Projects_ProjekApiName` FOREIGN KEY (`ProjekApiName`) REFERENCES `projects` (`ApiName`) ON DELETE RESTRICT,
  CONSTRAINT `FK_UserProjects_Users_PenggunaNik` FOREIGN KEY (`PenggunaNik`) REFERENCES `users` (`Nik`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.userprojects: ~1 rows (approximately)
/*!40000 ALTER TABLE `userprojects` DISABLE KEYS */;
INSERT INTO `userprojects` (`Id`, `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`, `PenggunaNik`, `ProjekApiName`) VALUES
	(6, '2020-07-12 17:26:11.093394', '', NULL, NULL, '000', 'general_approval');
/*!40000 ALTER TABLE `userprojects` ENABLE KEYS */;

-- Dumping structure for table central_auth.users
CREATE TABLE IF NOT EXISTS `users` (
  `Nik` varchar(255) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CreatedBy` longtext,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` longtext,
  `Nama` longtext NOT NULL,
  `Email` longtext NOT NULL,
  `Ext` longtext,
  `AtasanNik` varchar(255) DEFAULT NULL,
  `SubDepartemenKode` varchar(255) DEFAULT NULL,
  `DepartemenKode` varchar(255) DEFAULT NULL,
  `DirektoratKode` varchar(255) DEFAULT NULL,
  `CabangKode` varchar(255) DEFAULT NULL,
  `UnitKode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Nik`),
  KEY `IX_Users_AtasanNik` (`AtasanNik`),
  KEY `IX_Users_CabangKode` (`CabangKode`),
  KEY `IX_Users_DepartemenKode` (`DepartemenKode`),
  KEY `IX_Users_DirektoratKode` (`DirektoratKode`),
  KEY `IX_Users_SubDepartemenKode` (`SubDepartemenKode`),
  KEY `IX_Users_UnitKode` (`UnitKode`),
  CONSTRAINT `FK_Users_Branches_CabangKode` FOREIGN KEY (`CabangKode`) REFERENCES `branches` (`Kode`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Users_Departments_DepartemenKode` FOREIGN KEY (`DepartemenKode`) REFERENCES `departments` (`Kode`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Users_Directorates_DirektoratKode` FOREIGN KEY (`DirektoratKode`) REFERENCES `directorates` (`Kode`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Users_SubDepartments_SubDepartemenKode` FOREIGN KEY (`SubDepartemenKode`) REFERENCES `subdepartments` (`Kode`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Users_Units_UnitKode` FOREIGN KEY (`UnitKode`) REFERENCES `units` (`Kode`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Users_Users_AtasanNik` FOREIGN KEY (`AtasanNik`) REFERENCES `users` (`Nik`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.users: ~2 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`Nik`, `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`, `Nama`, `Email`, `Ext`, `AtasanNik`, `SubDepartemenKode`, `DepartemenKode`, `DirektoratKode`, `CabangKode`, `UnitKode`) VALUES
	('000', '2020-06-24 14:19:00.259765', NULL, NULL, NULL, 'Sulaiman Triarjo', 'sulaimantriarjo@indomaret.co.id', '321', NULL, NULL, NULL, NULL, NULL, NULL),
	('112', '2020-06-24 20:17:14.667318', NULL, NULL, NULL, 'asd', 'asd@gmail.com', '123', NULL, NULL, NULL, NULL, NULL, NULL),
	('123', '2020-06-24 20:15:57.091344', NULL, NULL, NULL, 'qwe', 'qwe@gmail.com', '111', NULL, NULL, NULL, NULL, NULL, NULL),
	('2015169765', '2020-07-08 18:55:58.962276', NULL, NULL, NULL, 'Sulaiman Triarjo', 'sulaimantriarjo@indomaret.co.id', '321', NULL, NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table central_auth.__efmigrationshistory
CREATE TABLE IF NOT EXISTS `__efmigrationshistory` (
  `MigrationId` varchar(95) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table central_auth.__efmigrationshistory: ~5 rows (approximately)
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
	('20200622042503_InitialAppDbContext', '2.2.6-servicing-10079'),
	('20200624071258_InitialIdentityServerConfigurationDbMigration', '2.2.6-servicing-10079'),
	('20200702010353_updateProj2ProjTable', '2.2.6-servicing-10079'),
	('20200705230829_addProjectClaim', '2.2.6-servicing-10079'),
	('20200706012911_addProjectClaimAddRelation', '2.2.6-servicing-10079');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
