import express from 'express'
import bodyParser from 'body-parser'
import { requestHeartbeat } from './services'

const port = process.env.EA_PORT || 4242

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ welcome: 'Gweihir birds!' })
})

app.post('/', async (req, res) => {
  console.log('POST Data: ', req.body)

  const result = await requestHeartbeat({ nonce: req.body.data.nonce })
  console.log(result)
  res.json({ data: result })
})

app.listen(port, () => {
  console.log(`Started listening at http://localhost:${port}`)
})
