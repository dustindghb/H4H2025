import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  type: text("type", { enum: ["student", "professional"] }),
});

export const userSelectSchema = createSelectSchema(user);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const sessionSelectSchema = createSelectSchema(user);

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
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const student = pgTable("student", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  skills: text("skills").array().notNull(),
  workEnvironments: text("work_environments").array().notNull(),
  coreValues: text("core_values").notNull(),
  industryInterests: text("industry_interests").array().notNull(),
  learningStyles: text("learning_styles").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userPreferencesSelectSchema = createSelectSchema(student);
export const userPreferencesinsertSchema = createInsertSchema(student);

export const professional = pgTable("professional", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  // Career Basics
  bio: text("bio").notNull(),
  industry: text("industry").notNull(),
  currentRole: text("current_role").notNull(),
  company: text("company"),
  yearsExperience: integer("years_experience").notNull(),
  yearsInCurrentRole: integer("years_in_current_role").notNull(),

  // Career Growth
  careerTimeline: text("career_timeline").notNull(),
  careerJourney: text("career_journey").notNull(),

  // Day-to-Day Work
  coreDailyActivities: text("core_daily_activities").notNull(),
  toolsAndTechnology: text("tools_and_technology").notNull(),

  // Skills
  technicalSkills: text("technical_skills").notNull(),
  softSkills: text("soft_skills").notNull(),

  // Industry & Development
  industryTrends: text("industry_trends").notNull(),
  professionalDevelopmentActivities: text(
    "professional_development_activities"
  ),

  // Advice & Success Factors
  adviceForNewcomers: text("advice_for_newcomers").notNull(),
  keySuccessFactors: text("key_success_factors").notNull(),

  // Optional Fields
  resources: text("resources"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const professionalSelectSchema = createSelectSchema(professional);
export const professionalinsertSchema = createInsertSchema(professional).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
