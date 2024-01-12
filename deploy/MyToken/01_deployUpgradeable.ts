import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer, proxyOwner } = await hre.getNamedAccounts();

    await hre.deployments.deploy('MyTokenUpgradeable', {
        from: deployer,
        contract: 'MyTokenUpgradeable',
        log: true,
        proxy: {
            owner: proxyOwner,
            proxyContract: 'UUPS',
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [],
                }
            },
        },
        libraries: {
        },
    });
};
export default func;
