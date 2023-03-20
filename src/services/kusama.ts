import '@polkadot/api-augment'
import { ApiPromise, WsProvider } from '@polkadot/api'

export const KUSAMA_NODE_WS = process.env.KUSAMA_NODE_WS || 'wss://kusama-rpc.polkadot.io'

export class KusamaAPI {
  private static api: ApiPromise | undefined = undefined

  // TODO: Handle websocket disconnects and retries
  static getApi = async () => {
    if (this.api) {
      return this.api
    }
    const wsProvider = new WsProvider(KUSAMA_NODE_WS)
    this.api = await ApiPromise.create({ provider: wsProvider })
    return this.api
  }

  /**
   * Get the account balance in Planck for a specific address.
   * If both `blockHash` and `blockNumber` are provided, then `blockHash` will be used and `blockNumber` will be ignored.
   * @param {string} input.address - Kusama account address (in SS58 format)
   *   See more here: https://guide.kusama.network/docs/learn-account-advanced
   * @param {string | undefined} input.blockHash - Block hash of block to be queried for account balance
   * @param {number | undefined} input.blockNumber - Block number of block to be queried for account balance
   * @returns {Promise<string>} - Planck amount
   */
  public static getAccountBalance = async ({
    address,
    blockHash,
    blockNumber,
  }: {
    address: string
    blockHash?: string
    blockNumber?: number
  }): Promise<string> => {
    const api = await KusamaAPI.getApi()

    if (blockHash) {
      // Get block and query that specific block
      const block = await api.at(blockHash)
      const result = await block.query.system.account(address)
      return result.data.free.toString()
    } else if (blockNumber !== undefined) {
      // Lookup block hash, get block, and then query that specific block
      const blockHash = await api.rpc.chain.getBlockHash(blockNumber)
      const block = await api.at(blockHash)
      const result = await block.query.system.account(address)
      return result.data.free.toString()
    }

    // Query latest block available
    const result = await api.query.system.account(address)
    return result.data.free.toString()
  }
}
