import hre from "hardhat";
import ERC1967Proxy from '@openzeppelin/contracts/build/contracts/ERC1967Proxy.json'


async function main() {
    console.log('Deploying MyTokenUpgradeable...')
    const contract = await hre.ethers.deployContract("MyTokenUpgradeable", [], {});
    const tx = await contract.deploymentTransaction();
    const receipt = await hre.ethers.provider.getTransactionReceipt(tx!.hash);
    const contractAddress = receipt!.contractAddress
    console.log(`Implementation deployed to ${contractAddress}`);


    console.log('Deploying Proxy...')
    const Proxy = await hre.ethers.getContractFactory(ERC1967Proxy.abi, ERC1967Proxy.bytecode)
    const proxy = await Proxy.deploy(contractAddress, contract.interface.encodeFunctionData('initialize'))
    console.log(`Proxy deployed to ${proxy.target}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })