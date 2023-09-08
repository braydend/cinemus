import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  unique,
  varchar,
  text,
  int,
  datetime,
  index,
  mysqlEnum,
  tinyint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const account = mysqlTable(
  "Account",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).references(() => user.id),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refreshToken: text("refresh_token"),
    refreshTokenExpiresIn: int("refresh_token_expires_in"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 191 }),
  },
  (table) => {
    return {
      accountId: primaryKey(table.id),
      accountProviderProviderAccountIdKey: unique(
        "Account_provider_providerAccountId_key"
      ).on(table.provider, table.providerAccountId),
    };
  }
);

export const list = mysqlTable(
  "List",
  {
    id: varchar("id", { length: 191 }).notNull(),
    // ownerId: varchar("ownerId", { length: 191 }).notNull(),
    ownerId: varchar("ownerId", { length: 191 }).references(() => user.id),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      listId: primaryKey(table.id),
    };
  }
);

export const listMember = mysqlTable(
  "ListMember",
  {
    userId: varchar("userId", { length: 191 }).references(() => user.id),
    listId: varchar("listId", { length: 191 }).references(() => list.id),
    role: mysqlEnum("role", ["VIEWER", "COLLABORATOR", "MODERATOR"])
      .default("VIEWER")
      .notNull(),
  },
  (table) => {
    return {
      listIdIdx: index("ListMember_listId_idx").on(table.listId),
      listMemberListIdUserId: primaryKey(table.listId, table.userId),
    };
  }
);

export const media = mysqlTable(
  "Media",
  {
    id: varchar("id", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    isWatched: tinyint("isWatched").default(0).notNull(),
    isLiked: tinyint("isLiked"),
    listId: varchar("listId", { length: 191 }).references(() => list.id),
  },
  (table) => {
    return {
      listIdIdx: index("Media_listId_idx").on(table.listId),
      mediaIdListIdType: primaryKey(table.id, table.listId, table.type),
    };
  }
);

export const session = mysqlTable(
  "Session",
  {
    id: varchar("id", { length: 191 }).notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).references(() => user.id),
    expires: datetime("expires", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      sessionId: primaryKey(table.id),
      sessionSessionTokenKey: unique("Session_sessionToken_key").on(
        table.sessionToken
      ),
    };
  }
);

export const user = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }),
    emailVerified: datetime("emailVerified", { mode: "string", fsp: 3 }),
    image: varchar("image", { length: 191 }),
    role: mysqlEnum("role", ["ADMIN", "STANDARD"])
      .default("STANDARD")
      .notNull(),
  },
  (table) => {
    return {
      userId: primaryKey(table.id),
      userEmailKey: unique("User_email_key").on(table.email),
    };
  }
);

export const userPreferences = mysqlTable(
  "UserPreferences",
  {
    watchProviderRegion: varchar("watchProviderRegion", { length: 191 }),
    userId: varchar("userId", { length: 191 }).references(() => user.id),
  },
  (table) => {
    return {
      userPreferencesUserId: primaryKey(table.userId),
    };
  }
);

export const verificationToken = mysqlTable(
  "VerificationToken",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      verificationTokenIdentifierTokenKey: unique(
        "VerificationToken_identifier_token_key"
      ).on(table.identifier, table.token),
      verificationTokenTokenKey: unique("VerificationToken_token_key").on(
        table.token
      ),
    };
  }
);
