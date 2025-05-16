import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().nullable(),
  stripeCustomerId: z.string().nullable(),
  stripeSubscriptionId: z.string().nullable(),
  trialEndsAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

const HoursSchema = z.record(
  z.union([z.enum(DAYS_OF_WEEK), z.string()]),
  z.object({
    isOpen: z.boolean(),
    openTime: z.string(),
    closeTime: z.string(),
  }),
)

export const CustomHostSchema = z.string().max(63)

export const ImageSchema = z.object({
  src: z.string().url(),
  blurDataURL: z.string().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  hexColor: z.string().optional(),
})

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().nullable(),
  hours: HoursSchema.optional().transform(val => val ?? undefined),
  address: z.object({
    streetAddress: z.string(),
    zip: z.string(),
    city: z.string(),
    state: z.string(),
  }).optional().transform(val => val ?? undefined),
  phone: z.array(z.string()).optional().transform(val => val ?? undefined),
  email: z.array(z.string().email()).optional().transform(val => val ?? undefined),
  coverImage: ImageSchema.optional().transform(val => val ?? undefined),
  customHost: CustomHostSchema.nullable(),
  customDomain: z.string().nullable(),
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
  deletedAt: z.date().nullable(),
})

export const MenuItemSchema = z.object({
  id: z.number(),
  restaurantId: z.string().uuid(),
  menuId: z.number(),
  sectionId: z.number(),
  title: z.string().nullable(),
  price: z.number().nullable(),
  description: z.string().nullable(),
  position: z.coerce.number().nullable(),
  image: ImageSchema.optional().transform(val => val ?? undefined),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

export const FeedbackSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().nullable(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})
