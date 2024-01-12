import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import type { MyTokenUpgradeable } from "../typechain-types";

describe("MyTokenUpgradeable", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        const [owner, anon] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyTokenUpgradeable");
        const myToken = await upgrades.deployProxy(MyToken, [], { kind: 'uups' }) as unknown as MyTokenUpgradeable;
        await myToken.waitForDeployment();

        return { myToken, owner, anon };
    }

    describe("Deployment", function () {
        it("sets symbol correctly", async function () {
            const { myToken } = await loadFixture(deployFixture);

            expect(await myToken.symbol()).to.equal('ERC20');
        });

        it("sets name correctly", async function () {
            const { myToken } = await loadFixture(deployFixture);

            expect(await myToken.name()).to.equal('MyToken');
        });
    });
});
