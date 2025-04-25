import type { ImageSchema } from '@/utils/zod'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { z } from 'zod'
import { readFile } from 'node:fs/promises'
import { resStatusType } from '@/utils/apiResponseTypes'
import { getErrorMessage } from '@/utils/functions'
import { createClientApi } from '@/utils/supabase/api'
import formidable from 'formidable'
import mime from 'mime'
import { getPlaiceholder } from 'plaiceholder'
import { v4 as uuidv4 } from 'uuid'

export type UploadApiResponseType = z.infer<typeof ImageSchema>

type ResponseData = UploadApiResponseType | {
  error: string
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const supabase = createClientApi(req, res)

        const parseFile = async (): Promise<{ files: formidable.Files }> => {
          return await new Promise((resolve, reject) => {
            const form = formidable({
              maxFiles: 1,
              filename: (_name, _ext, part) => {
                return `${uuidv4()}.${mime.getExtension(part.mimetype || '')}`
              },
              filter: (part) => {
                return !!(part.mimetype && part.mimetype?.includes('image'))
              },
            })

            form.parse(req, (err, fields: formidable.Fields, files: formidable.Files) => {
              console.log({ files, fields })
              if (err)
                reject(err)
              else resolve({ files })
            })
          })
        }

        const { files } = await parseFile()
        const file = files.file?.[0]

        if (!file)
          throw new Error('File parse error')

        const filePath = file.newFilename
        const fileContents = await readFile(file.filepath)

        const { data, error } = await supabase.storage
          .from('public')
          .upload(filePath, fileContents)

        if (error)
          throw new Error(getErrorMessage(error))
        if (!data)
          throw new Error('File upload failed')

        const {
          base64: blurDataURL,
          metadata: {
            height,
            width,
          },
          color: {
            hex,
          },
        } = await getPlaiceholder(fileContents, {
          size: 4,
        })

        res.status(resStatusType.SUCCESS).json({
          src: data.fullPath,
          blurDataURL,
          height,
          width,
          hexColor: hex,
        })
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

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
