import { KusamaAPI } from './kusama'

const address = 'Gk2FdnhLNnumXWrxjyk7yQstq3CL1Ni4QNCPuTeSjCdDoMh'

const testGetAccountBalance = async () => {
  const response = await KusamaAPI.getAccountBalance({ address })
  console.log(response)

  const api = await KusamaAPI.getApi()
  api.disconnect()
}

testGetAccountBalance()
