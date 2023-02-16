const Consumer = artifacts.require('Consumer')
const conf = require('../config/addr.json')
const { getNetworkName } = require('./utils')

module.exports = async (callback) => {
  try {
    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)
    const consumerAddress = addr.consumerAddress
    if (!consumerAddress) throw new Error(`Consumer address not found in ${addr}`)

    const consumer = await Consumer.at(consumerAddress)
    const currentAccountBalance = await consumer.currentAccountBalance()

    console.log(`Current account balance is ${currentAccountBalance} Plank`)
    callback(currentAccountBalance)
  } catch (err) {
    callback(err)
  }
}
