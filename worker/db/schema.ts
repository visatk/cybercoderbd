import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "customer"] }).default("customer").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull(), // e.g., 29.99
  assetPath: text("asset_path").notNull(), // Path in R2 bucket (e.g., "ebooks/react-guide.pdf")
  imageUrl: text("image_url"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  stripeSessionId: text("stripe_session_id"),
  totalAmount: real("total_amount").notNull(),
  status: text("status", { enum: ["pending", "completed", "failed"] }).default("pending").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const purchases = sqliteTable("purchases", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull().references(() => products.id),
  orderId: text("order_id").notNull().references(() => orders.id),
  purchasedAt: integer("purchased_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});
