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
   * @param {string | undefined} input.blockNumberOrHash - Block hash or number of block to be queried for account balance
   * @returns {Promise<string>} - Planck amount
   */
  public static getAccountBalance = async ({
    address,
    blockNumberOrHash,
  }: {
    address: string
    blockNumberOrHash?: string
  }): Promise<string> => {
    const api = await KusamaAPI.getApi()

    if (blockNumberOrHash) {
      // Assume that the block is in hash format if it starts with 0x
      const isHash = blockNumberOrHash.toLowerCase().startsWith('0x') // TODO: Confirm that assumption is correct

      // Lookup block hash
      const blockHash = isHash
        ? blockNumberOrHash
        : (await api.rpc.chain.getBlockHash(blockNumberOrHash)).toString()

      // Get block and query that specific block
      const block = await api.at(blockHash)
      const result = await block.query.system.account(address)
      return result.data.free.toString()
    }

    // Query latest block available
    const result = await api.query.system.account(address)
    return result.data.free.toString()
  }
}
