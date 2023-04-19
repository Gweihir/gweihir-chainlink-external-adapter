// truffle migrate --f 1 --to 1 --network ganache
// Deploy LINK token contract
// This is for networks that don't already have a LINK token contact
// (e.g., local development)

const LinkToken = artifacts.require('LinkToken')
const conf = require('../config/addr.json')
const fs = require('fs')

module.exports = async (deployer, network, [owner]) => {
  // Local (development) networks need their own deployment of the LINK token
  try {
    await deployer.deploy(LinkToken, { from: owner })
    const linkToken = await LinkToken.deployed()

    console.log(`Link address is ${linkToken.address}`)

    conf[network] = { ...conf[network], linkTokenAddress: linkToken.address }
    fs.writeFileSync(__dirname + '/../config/addr.json', JSON.stringify(conf, null, '\t'), 'utf-8')
  } catch (err) {
    console.error(err)
  }
}
