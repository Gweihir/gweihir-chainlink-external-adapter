// truffle migrate --f 2 --to 2 --network ganache
// Deploy oracle operator contract
// This contract is how the Chainlink node will communicate with EVM smart contracts

const Operator = artifacts.require('Operator')
const conf = require('../config/addr.json')
const fs = require('fs')

module.exports = async (deployer, network, [owner]) => {
  // Local (development) networks need their own deployment of the Operator contract
  try {
    const addresses = conf[network]
    if (!addresses) throw new Error(`List of addresses for ${network} is undefined`)

    await deployer.deploy(Operator, addresses.linkTokenAddress, owner, { from: owner })
    const operator = await Operator.deployed()

    console.log(`Operator address is ${operator.address}`)

    conf[network] = { ...conf[network], operatorAddress: operator.address }
    fs.writeFileSync(__dirname + '/../config/addr.json', JSON.stringify(conf, null, '\t'), 'utf-8')
  } catch (err) {
    console.error(err)
  }
}
