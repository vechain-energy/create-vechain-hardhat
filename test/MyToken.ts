import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyToken");
        const nft = await MyToken.deploy();

        return { nft, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("sets symbol correctly", async function () {
            const { nft } = await loadFixture(deployFixture);

            expect(await nft.symbol()).to.equal('MTK');
        });
    });
});