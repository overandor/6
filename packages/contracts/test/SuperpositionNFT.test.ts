import { expect } from "chai";
import { ethers } from "hardhat";

describe("SuperpositionNFT", () => {
  it("mints and observes", async () => {
    const [owner, observer] = await ethers.getSigners();
    const Superposition = await ethers.getContractFactory("SuperpositionNFT");
    const contract = await Superposition.deploy();
    await contract.waitForDeployment();

    const states = [
      { name: "Alpha", uri: "ipfs://alpha", weight: 5000 },
      { name: "Beta", uri: "ipfs://beta", weight: 5000 }
    ];

    const tx = await contract.create(states, owner.address);
    await tx.wait();

    const baseFee = await contract.baseFee();
    await expect(contract.connect(observer).observe(1, { value: baseFee })).to.emit(contract, "Observed");
  });
});
