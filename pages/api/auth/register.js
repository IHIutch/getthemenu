import supabase from '@/utils/supabase'
import { apiPostUser } from '@/controllers/users'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { session, payload } = req.body

        await apiPostUser({
          id: session.user.id,
          ...payload,
        })

        return supabase.auth.api.setAuthCookie(req, res)
      } catch (error) {
        return res.status(resStatusType.BAD_REQUEST).json({ error })
      }

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
