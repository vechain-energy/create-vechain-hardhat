import hre from "hardhat";

async function main() {
    // adjust "MyToken" to be your contracts name
    const nft = await hre.ethers.deployContract("MyToken", [], {});
    
    // `nft.target` won't work, the deployment address needs to be fetched from the deployment transaction
    const tx = await nft.deploymentTransaction();
    const receipt = await hre.ethers.provider.getTransactionReceipt(tx!.hash);

    console.log(`NFT deployed to ${receipt?.contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })