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
yarn add @openzeppelin/contracts@4 @openzeppelin/contracts-upgradeable@4 @openzeppelin/hardhat-upgrades
yarn add --dev dotenv hardhat-deploy@npm:@vechain.energy/hardhat-deploy@latest
yarn add @ensdomains/ens-contracts
```

```ts
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "@vechain/hardhat-vechain";
import '@vechain/hardhat-ethers';
import 'hardhat-deploy';
import 'dotenv/config';

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error('Please set your PRIVATE_KEY in a .env file or in your environment variables');
}

const config = {
  solidity: "0.8.19",
  networks: {
    vechain_testnet: {
      url: "https://node-testnet.vechain.energy",
      accounts: [PRIVATE_KEY, process.env.DEPLOYER_PRIVATE_KEY ?? PRIVATE_KEY],
      restful: true,
      gas: 10000000,

      // optionally use fee delegation to let someone else pay the gas fees
      // visit vechain.energy for a public fee delegation service
      delegate: {
        url: "https://sponsor-testnet.vechain.energy/by/90"
      },
      loggingEnabled: true,
    },
    vechain_mainnet: {
      url: "https://node-mainnet.vechain.energy",
      accounts: [PRIVATE_KEY, process.env.DEPLOYER_PRIVATE_KEY ?? PRIVATE_KEY],
      restful: true,
      gas: 10000000,
    },
  },

  namedAccounts: {
    deployer: {
      default: 1
    },
    proxyOwner: {
      default: 1
    },
  }
};

export default config;
```

# Deploy

```shell
npx hardhat run --network vechain_testnet scripts/deploy.ts
```