import { prismaGetRestaurant } from "@/utils/prisma/restaurants";
import { publicProcedure, router } from "@/utils/trpc";
import { RestaurantSchema } from "@/utils/zod";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const restaurantRouter = router({
    getById: publicProcedure.input(
        z.object({
            where: RestaurantSchema.pick({ id: true })
        })
    ).query(async ({ input }) => {
        const { where } = input
        const data = await prismaGetRestaurant(where)
        if (!data) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `No restaurant found with id: '${where.id}'`,
            })
        }
        return data
    })
})