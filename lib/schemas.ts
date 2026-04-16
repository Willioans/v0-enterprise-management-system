// lib/schemas.ts
import { z } from 'zod';

// Enums
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SALES = 'sales',
  INVENTORY = 'inventory',
  FINANCE = 'finance',
  HR = 'hr',
  CUSTOMER = 'customer'
}

export enum BusinessModule {
  GYM = 'gym',
  RESTAURANT = 'restaurant',
  STORE = 'store',
  PARTS = 'parts'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  MXN = 'MXN',
  COP = 'COP',
  BRL = 'BRL',
  ARS = 'ARS',
  CLP = 'CLP',
  PEN = 'PEN',
  VES = 'VES',
  UYU = 'UYU',
  DOP = 'DOP',
  GTQ = 'GTQ',
  HNL = 'HNL'
}

export enum Language {
  ES = 'es',
  EN = 'en',
  PT = 'pt'
}

// Zod Schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  organizationId: z.string(),
  status: z.enum(['active', 'inactive']),
  mfaEnabled: z.boolean().default(false),
  avatar: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  businessType: z.nativeEnum(BusinessModule),
  industry: z.string(),
  country: z.string(),
  currency: z.nativeEnum(Currency),
  language: z.nativeEnum(Language),
  logo: z.string().optional(),
  theme: z.record(z.string()).optional(),
  modules: z.array(z.nativeEnum(BusinessModule)),
  branchesCount: z.number(),
  usersCount: z.number(),
  subscriptionLevel: z.enum(['starter', 'professional', 'enterprise']),
  subscriptionEndDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BranchSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  phone: z.string(),
  manager: z.string(), // User ID
  status: z.enum(['active', 'inactive']),
  openingHours: z.record(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProductSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  branchId: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  sku: z.string(),
  barcode: z.string().optional(),
  category: z.string(),
  price: z.number().positive(),
  cost: z.number().positive().optional(),
  stock: z.number().nonnegative(),
  taxRate: z.number().nonnegative().optional(),
  image: z.string().optional(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TransactionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  branchId: z.string(),
  type: z.enum(['sale', 'expense', 'income', 'transfer']),
  amount: z.number(),
  currency: z.nativeEnum(Currency),
  description: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    subtotal: z.number(),
  })).optional(),
  paymentMethod: z.enum(['cash', 'card', 'transfer', 'check']),
  status: z.enum(['pending', 'completed', 'cancelled']),
  createdBy: z.string(), // User ID
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AuditLogSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  action: z.string(),
  module: z.string(),
  entityId: z.string(),
  changes: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  timestamp: z.date(),
});

// GYM Module Specific
export const GymMembershipSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  branchId: z.string(),
  memberId: z.string(),
  planName: z.string(),
  planDuration: z.number(), // Days
  startDate: z.date(),
  endDate: z.date(),
  monthlyFee: z.number(),
  status: z.enum(['active', 'expired', 'suspended', 'cancelled']),
  autoRenewal: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GymMemberSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  branchId: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
  birthDate: z.date().optional(),
  idNumber: z.string().optional(),
  biometricData: z.object({
    facialId: z.string().optional(),
    fingerprintId: z.string().optional(),
    qrCode: z.string().optional(),
  }).optional(),
  medicalHistory: z.string().optional(),
  bodyMeasurements: z.array(z.object({
    date: z.date(),
    weight: z.number(),
    height: z.number(),
    bodyFat: z.number().optional(),
  })).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type GymMembership = z.infer<typeof GymMembershipSchema>;
export type GymMember = z.infer<typeof GymMemberSchema>;
