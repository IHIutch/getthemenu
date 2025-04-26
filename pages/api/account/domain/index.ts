import type { NextApiRequest, NextApiResponse } from 'next'

import { resStatusType } from '@/utils/apiResponseTypes'
import {
  createCustomDomain,
  removeCustomDomain,
  updateCustomDomain,
} from '@/utils/customDomain'
import { getErrorMessage } from '@/utils/functions'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const restrictedDomains = [
    '*.getthemenu.io',
    'getthemenu.io',
    'getthemenu.vercel.app',
  ]

  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { domain } = req.body
        const data = await createCustomDomain(domain)

        // Not sure if this will work with axios, might need to put in the catch block
        if (data.error?.code === 'forbidden') {
          res.status(resStatusType.FORBIDDEN).end()
        }
        else if (data.error?.code === 'domain_taken') {
          res.status(resStatusType.CONFLICT).end()
        }

        res.status(resStatusType.SUCCESS).json(data)
      }
      catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: getErrorMessage(error) })
      }
      break

    case 'PATCH':
      try {
        const { domain } = req.body

        if (restrictedDomains.includes(domain)) {
          res
            .status(resStatusType.FORBIDDEN)
            .json({ error: 'You are not authorized to modify that domain.' })
        }

        const data = await updateCustomDomain(domain)
        res.status(resStatusType.SUCCESS).json(data)
      }
      catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: getErrorMessage(error) })
      }

      break

    case 'DELETE':
      try {
        const { domain } = req.body

        if (restrictedDomains.includes(domain)) {
          res
            .status(resStatusType.FORBIDDEN)
            .json({ error: 'You are not authorized to delete that domain.' })
        }

        const data = await removeCustomDomain(domain)
        res.status(resStatusType.SUCCESS).json(data)
      }
      catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: getErrorMessage(error) })
      }
      break

    default:
      res.setHeader('Allow', ['POST', 'PATCH', 'DELETE'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default handler
