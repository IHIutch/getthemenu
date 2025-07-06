import prisma from '~/utils/db'

import { authedProcedure, router } from '../server'

export const userRouter = router({
  getAuthedUser: authedProcedure.query(async ({ ctx }) => {
    console.log('getAuthedUser called')
    const authedUser = ctx.user
    const user = await prisma.users.findUnique({
      where: {
        uuid: authedUser.id,
      },
    })

    return user
  }),
})
