import { prismaGetUser } from '@/utils/prisma/users'
import { resStatusType } from '@/utils/apiResponseTypes'
import { wrapApiHandlerWithSentry } from '@sentry/nextjs'
import { getErrorMessage } from '@/utils/functions'
import { NextApiRequest, NextApiResponse } from 'next'
import { string } from 'joi'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { id } = req.query
        if (!id || id !== typeof string) {
          throw new Error('User id param incorrectly formed')
        }
        const data = await prismaGetUser({ id })
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: getErrorMessage(error) })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(resStatusType.NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default wrapApiHandlerWithSentry(handler)
