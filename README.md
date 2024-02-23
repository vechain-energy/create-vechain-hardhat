# Commands

- `yarn build` – Compile Contracts
- `yarn test` – Run Tests
- `yarn deploy` – Run Deploy Scripts
- `yarn test:watch` – Run Tests in Watchmode (run when files change)
- `yarn coverage` – Display Code Coverage
- `yarn typechain` – Update Types

# Setup

```shell
# Init Project
yarn init -y
yarn config set nodeLinker node-modules

# Init Hardhat
yarn add --dev hardhat
npx hardhat init

# Init Vechain
yarn add --dev @vechain/web3-providers-connex @vechain/hardhat-vechain @vechain/hardhat-web3 @vechain/hardhat-ethers

# Init Dependencies & Helpers
yarn add @openzeppelin/contracts@4 @openzeppelin/contracts-upgradeable@4 @openzeppelin/hardhat-upgrades @ensdomains/ens-contracts
yarn add --dev dotenv hardhat-deploy@npm:@vechain.energy/hardhat-deploy@latest
```

```ts
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@vechain/hardhat-vechain";
import "@vechain/hardhat-ethers";
import "hardhat-deploy";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error(
    "Please set your PRIVATE_KEY in a .env file or in your environment variables"
  );
}

const accounts = [
  PRIVATE_KEY, // deployer
  process.env.DEPLOYER_PRIVATE_KEY ?? PRIVATE_KEY, // proxyOwner
  process.env.OWNER_PRIVATE_KEY ?? PRIVATE_KEY, // owner
];

// see https://github.com/wighawag/hardhat-deploy?tab=readme-ov-file#1-namedaccounts-ability-to-name-addresses
const namedAccounts = {
  deployer: { default: 0 },
  proxyOwner: { default: 1 },
  owner: { default: 2 },
};

const config = {
  solidity: "0.8.19",
  networks: {
    vechain_testnet: {
      url: "https://node-testnet.vechain.energy",
      accounts,
      restful: true,
      gas: 10000000,

      // optionally use fee delegation to let someone else pay the gas fees
      // visit vechain.energy for a public fee delegation service
      delegate: {
        url: "https://sponsor-testnet.vechain.energy/by/90",
      },
      loggingEnabled: true,
    },
    vechain_mainnet: {
      url: "https://node-mainnet.vechain.energy",
      accounts,
      restful: true,
      gas: 10000000,
    },
  },

  namedAccounts,
};

export default config;
```

# Deploy

```shell
npx hardhat deploy --network vechain_testnet
```

or by tags

```shell
npx hardhat deploy --network vechain_testnet --tags <tag>
```
