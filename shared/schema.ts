import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - stores Auth0 user information
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auth0Id: text("auth0_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  picture: text("picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Petitions table
export const petitions = pgTable("petitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  signatureGoal: integer("signature_goal").notNull().default(100),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("active"), // active, closed, successful
});

// Signatures table
export const signatures = pgTable("signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petitionId: varchar("petition_id").notNull().references(() => petitions.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  postcode: text("postcode").notNull(),
  verified: boolean("verified").notNull().default(false),
  verificationToken: text("verification_token"),
  consentToShare: boolean("consent_to_share").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petitionId: varchar("petition_id").notNull().references(() => petitions.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comments table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petitionId: varchar("petition_id").notNull().references(() => petitions.id, { onDelete: "cascade" }),
  signatureId: varchar("signature_id").references(() => signatures.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Decision Makers table
export const decisionMakers = pgTable("decision_makers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petitionId: varchar("petition_id").notNull().references(() => petitions.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  title: text("title"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  petitions: many(petitions),
  signatures: many(signatures),
}));

export const petitionsRelations = relations(petitions, ({ one, many }) => ({
  creator: one(users, {
    fields: [petitions.createdById],
    references: [users.id],
  }),
  signatures: many(signatures),
  announcements: many(announcements),
  comments: many(comments),
  decisionMakers: many(decisionMakers),
}));

export const signaturesRelations = relations(signatures, ({ one, many }) => ({
  petition: one(petitions, {
    fields: [signatures.petitionId],
    references: [petitions.id],
  }),
  user: one(users, {
    fields: [signatures.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  petition: one(petitions, {
    fields: [announcements.petitionId],
    references: [petitions.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  petition: one(petitions, {
    fields: [comments.petitionId],
    references: [petitions.id],
  }),
  signature: one(signatures, {
    fields: [comments.signatureId],
    references: [signatures.id],
  }),
}));

export const decisionMakersRelations = relations(decisionMakers, ({ one }) => ({
  petition: one(petitions, {
    fields: [decisionMakers.petitionId],
    references: [petitions.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPetitionSchema = createInsertSchema(petitions).omit({
  id: true,
  createdAt: true,
  createdById: true,
  status: true,
}).extend({
  signatureGoal: z.number().min(10).max(1000000),
});

export const updatePetitionSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  signatureGoal: z.number().min(10).max(1000000).optional(),
});

export const updatePetitionStatusSchema = z.object({
  status: z.enum(['closed', 'successful']),
});

export const insertSignatureSchema = createInsertSchema(signatures).omit({
  id: true,
  createdAt: true,
  userId: true,
  verified: true,
  verificationToken: true,
}).extend({
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  postcode: z.string().min(2),
  consentToShare: z.boolean().refine((val) => val === true, {
    message: "You must consent to share your information",
  }),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  signatureId: true,
});

export const insertDecisionMakerSchema = createInsertSchema(decisionMakers).omit({
  id: true,
  createdAt: true,
  petitionId: true,
}).extend({
  email: z.string().email(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPetition = z.infer<typeof insertPetitionSchema>;
export type UpdatePetition = z.infer<typeof updatePetitionSchema>;
export type UpdatePetitionStatus = z.infer<typeof updatePetitionStatusSchema>;
export type Petition = typeof petitions.$inferSelect;

export type InsertSignature = z.infer<typeof insertSignatureSchema>;
export type Signature = typeof signatures.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertDecisionMaker = z.infer<typeof insertDecisionMakerSchema>;
export type DecisionMaker = typeof decisionMakers.$inferSelect;

// Extended types with relations for frontend
export type PetitionWithCreator = Petition & {
  creator: User;
  _count?: {
    signatures: number;
  };
};

export type PetitionWithDetails = Petition & {
  creator: User;
  signatures: Signature[];
  signatureCount: number;
  hasUserSigned?: boolean;
};