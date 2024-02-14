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

export const RestaurantSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    hours: z.object({
        'Sunday': z.object({
            isOpen: z.boolean(),
            openTime: z.string(),
            closeTime: z.string(),
        }),
        'Monday': z.object({
            isOpen: z.boolean(),
            openTime: z.string(),
            closeTime: z.string(),
        }),
        'Tuesday': z.object({
            isOpen: z.boolean(),
            openTime: z.string(),
            closeTime: z.string(),
        }),
        'Wednesday': z.object({
            isOpen: z.boolean(),
            openTime: z.string(),
            closeTime: z.string(),
        }),
        'Thursday': z.object({
            isOpen: z.boolean(),
            openTime: z.string(),
            closeTime: z.string(),
        }),
        'Friday': z.object({
            isOpen: z.boolean(),
            openTime: z.string(),
            closeTime: z.string(),
        }),
        'Saturday': z.object({
            isOpen: z.boolean(),
            openTime: z.string(),
            closeTime: z.string(),
        }),
    }).nullable().optional(),
    address: z.object({
        streetAddress: z.string(),
        zip: z.string(),
        city: z.string(),
        state: z.string()
    }).nullable().optional(),
    phone: z.array(z.string()).nullable().optional(),
    email: z.array(z.string().email()).nullable().optional(),
    coverImage: z.object({
        blurDataUrl: z.string().optional(),
        src: z.string().url()
    }).nullable().optional(),
    customHost: z.string().nullable().optional(),
    customDomain: z.string().url().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable().optional(),
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