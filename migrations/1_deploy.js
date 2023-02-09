// truffle migrate --f 1 --to 1 --network ganache

const LinkToken = artifacts.require('LinkToken')
const Operator = artifacts.require('Operator')
const Consumer = artifacts.require('Consumer')
const conf = require('../config/addr.json')
const fs = require('fs')

module.exports = async (deployer, network, [owner]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Operator contract
  try {
    await deployer.deploy(LinkToken, { from: owner })
    const linkToken = await LinkToken.deployed()
    await deployer.deploy(Operator, linkToken.address, owner, { from: owner })
    const operator = await Operator.deployed()
    await deployer.deploy(Consumer, linkToken.address, { from: owner })
    const consumer = await Consumer.deployed()

    const addr = {
      linkTokenAddress: linkToken.address,
      operatorAddress: operator.address,
      consumerAddress: consumer.address,
    }

    console.log(`Link address is ${linkToken.address}`)
    console.log(`Operator address is ${operator.address}`)
    console.log(`Consumer address is ${consumer.address}`)

    const newConf = conf
    newConf[network] = addr
    fs.writeFileSync(
      __dirname + '/../config/addr.json',
      JSON.stringify(newConf, null, '\t'),
      'utf-8'
    )
  } catch (err) {
    console.error(err)
  }
}
