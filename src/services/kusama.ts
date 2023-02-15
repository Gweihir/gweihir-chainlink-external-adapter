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
   * Get the account balance in Planck for a specific address
   * @param {string} input.address - Kusama account address (in SS58 format)
   *   See more here: https://guide.kusama.network/docs/learn-account-advanced
   * @returns {Promise<string>} - Planck amount
   */
  public static getAccountBalance = async ({ address }: { address: string }): Promise<string> => {
    const api = await KusamaAPI.getApi()

    const result = await api.query.system.account(address)

    return result.data.free.toString()
  }
}
