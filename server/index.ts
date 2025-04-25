import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { menuRouter } from '@/server/routers/menu'
import { router } from '@/utils/trpc'
import { feedbackRouter } from './routers/feedback'
import { menuItemRouter } from './routers/menuItems'
import { restaurantRouter } from './routers/restaurant'
import { sectionRouter } from './routers/sections'
import { userRouter } from './routers/user'
import { verifyRouter } from './routers/verify'

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
