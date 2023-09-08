-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Account` (
	`id` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`providerAccountId` varchar(191) NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_in` int,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	CONSTRAINT `Account_id` PRIMARY KEY(`id`),
	CONSTRAINT `Account_provider_providerAccountId_key` UNIQUE(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `List` (
	`id` varchar(191) NOT NULL,
	`ownerId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `List_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ListMember` (
	`userId` varchar(191) NOT NULL,
	`listId` varchar(191) NOT NULL,
	`role` enum('VIEWER','COLLABORATOR','MODERATOR') NOT NULL DEFAULT 'VIEWER',
	CONSTRAINT `ListMember_listId_userId` PRIMARY KEY(`listId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `Media` (
	`id` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`isWatched` tinyint NOT NULL DEFAULT 0,
	`isLiked` tinyint,
	`listId` varchar(191) NOT NULL,
	CONSTRAINT `Media_id_listId_type` PRIMARY KEY(`id`,`listId`,`type`)
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` varchar(191) NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`),
	CONSTRAINT `Session_sessionToken_key` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`emailVerified` datetime(3),
	`image` varchar(191),
	`role` enum('ADMIN','STANDARD') NOT NULL DEFAULT 'STANDARD',
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `UserPreferences` (
	`watchProviderRegion` varchar(191),
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `UserPreferences_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `VerificationToken` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `VerificationToken_identifier_token_key` UNIQUE(`identifier`,`token`),
	CONSTRAINT `VerificationToken_token_key` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE INDEX `ListMember_listId_idx` ON `ListMember` (`listId`);--> statement-breakpoint
CREATE INDEX `Media_listId_idx` ON `Media` (`listId`);
*/