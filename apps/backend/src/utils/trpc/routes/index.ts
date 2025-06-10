import { router } from '../server'
import { menuRouter } from './menu'
import { restaurantRouter } from './restaurant'
import { userRouter } from './user'

export const appRouter = router({
  menu: menuRouter,
  user: userRouter,
  restaurant: restaurantRouter,
})

export type AppRouter = typeof appRouter
