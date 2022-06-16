import { getAvailabilityVercelDomain } from '@/utils/axios/vercel'
import { resStatusType } from '@/utils/types'

export default async function handler(req, res) {
  const { method } = req

  //   TODO: Go here for a complete example https://github.com/vercel/examples/blob/main/solutions/domains-api/pages/api/check-domain.js
  switch (method) {
    case 'POST':
      try {
        const { domain } = req.body
        const data = await getAvailabilityVercelDomain(domain)

        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        console.log({ error })
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}
