import { resStatusType } from '@/utils/apiResponseTypes'
import {
  vercelAddDomain,
  vercelRemoveDomain,
  vercelUpdateDomain,
} from '@/utils/vercel'

export default async function handler(req, res) {
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
        const data = await vercelAddDomain(domain)

        // Not sure if this will work with axios, might need to put in the catch block
        if (data.error?.code === 'forbidden') {
          res.status(resStatusType.FORBIDDEN).end()
        } else if (data.error?.code === 'domain_taken') {
          res.status(resStatusType.CONFLICT).end()
        }

        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
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

        const data = await vercelUpdateDomain(domain)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
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

        const data = await vercelRemoveDomain(domain)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['POST', 'PATCH', 'DELETE'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}
