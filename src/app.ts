import express from 'express'
import bodyParser from 'body-parser'
import { KusamaAPI } from './services/kusama'
import z from 'zod'

const port = process.env.EA_PORT || 4242

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ welcome: 'Gweihir birds!' })
})

app.post('/', async (req, res) => {
  // Throws if invalid object per schema definition
  const body = GetAccountBalanceRequestSchema.parse(req.body)

  const result = await KusamaAPI.getAccountBalance({
    address: body.data.address,
    blockHash: body.data.blockHash,
    blockNumber: body.data.blockNumber,
  })

  return res.json({
    data: {
      free: result,
    },
  })
})

app.listen(port, () => {
  console.log(`Started listening at http://localhost:${port}`)
})

const GetAccountBalanceRequestSchema = z.object({
  data: z.object({
    address: z.string(),
    blockHash: z.string().optional(),
    blockNumber: z.number().int().optional(),
  }),
})
