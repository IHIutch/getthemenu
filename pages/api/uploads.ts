import { resStatusType } from '@/utils/apiResponseTypes'
import formidable from 'formidable'
import { v4 as uuidv4 } from 'uuid'
import { getErrorMessage } from '@/utils/functions'
import { withSentry } from '@sentry/nextjs'
import { getPlaiceholder } from 'plaiceholder'
import mime from 'mime'
import { createClientApi } from '@/utils/supabase/api'
import { NextApiRequest, NextApiResponse } from 'next'
import { readFile } from 'fs/promises'

export type UploadApiResponseType = {
  src: string;
  blurDataUrl: string;
}

type ResponseData = UploadApiResponseType | {
  error: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
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
                return `${uuidv4()}.${mime.getExtension(part.mimetype || "")}`
              },
              filter: (part) => {
                return part.mimetype && part.mimetype?.includes("image") ? true : false;
              },
            })

            form.parse(req, (err, fields: formidable.Fields, files: formidable.Files) => {
              console.log({ files, fields })
              if (err) reject(err);
              else resolve({ files });
            })
          })
        }

        const { files } = await parseFile()
        const file = files.file?.[0];

        if (!file) throw new Error('File parse error')

        const filePath = file.newFilename
        const fileContents = await readFile(file.filepath)

        const { data, error } = await supabase.storage
          .from('public')
          .upload(filePath, fileContents)

        if (error) throw new Error(getErrorMessage(error))
        if (!data) throw new Error('File upload failed')

        const { base64: blurDataUrl } = await getPlaiceholder(fileContents, {
          size: 4,
        })

        res.status(resStatusType.SUCCESS).json({
          src: data.fullPath,
          blurDataUrl
        })
      } catch (error) {
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

export default withSentry(handler)
