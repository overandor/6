import { ethers } from "hardhat";
import * as fs from "node:fs";
import * as path from "node:path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const SuperpositionFactory = await ethers.getContractFactory("SuperpositionNFT");
  const contract = await SuperpositionFactory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SuperpositionNFT deployed to:", address);

  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "SuperpositionNFT.sol", "SuperpositionNFT.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const outputDir = path.join(__dirname, "..", "abi");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "SuperpositionNFT.deployment.json"),
    JSON.stringify(
      {
        address,
        abi: artifact.abi,
        transaction: contract.deploymentTransaction()?.hash ?? null,
        network: ethers.provider.network?.name ?? "unknown",
        deployedAt: new Date().toISOString()
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
