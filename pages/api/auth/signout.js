import { apiPostSignInUser, apiPostSignOutUser } from '@/controllers/users'
import { resStatusType } from '@/utils/types'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      return apiPostSignInUser(req, res) // Set auth cookie works for signing in and out

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default handler
