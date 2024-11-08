import { resStatusType } from '@/utils/apiResponseTypes'
import { customDomainCheckConfig } from '@/utils/customDomain'
import { getErrorMessage } from '@/utils/functions'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  //   TODO: Go here for a complete example https://github.com/vercel/examples/blob/main/solutions/domains-api/pages/api/check-domain.js
  switch (method) {
    case 'POST':
      try {
        const { domain } = req.body
        const data = await customDomainCheckConfig(domain)

        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        console.log({ error })
        res.status(resStatusType.BAD_REQUEST).json({ error: getErrorMessage(error) })
      }
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default handler
