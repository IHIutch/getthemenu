import supabase from '@/utils/supabase'
// import cookie from 'cookie'
import { prismaGetUser } from '@/utils/prisma/users'
import { createStripeBillingSession } from '@/utils/stripe'

const handler = async (req, res) => {
  const { user: sessionUser } = await supabase.auth.api.getUserByCookie(req)

  if (!sessionUser) {
    return res.status(401).send('Unauthorized')
  }

  //   const token = cookie.parse(req.headers.cookie)['sb:token']

  //   supabase.auth.session = () => ({
  //     access_token: token,
  //   })

  const user = await prismaGetUser({ id: sessionUser.id })
  const session = await createStripeBillingSession(user.stripeCustomerId)

  res.send({
    url: session.url,
  })
}

export default handler
