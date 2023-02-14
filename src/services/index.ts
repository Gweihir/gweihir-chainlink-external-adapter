export const requestHeartbeat = async (input: { nonce: string }) => {
  return { nonce: input.nonce }
}

export const requestKusamaAccountBalance = async (input: { address: string }) => {
  // TODO
}
