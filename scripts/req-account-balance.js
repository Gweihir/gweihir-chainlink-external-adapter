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

    // TODO: Allow for kusama address to be an input
    const kusamaAddress = 'Gk2FdnhLNnumXWrxjyk7yQstq3CL1Ni4QNCPuTeSjCdDoMh'

    const accounts = await web3.eth.getAccounts()
    const owner = accounts[0]
    const tx = await consumer.requestKusamaAccountBalance(operatorAddress, jobId, kusamaAddress, {
      from: owner,
      gas: gas,
    })

    callback(tx.tx)
  } catch (err) {
    callback(err)
  }
}
