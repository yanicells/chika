import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { isAdmin } from "@/lib/auth-helper";
import { time } from "console";
import { title } from "process";
import { create } from "domain";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").notNull().default("user"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  userName: text("userName"),
  isAdmin: boolean("isAdmin").notNull().default(false),
  imageUrl: text("imageUrl"),
  color: text("color").notNull().default("#ffffff"),
  isPrivate: boolean("isPrivate").notNull().default(false),
  isPinned: boolean("isPinned").notNull().default(false),
  isDeleted: boolean("isDeleted").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  noteId: text("noteId")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  userName: text("userName"),
  isAdmin: boolean("isAdmin").notNull().default(false),
  content: text("content").notNull(),
  isDeleted: boolean("isDeleted").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blogPosts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImageUrl: text("coverImageUrl"),
  isPublished: boolean("isPublished").notNull().default(false),
  isPinned: boolean("isPinned").notNull().default(false),
  isDeleted: boolean("isDeleted").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
});

export const reactions = pgTable("reactions", {
  id: text("id").primaryKey(),
  noteId: text("noteId").references(() => notes.id, { onDelete: "cascade" }),
  commentId: text("commentId").references(() => comments.id, {
    onDelete: "cascade",
  }),
  blogPostId: text("blogPostId").references(() => blogPosts.id, {
    onDelete: "cascade",
  }),
  isAdmin: boolean("isAdmin").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const notesRelations = relations(notes, ({ many }) => ({
  comments: many(comments),
  reactions: many(reactions),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  note: one(notes, {
    fields: [comments.noteId],
    references: [notes.id],
  }),
  reactions: many(reactions),
}));

export const blogPostsRelations = relations(blogPosts, ({ many }) => ({
  reactions: many(reactions),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  note: one(notes, {
    fields: [reactions.noteId],
    references: [notes.id],
  }),
  comment: one(comments, {
    fields: [reactions.commentId],
    references: [comments.id],
  }),
  blogPost: one(blogPosts, {
    fields: [reactions.blogPostId],
    references: [blogPosts.id],
  })
}));

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type Reaction = typeof reactions.$inferSelect;
export type NewReaction = typeof reactions.$inferInsert;

export const schema = {
  user,
  session,
  account,
  verification,
  notes,
  comments,
  blogPosts,
  reactions,
};
