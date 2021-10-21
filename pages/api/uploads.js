import { resStatusType } from '@/utils/types'
import formidable from 'formidable'
import fs from 'fs'
import supabase from '@/utils/supabase'
import { v4 as uuidv4 } from 'uuid'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const getFileName = async () => {
          const form = new formidable.IncomingForm()
          form.uploadDir = './'
          form.keepExtensions = true
          return await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err)
              resolve({
                name: files.file.name,
                path: files.file.path,
                file: fs.readFileSync(files.file.path),
              })
            })
          })
        }
        const { name, path, file } = await getFileName()

        // console.log({ name, path, file })

        const fileExt = name.split('.').pop()
        const filePath = `${uuidv4()}.${fileExt}`
        const { error } = await supabase.storage
          .from('public')
          .upload(filePath, file)
        if (error) throw new Error(error.message)

        res.status(resStatusType.SUCCESS).json(filePath)
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
