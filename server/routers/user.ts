import { prismaGetUser } from "@/utils/prisma/users";
import { publicProcedure, router } from "@/utils/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
    getAuthedUser: publicProcedure.query(async ({ ctx }) => {

        if (!ctx.supabase) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `supabase not passed to ctx`,
            })
        }

        const { data: { user: authedUser }, error } = await ctx.supabase.auth.getUser()

        if (error) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `getAuthedUser error: ${error}`,
            })
        }

        if (!authedUser) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `getAuthedUser error: authedUser not found`,
            })
        }

        const data = await prismaGetUser({ id: authedUser.id })
        if (!data) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `getAuthedUser error: No user found with id '${authedUser.id}'`,
            })
        }

        return {
            id: data.id,
            fullName: data.fullName,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripeCustomerId: data.stripeCustomerId,
            restaurants: data.restaurants
        }
    })
})