import { KusamaAPI } from './kusama'

jest.setTimeout(30000)

const address = 'Gk2FdnhLNnumXWrxjyk7yQstq3CL1Ni4QNCPuTeSjCdDoMh'

afterAll(async () => {
  const api = await KusamaAPI.getApi()
  await api.disconnect()
})

test("get account's latest balance", async () => {
  const response = await KusamaAPI.getAccountBalance({ address })
  expect(() => BigInt(response)).not.toThrow()
})

test("get account's balance at specific block hash", async () => {
  const blockHash = '0xfd20e7e096c6e988ef59e2b2f9940aed610afc8768cb885dec54ee9a39d8995a'
  const response = await KusamaAPI.getAccountBalance({ address, blockNumberOrHash: blockHash })
  expect(() => BigInt(response)).not.toThrow()
  expect(response).toBe('37973447220861534')
})

test("get account's balance at specific block number", async () => {
  const blockNumber = 16698003
  const response = await KusamaAPI.getAccountBalance({
    address,
    blockNumberOrHash: blockNumber.toString(),
  })
  expect(() => BigInt(response)).not.toThrow()
  expect(response).toBe('37973447220861534')
})

test("get account's balance at latest block", async () => {
  const response = await KusamaAPI.getAccountBalance({
    address,
  })
  expect(() => BigInt(response)).not.toThrow()
})
