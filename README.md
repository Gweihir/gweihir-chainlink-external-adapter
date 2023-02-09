Services Ethereum smart contracts with Kusama data via Chainlink

## Development
### Prerequisites
1. Setup a local Kubernetes Cluster (consider [Docker Desktop](https://www.docker.com/products/docker-desktop/))
1. Install [Ganache](https://trufflesuite.com/docs/ganache/quickstart/)
1. Install [direnv](https://github.com/direnv/direnv) (optional) to automate sourcing environment variables.

### Setup
The following instructions should get a new contributor on their feet. This is basically the "hello world" of this project.
1. `yarn install`
1. Set up a Ganache workspace with the following settings:  
    | Setting | Value |
    | ------- | ----- |
    | PORT NUMBER | 8545 |
    | NETWORK ID | 1337 |
1. Add this project to Truffle Projects in the Ganache workspace to enable deployed contract monitoring.
1. Deploy smart contracts locally with:
    ```
    npx truffle migrate --f 1 --to 1 --network ganache
    ```
    This creates a LinkToken contract, Operator contract, and Consumer contract for testing.
1. Fund Consumer contract with LINK token:
    ```
    npx truffle exec scripts/fund-contract.js --network ganache
    ```
1. Create a `.values.local.yaml` file in the root directory for the Helm chart. The file should at least have these two values set:
    ```
    postgres:
      env:
        POSTGRES_STORAGE_DIR: </absolute/path/to/database/storage>
    chainlink:
      env:
        CHAINLINK_LINK_ADDRESS: <LINK-contract-address>
    ```
    The `POSTGRES_STORAGE_DIR` should point to a directory that will be populated with the Postgres data. For example, `/Users/guy/gweihir/gweihir-chainlink-external-adapter/postgres-data`.  
    The `CHAINLINK_LINK_ADDRESS` should be set to the Ethereum contract address to the locally deployed LINK smart contract which can be found in `./config/addr.json`.
1. Stand up Postgres and a Chainlink node with Kubernetes and Helm:
    ```
    helm install gweihir k8s/gweihir-dev -f .values.local.yaml
    ```
1. Open a port for the Chainlink node into the Kubernetes cluster so the Admin UI can be access in a local web browser:
    ```
    kubectl port-forward deployment/gweihir-gweihir-dev-chainlink-node 6688
    ```
1. Go to http://localhost:6688
1. Enter Chainlink node email and password (values can be found in the Helm chart's values.yaml file)
1. Set the `ORACLE_NODE_ADDRESS` environment variable in with the Chainlink node's EVM Chain Account address for Chain ID 1337. This can be found in the UI here: http://localhost:6688/keys
1. Register the local Chainlink node with the Operator contract and fund the node with ETH:
    ```
    npx truffle exec scripts/register-node.js --network ganache
    ```
1. Create a Chainlink job making sure to replace any template variables (see https://docs.chain.link/chainlink-nodes/v1/fulfilling-requests).
1. Set the `CHAINLINK_JOB_ID` environment variable to the job's "External Job ID" making sure to remove any hyphens (the string should only contain 32 characters)!
1. Make call to Chainlink Operator via Consumer contract:
    ```
    npx truffle exec scripts/req-eth-price.js --network ganache
    ```
1. Retrieve the data from the Consumer after the Chainlink node has submitted results back to Consumer:
    ```
    npx truffle exec scripts/retrieve-eth-price.js --network ganache
    ```


## Appreciation
This project is influenced by https://github.com/aelmanaa/chainlink-local-kubernetes and 
by [Chainlink's Truffle box](https://github.com/smartcontractkit/truffle-starter-kit):
```
truffle unbox smartcontractkit/box
```