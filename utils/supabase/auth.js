import supabase from '@/utils/supabase'
import { prismaGetUser } from '../prisma/users'

export const getLoggedUser = async (req) => {
  // This doesnt seem to work in nextjs server side https://github.com/supabase/supabase/issues/3783
  const { user: loggedUser } = await supabase.auth.api.getUserByCookie(req)

  if (!loggedUser) return null

  const user = await prismaGetUser(loggedUser.id)

  return {
    ...loggedUser,
    ...user,
  }
}
