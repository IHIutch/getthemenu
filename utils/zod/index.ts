import { Prisma } from "@prisma/client";
import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    fullName: z.string().nullable().optional(),
    stripeCustomerId: z.string().nullable().optional(),
    stripeSubscriptionId: z.string().nullable().optional(),
    trialEndsAt: z.date().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable().optional()
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
    hours: HoursSchema.optional(),
    address: z.object({
        streetAddress: z.string(),
        zip: z.string(),
        city: z.string(),
        state: z.string()
    }),
    phone: z.array(z.string()),
    email: z.array(z.string().email()),
    coverImage: z.object({
        blurDataUrl: z.string().optional(),
        src: z.string().url()
    }),
    customHost: z.string().nullable(),
    customDomain: z.string().url().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
})

export const MenuSchema = z.object({
    id: z.number(),
    restaurantId: z.string().uuid(),
    title: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    position: z.number().nullable().optional(),
    description: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable().optional(),
})