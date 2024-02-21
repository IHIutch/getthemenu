import { Prisma } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().nullable(),
  stripeCustomerId: z.string().nullable(),
  stripeSubscriptionId: z.string().nullable(),
  trialEndsAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const

const HoursSchema = z.record(
  z.union([z.enum(DAYS_OF_WEEK), z.string()]),
  z.object({
    isOpen: z.boolean(),
    openTime: z.string(),
    closeTime: z.string(),
  }));

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().nullable(),
  hours: HoursSchema.nullable(),
  address: z.object({
    streetAddress: z.string(),
    zip: z.string(),
    city: z.string(),
    state: z.string()
  }).nullable(),
  phone: z.array(z.string()).nullable(),
  email: z.array(z.string().email()).nullable(),
  coverImage: z.object({
    blurDataUrl: z.string().optional(),
    src: z.string().url()
  }).nullable(),
  customHost: z.string().nullable(),
  customDomain: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const MenuSchema = z.object({
  id: z.number(),
  restaurantId: z.string().uuid(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  position: z.number().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const SectionSchema = z.object({
  id: z.number(),
  menuId: z.number(),
  restaurantId: z.string().uuid(),
  title: z.string().nullable(),
  position: z.number().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

export const MenuItemSchema = z.object({
  id: z.number(),
  restaurantId: z.string().uuid(),
  menuId: z.number(),
  sectionId: z.number(),
  title: z.string().nullable(),
  price: z.number().nullable(),
  description: z.string().nullable(),
  position: z.number().nullable(),
  image: z.object({
    blurDataUrl: z.string().optional(),
    src: z.string().url()
  }).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})
