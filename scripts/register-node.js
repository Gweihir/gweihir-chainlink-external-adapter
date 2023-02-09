const Operator = artifacts.require('Operator')
const conf = require('../config/addr.json')
const { getNetworkName, toWei } = require('./utils')
const nodeAddress = process.env.ORACLE_NODE_ADDRESS || ''

module.exports = async (callback) => {
  try {
    if (!nodeAddress) throw new Error('Node address not provided!')

    const networkName = getNetworkName()
    const addr = conf[networkName]
    if (!addr) throw new Error(`List of addresses for ${networkName} is null`)
    const operatorAddress = addr.operatorAddress
    if (!operatorAddress) throw new Error(`Operator address not found in ${addr}`)

    const accounts = await web3.eth.getAccounts()
    const owner = accounts[0]

    const operator = await Operator.at(operatorAddress)

    console.log(`Set authorized senders ${[nodeAddress]} in Operator ${operatorAddress}`)
    let tx = await operator.setAuthorizedSenders([nodeAddress], { from: owner })
    const authorizedSenders = await operator.getAuthorizedSenders()
    console.log(`Get authorized senders: ${authorizedSenders}`)

    //Fund node
    const fund = toWei('1', 'ether')
    console.log(`Send money ${fund} WEI from Default account ${owner} to Node ${nodeAddress}`)
    await web3.eth.sendTransaction({ from: owner, to: nodeAddress, value: fund })

    callback(tx.transactionHash)
  } catch (err) {
    callback(err)
  }
}
