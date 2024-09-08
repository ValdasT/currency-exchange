import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'src', 'public', 'swagger.yaml')
  const fileContents = await fs.readFile(filePath, 'utf8')

  res.status(200).send(fileContents)
}
