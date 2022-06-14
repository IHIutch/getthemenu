import supabase from '@/utils/supabase'
// import cookie from 'cookie'
import { prismaGetUser } from '@/utils/prisma/users'
import { createStripeCheckoutSession } from '@/utils/stripe'

const handler = async (req, res) => {
  const { user: sessionUser } = await supabase.auth.api.getUserByCookie(req)

  console.log({ sessionUser })

  if (!sessionUser) {
    return res.status(401).send('Unauthorized')
  }

  //   const token = cookie.parse(req.headers.cookie)['sb:token']

  //   supabase.auth.session = () => ({
  //     access_token: token,
  //   })

  const user = await prismaGetUser({ id: sessionUser.id })
  const { priceId } = req.query

  const session = await createStripeCheckoutSession(user.stripeCustomerId, [
    {
      price: priceId,
      quantity: 1,
    },
  ])

  res.send({
    id: session.id,
  })
}

export default handler
