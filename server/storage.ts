import { users, properties, type User, type InsertUser, type Property, type InsertProperty } from "@shared/schema";
import { db } from "./db";
import { and, desc, eq } from "drizzle-orm";

// Interfaz de almacenamiento con métodos para usuarios y propiedades
export interface IStorage {
  // Usuarios
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserValuation(userId: number, valuationData: string): Promise<User | undefined>;
  
  // Propiedades
  getProperty(id: number): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByUserId(userId: number): Promise<Property[]>;
  getAllPropertiesWithOwners(): Promise<(Property & { owner: User })[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updatePropertyStatus(id: number, status: string): Promise<Property | undefined>;
}

// Implementación de almacenamiento usando PostgreSQL
export class DatabaseStorage implements IStorage {
  // Métodos para usuarios
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.created_at));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserValuation(userId: number, valuationData: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Aseguramos que valuation_history sea un array
    const history = Array.isArray(user.valuation_history) ? user.valuation_history : [];
    const newValuationHistory = [...history, valuationData];
    
    const [updatedUser] = await db
      .update(users)
      .set({
        valuation_history: newValuationHistory,
        last_valuation: valuationData
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }
  
  // Métodos para propiedades
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }
  
  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.created_at));
  }
  
  async getPropertiesByUserId(userId: number): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.user_id, userId))
      .orderBy(desc(properties.created_at));
  }
  
  async getAllPropertiesWithOwners(): Promise<(Property & { owner: User })[]> {
    const result = await db
      .select({
        property: properties,
        owner: users
      })
      .from(properties)
      .innerJoin(users, eq(properties.user_id, users.id))
      .orderBy(desc(properties.created_at));
    
    return result.map(item => ({
      ...item.property,
      owner: item.owner
    }));
  }
  
  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    
    return newProperty;
  }
  
  async updatePropertyStatus(id: number, status: string): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ status })
      .where(eq(properties.id, id))
      .returning();
    
    return updatedProperty;
  }
}

// Usar la implementación de base de datos
export const storage = new DatabaseStorage();
