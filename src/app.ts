import express from 'express'
import bodyParser from 'body-parser'
import { KusamaAPI } from './services/kusama'

const port = process.env.EA_PORT || 4242

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ welcome: 'Gweihir birds!' })
})

app.post('/', async (req, res) => {
  const result = await KusamaAPI.getAccountBalance({ address: req.body.data.address })
  return res.json({
    data: {
      free: result,
    },
  })
})

app.listen(port, () => {
  console.log(`Started listening at http://localhost:${port}`)
})
