// npx truffle exec scripts/req-account-balance.js --network ganache

const Consumer = artifacts.require('Consumer')
const conf = require('../config/addr.json')
const { getNetworkName } = require('./utils')

const jobId = process.env.CHAINLINK_JOB_ID || ''

module.exports = async (callback) => {
  try {
    if (!jobId) throw new Error('Node address not provided!')
    const networkName = getNetworkName()
    const addr = conf[networkName]
    const gas = 3000000
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)
    const consumerAddress = addr.consumerAddress
    const operatorAddress = addr.operatorAddress
    if (!consumerAddress || !operatorAddress)
      throw new Error(`Operator address or Consumer address not found in ${addr}`)

    const consumer = await Consumer.at(consumerAddress)

    // TODO: Allow for kusama address and block hash to be inputs
    const kusamaAddress = 'Gk2FdnhLNnumXWrxjyk7yQstq3CL1Ni4QNCPuTeSjCdDoMh'
    const kusamaBlockHash = '0xfd20e7e096c6e988ef59e2b2f9940aed610afc8768cb885dec54ee9a39d8995a'

    const accounts = await web3.eth.getAccounts()
    const owner = accounts[0]
    const tx = await consumer.requestKusamaAccountBalance(
      operatorAddress,
      jobId,
      kusamaAddress,
      kusamaBlockHash,
      {
        from: owner,
        gas: gas,
      }
    )

    callback(tx.tx)
  } catch (err) {
    console.error(err)
    callback(err)
  }
}
