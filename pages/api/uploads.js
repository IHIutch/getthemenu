import { resStatusType } from '@/utils/types'
import formidable from 'formidable'
import fs from 'fs'
import supabase from '@/utils/supabase'
import { v4 as uuidv4 } from 'uuid'
import { getPublicURL } from '@/utils/functions'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const parseFile = async () => {
          return await new Promise((resolve, reject) => {
            const form = formidable({})
            form.parse(req, (err) => {
              if (err) reject(err)
            })

            form.on('file', (formname, file) => {
              resolve({
                name: file.originalFilename,
                file: fs.readFileSync(file.filepath),
              })
            })
          })
        }

        const { name, file } = await parseFile()

        const fileExt = name.split('.').pop()
        const filePath = `${uuidv4()}.${fileExt}`
        const { error } = await supabase.storage
          .from('public')
          .upload(filePath, file)
        if (error) throw new Error(error.message)

        const src = await getPublicURL(filePath)

        res.status(resStatusType.SUCCESS).json(src)
      } catch (error) {
        console.error(error)
        res.status(resStatusType.BAD_REQUEST).json(error)
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
