import {
  type inferRouterInputs,
  type inferRouterOutputs,
} from '@trpc/server'
import { router } from '@/utils/trpc'
import { menuRouter } from '@/server/routers/menu'
import { userRouter } from './routers/user'
import { restaurantRouter } from './routers/restaurant'
import { sectionRouter } from './routers/sections'
import { menuItemRouter } from './routers/menuItems'
import { verifyRouter } from './routers/verify'
import { feedbackRouter } from './routers/feedback'

export const appRouter = router({
  menu: menuRouter,
  user: userRouter,
  restaurant: restaurantRouter,
  menuItem: menuItemRouter,
  section: sectionRouter,
  verify: verifyRouter,
  feedback: feedbackRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
