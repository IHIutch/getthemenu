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

export const CustomHostSchema = z.string().max(63)

export const ImageSchema = z.object({
  blurDataURL: z.string(),
  src: z.string().url(),
  height: z.number(),
  width: z.number(),
  hexColor: z.string()
}).partial()

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().nullable(),
  hours: z.preprocess(val => val === null ? undefined : val,
    HoursSchema.optional()),
  address: z.preprocess(val => val === null ? undefined : val,
    z.object({
      streetAddress: z.string(),
      zip: z.string(),
      city: z.string(),
      state: z.string()
    }).optional()),
  phone: z.preprocess((val) => val === null ? undefined : val,
    z.array(z.string()).optional()),
  email: z.preprocess((val) => val === null ? undefined : val,
    z.array(z.string().email()).optional()),
  coverImage: z.preprocess((val) => val === null ? undefined : val, ImageSchema.optional()),
  customHost: CustomHostSchema.nullable(),
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
  image: z.preprocess((val) => val === null ? undefined : val, ImageSchema.optional()),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

export const FeedbackSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().nullable(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})
