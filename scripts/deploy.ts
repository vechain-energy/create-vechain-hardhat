import hre from "hardhat";
import ReverseRegistrar from "@ensdomains/ens-contracts/artifacts/contracts/reverseRegistrar/ReverseRegistrar.sol/ReverseRegistrar.json"

async function main() {

    // adjust "MyToken" to be your contracts name
    const nft = await hre.ethers.deployContract("MyToken", [], {});

    // `nft.target` won't work, the deployment address needs to be fetched from the deployment transaction
    const tx = await nft.deploymentTransaction();
    const receipt = await hre.ethers.provider.getTransactionReceipt(tx!.hash);

    console.log(`NFT deployed to ${receipt?.contractAddress}`);

    // uncomment the next lines to set a reverse record for the newly deployed address
    // contract addresses are available on: https://docs.vet.domains/Developers/Contracts/

    // const REVERSE_REGISTRAR_ADDRESS = "0x6878f1aD5e3015310CfE5B38d7B7071C5D8818Ca" // TestNet address
    // const PUBLIC_RESOLVER_ADDRESS = "0xA6eFd130085a127D090ACb0b100294aD1079EA6f" // TestNet address
    // const CONTRACT_NAME = "a1.webhooks.vet"

    // const owner = (await hre.ethers.provider.getSigner()).address
    // const reverseRegistrar = await hre.ethers.getContractAt(ReverseRegistrar.abi, REVERSE_REGISTRAR_ADDRESS)
    // await reverseRegistrar.setNameForAddr(receipt?.contractAddress, owner, PUBLIC_RESOLVER_ADDRESS, CONTRACT_NAME);

    // end of setting .vet name record, set the forward record on https://vet.domains
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })