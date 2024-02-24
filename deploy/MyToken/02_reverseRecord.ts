
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import ReverseRegistrar from "@ensdomains/ens-contracts/artifacts/contracts/reverseRegistrar/ReverseRegistrar.sol/ReverseRegistrar.json"
import PublicResolver from "@ensdomains/ens-contracts/artifacts/contracts/resolvers/PublicResolver.sol/PublicResolver.json"
import Registry from "@ensdomains/ens-contracts/artifacts/contracts/registry/ENSRegistry.sol/ENSRegistry.json"

const NetworkContracts = {
    'main': {
        "ensRegistry": { "address": "0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b" },
        "ensBaseRegistrarImplementation": { "address": "0x6e04F400810Be5C570c08Ea2def43c4d44481063" },
        "ensDnsRegistrar": { "address": "0x0000000000000000000000000000000000000000" },
        "ensEthRegistrarController": { "address": "0x07479F2710d16a0bACbE6C25b9b32447364C0A33" },
        "ensNameWrapper": { "address": "0x1c8Adf6d8E6302d042b1f09baD0c7f65dE3660eA" },
        "ensPublicResolver": { "address": "0xabac49445584C8b6c1472b030B1076Ac3901D7cf" },
        "ensReverseRegistrar": { "address": "0x5c970901a587BA3932C835D4ae5FAE2BEa7e78Bc" },
        "ensBulkRenewal": { "address": "0x793eBb866c7Db6b3e6336861456938D67379d623" },
        "ensDnssecImpl": { "address": "0x0000000000000000000000000000000000000000" },
        "ensUniversalResolver": { "address": "0x3dEB91b387d1e0A2ceB9aDd2AdF43Add1a922569" },
        "multicall3": { "address": "0xfB906D3Ef66cb80fc2E7A79E03228a720b1401F6" },
        "vetResolveUtils": { "address": "0xA11413086e163e41901bb81fdc5617c975Fa5a1A" },
        "venOracle": { "address": "0x49eC7192BF804Abc289645ca86F1eD01a6C17713" }
    },
    'test': {
        "ensRegistry": { "address": "0xcBFB30c1F267914816668d53AcBA7bA7c9806D13" },
        "ensBaseRegistrarImplementation": { "address": "0xca1B72286B96F30391aBB96C7d5e3Bf2D767927d" },
        "ensDnsRegistrar": { "address": "0x0000000000000000000000000000000000000000" },
        "ensEthRegistrarController": { "address": "0xAA854565401724f7061E0C366cA132c87C1e5F60" },
        "ensNameWrapper": { "address": "0x67d8D01cF0d6d9ed2c120FfF1D4Fa86fC10C9D8e" },
        "ensPublicResolver": { "address": "0xA6eFd130085a127D090ACb0b100294aD1079EA6f" },
        "ensReverseRegistrar": { "address": "0x6878f1aD5e3015310CfE5B38d7B7071C5D8818Ca" },
        "ensBulkRenewal": { "address": "0x23aEe21815FDfcba86882c8b10502514a77eFd8A" },
        "ensDnssecImpl": { "address": "0x0000000000000000000000000000000000000000" },
        "ensUniversalResolver": { "address": "0x77fCCE52D4635F9a6a5E06e44aB05c0d5D96D187" },
        "multicall3": { "address": "0x736eAC86d704d8AD13Bb97628928c46dCb7Ad9ef" },
        "vetResolveUtils": { "address": "0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94" },
        "venOracle": { "address": "0xdcCAaBd81B38e0dEEf4c202bC7F1261A4D9192C6" }
    }
}

const BASE_NAME = 'insecure.demo.vet'                                            // and the parent name

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { owner } = await hre.getNamedAccounts();

    // contract addresses are available on: https://docs.vet.domains/Developers/Contracts/
    // and have been configured into hardhat.config.ts to make them available generally
    const contracts = hre.network.name.includes('main') ? NetworkContracts.main : NetworkContracts.test
    const REVERSE_REGISTRAR_ADDRESS = contracts.ensReverseRegistrar.address
    const PUBLIC_RESOLVER_ADDRESS = contracts.ensPublicResolver.address
    const REGISTRY_ADDRESS = contracts.ensRegistry.address

    const nft = await hre.deployments.get("MyToken");
    const nftOwner = await hre.deployments.read("MyToken", {}, "owner");
    const registry = await hre.ethers.getContractAt(Registry.abi, REGISTRY_ADDRESS, await hre.ethers.getSigner(owner))
    const publicResolver = await hre.ethers.getContractAt(PublicResolver.abi, PUBLIC_RESOLVER_ADDRESS, await hre.ethers.getSigner(owner))
    const reverseRegistrar = await hre.ethers.getContractAt(ReverseRegistrar.abi, REVERSE_REGISTRAR_ADDRESS, await hre.ethers.getSigner(nftOwner))

    const subDomainName = 'nft'
    const fullDomainName = [subDomainName, BASE_NAME].join('.')
    const currentName = await publicResolver.name(hre.ethers.namehash(`${nft.address.toLowerCase().slice(2)}.addr.reverse`));
    const baseNameOwner = await registry.owner(hre.ethers.namehash(BASE_NAME))
    const subNameOwner = await registry.owner(hre.ethers.namehash(fullDomainName))
    console.log(`Syncing name for ${nft.address} to ${fullDomainName}, owned by ${owner}`);

    if (baseNameOwner === owner && subNameOwner !== owner) {
        console.log('Creating subdomain record')
        await registry.setSubnodeRecord(hre.ethers.namehash(BASE_NAME), hre.ethers.id(subDomainName), owner, PUBLIC_RESOLVER_ADDRESS, 0)

        console.log('Setting forward record')
        await publicResolver.setAddr(hre.ethers.namehash(fullDomainName), nft.address);
    }

    if (currentName !== fullDomainName) {
        console.log('Setting reverse record')
        await reverseRegistrar.setNameForAddr(nft.address, owner, PUBLIC_RESOLVER_ADDRESS, fullDomainName);
    }
};

func.id = 'mytoken-reverse-records';
func.tags = ['reverse'];
func.dependencies = ['regular'];

export default func;
