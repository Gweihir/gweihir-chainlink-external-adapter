const HDWalletProvider = require('@truffle/hdwallet-provider')

const WALLET_MNEMONIC = process.env.WALLET_MNEMONIC
const INFURA_API_KEY = process.env.INFURA_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    testnet: {
      provider: function () {
        return new HDWalletProvider(
          WALLET_MNEMONIC,
          `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
        )
      },
      network_id: '11155111', // sepolia
    },
  },
  compilers: {
    solc: {
      version: 'pragma', // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
  },
}
