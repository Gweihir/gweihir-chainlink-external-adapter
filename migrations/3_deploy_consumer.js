// truffle migrate --f 3 --to 3 --network ganache
// Deploy sample consumer contract
// This is useful for testing the external adapter

const Consumer = artifacts.require('Consumer')
const conf = require('../config/addr.json')
const fs = require('fs')

module.exports = async (deployer, network, [owner]) => {
  try {
    const addresses = conf[network]
    if (!addresses) throw new Error(`List of addresses for ${network} is undefined`)

    await deployer.deploy(Consumer, addresses.linkTokenAddress, { from: owner })
    const consumer = await Consumer.deployed()

    console.log(`Consumer address is ${consumer.address}`)

    conf[network] = { ...conf[network], consumerAddress: consumer.address }
    fs.writeFileSync(__dirname + '/../config/addr.json', JSON.stringify(conf, null, '\t'), 'utf-8')
  } catch (err) {
    console.error(err)
  }
}
