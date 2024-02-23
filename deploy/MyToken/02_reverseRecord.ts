
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import ReverseRegistrar from "@ensdomains/ens-contracts/artifacts/contracts/reverseRegistrar/ReverseRegistrar.sol/ReverseRegistrar.json"
import PublicResolver from "@ensdomains/ens-contracts/artifacts/contracts/resolvers/PublicResolver.sol/PublicResolver.json"
import Registry from "@ensdomains/ens-contracts/artifacts/contracts/registry/ENSRegistry.sol/ENSRegistry.json"

// contract addresses are available on: https://docs.vet.domains/Developers/Contracts/
const REVERSE_REGISTRAR_ADDRESS = "0x6878f1aD5e3015310CfE5B38d7B7071C5D8818Ca"   // TestNet address
const PUBLIC_RESOLVER_ADDRESS = "0xA6eFd130085a127D090ACb0b100294aD1079EA6f"     // TestNet address
const REGISTRY_ADDRESS = "0xcBFB30c1F267914816668d53AcBA7bA7c9806D13"            // TestNet address
const BASE_NAME = 'insecure.demo.vet'                                            // and the parent name

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { owner } = await hre.getNamedAccounts();

    const nft = await hre.deployments.get("MyToken");
    const nftOwner = await hre.deployments.read("MyToken", {}, "owner");
    const registry = await hre.ethers.getContractAt(Registry.abi, REGISTRY_ADDRESS, await hre.ethers.getSigner(owner))
    const publicResolver = await hre.ethers.getContractAt(PublicResolver.abi, PUBLIC_RESOLVER_ADDRESS, await hre.ethers.getSigner(owner))
    const reverseRegistrar = await hre.ethers.getContractAt(ReverseRegistrar.abi, REVERSE_REGISTRAR_ADDRESS, await hre.ethers.getSigner(nftOwner))

    const subDomainName = 'nft'
    const fullDomainName = [subDomainName, BASE_NAME].join('.')
    const currentName = await publicResolver.name(hre.ethers.namehash(`${nft.address.toLowerCase().slice(2)}.addr.reverse`));
    if (currentName !== fullDomainName) {

        console.log(`Setting name for ${nft.address} to ${fullDomainName}, owned by ${owner}`);

        // uncomment next line, if you have a domain and want management permission on it
        // console.log('Creating subdomain record')
        // await registry.setSubnodeRecord(hre.ethers.namehash(BASE_NAME), hre.ethers.id(subDomainName), owner, PUBLIC_RESOLVER_ADDRESS, 0)

        // console.log('Setting forward record')
        // await publicResolver.setAddr(hre.ethers.namehash(fullDomainName), nft.address);

        console.log('Setting reverse record')
        await reverseRegistrar.setNameForAddr(nft.address, owner, PUBLIC_RESOLVER_ADDRESS, fullDomainName);
    }
};

func.id = 'mytoken-reverse-records';
func.tags = ['reverse'];
func.dependencies = ['regular'];

export default func;
