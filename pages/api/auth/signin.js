import { apiPostSignInUser } from '@/controllers/users'
import { resStatusType } from '@/utils/types'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      return apiPostSignInUser(req, res)

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default handler
