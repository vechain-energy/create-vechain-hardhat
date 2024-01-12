# Commands

- `yarn build` – Compile Contracts
- `yarn test` – Run Tests
- `yarn test:watch` – Run Tests in Watchmode (run when files change)
- `yarn coverage` – Display Code Coverage
- `yarn typechain` – Update Types

# Setup

```shell
yarn init -y
yarn config set nodeLinker node-modules
yarn add --dev hardhat
npx hardhat init
yarn add --dev @vechain/web3-providers-connex @vechain/hardhat-vechain @vechain/hardhat-web3 @vechain/hardhat-ethers
yarn add @openzeppelin/contracts@4 @openzeppelin/contracts-upgradeable@4 @openzeppelin/hardhat-upgrades
```

```ts
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@vechain/hardhat-vechain";
import "@vechain/hardhat-ethers";

const PRIVATE_KEY =
  process.env.PRIVATE_KEY ??
  "8ebab39c89ab125019923e0a7fdbae2febfd88de2ae5a5b87930b2c2532d234e";

const config = {
  solidity: "0.8.19",
  networks: {
    vechain_testnet: {
      url: "https://node-testnet.vechain.energy",
      accounts: [PRIVATE_KEY],
      restful: true,
      gas: 10000000,

      // optionally use fee delegation to let someone else pay the gas fees
      // visit vechain.energy for a public fee delegation service
      delegate: {
        url: "https://sponsor-testnet.vechain.energy/by/90",
      },
    },
    vechain_mainnet: {
      url: "https://node-mainnet.vechain.energy",
      accounts: [PRIVATE_KEY],
      restful: true,
      gas: 10000000,
    },
  },
};

export default config;
```
