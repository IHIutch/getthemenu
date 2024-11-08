import { resStatusType } from '@/utils/apiResponseTypes'
import { prismaGetUser } from '@/utils/prisma/users'
import { createStripeCheckoutSession } from '@/utils/stripe'
import { createClientApi } from '@/utils/supabase/api'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createClientApi(req, res)
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return res.status(401).send('Unauthorized')
  }

  //   const token = cookie.parse(req.headers.cookie)['sb:token']

  //   supabase.auth.session = () => ({
  //     access_token: token,
  //   })

  const user = await prismaGetUser({ where: { id: data.user.id } })

  if (!user || !user.stripeCustomerId) {
    return res.status(401).send('Unauthorized')
  }

  const { priceId } = req.query

  if (!priceId) {
    return res.status(resStatusType.BAD_REQUEST).json({ error: 'Missing priceId' })
  }

  const session = await createStripeCheckoutSession(user.stripeCustomerId, [
    {
      price: String(priceId),
      quantity: 1,
    },
  ])

  res.send({
    id: session.id,
  })
}

export default handler
