import { router } from '../server'
import { menuRouter } from './menu'
import { menuItemRouter } from './menu-item'
import { restaurantRouter } from './restaurant'
import { sectionRouter } from './section'
import { userRouter } from './user'

export const appRouter = router({
  menu: menuRouter,
  user: userRouter,
  restaurant: restaurantRouter,
  section: sectionRouter,
  menuItem: menuItemRouter,
})

export type AppRouter = typeof appRouter
