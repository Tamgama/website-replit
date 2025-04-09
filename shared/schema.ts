import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enumeración para roles de usuario
export const roleEnum = pgEnum("role", ["propietario", "agencia"]);

// Tabla de usuarios
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").default(""),
  email: text("email").default(""),
  role: roleEnum("role").notNull().default("propietario"),
  valuation_history: text("valuation_history").array().default([]),
  last_valuation: text("last_valuation").default(""),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de propiedades
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  address: text("address").notNull(),
  location: text("location").notNull(),
  size: integer("size").notNull(),
  rooms: integer("rooms").default(0),
  bathrooms: integer("bathrooms").default(0),
  price: integer("price").default(0),
  description: text("description").default(""),
  sale_type: text("sale_type").notNull(), // "secreta" o "publica"
  status: text("status").default("pendiente"), // pendiente, en_proceso, vendida
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Esquemas para inserción
export const insertUserSchema = createInsertSchema(users).pick({
  phone: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  user_id: true,
  title: true,
  address: true,
  location: true,
  size: true,
  rooms: true,
  bathrooms: true,
  price: true,
  description: true,
  sale_type: true,
});

// Tipos
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
