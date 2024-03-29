import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();
    await hre.deployments.deploy('MyToken', {
        from: deployer
    })
};

func.id = 'mytoken'; // name your deployment
func.tags = ['regular']

export default func;
