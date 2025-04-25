import type { NextApiRequest, NextApiResponse } from 'next'
import { resStatusType } from '@/utils/apiResponseTypes'
import { verifyCustomDomain } from '@/utils/customDomain'
import { getErrorMessage } from '@/utils/functions'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { domain } = req.body
        const data = await verifyCustomDomain(domain)

        res.status(resStatusType.SUCCESS).json(data)
      }
      catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: getErrorMessage(error) })
      }
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default handler
