import { ethers, network } from "hardhat";
import * as fs from "node:fs";
import * as path from "node:path";

function resolveOutputDir(): string {
  const configured = process.env.CONTRACT_DEPLOY_OUTPUT?.trim();
  if (configured) {
    return path.isAbsolute(configured) ? configured : path.resolve(__dirname, configured);
  }

  return path.join(__dirname, "..", "abi");
}

function writeDeploymentFile(options: {
  address: string;
  abi: unknown;
  transactionHash: string | null;
  networkName: string;
}) {
  const outputDir = resolveOutputDir();
  fs.mkdirSync(outputDir, { recursive: true });

  const payload = {
    address: options.address,
    abi: options.abi,
    transaction: options.transactionHash,
    network: options.networkName,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(outputDir, "SuperpositionNFT.deployment.json"), JSON.stringify(payload, null, 2));
  console.log("Deployment metadata saved to", path.join(outputDir, "SuperpositionNFT.deployment.json"));

  const webAbiDir = process.env.WEB_ABI_SYNC_PATH?.trim();
  if (webAbiDir) {
    const resolved = path.isAbsolute(webAbiDir) ? webAbiDir : path.resolve(__dirname, webAbiDir);
    fs.mkdirSync(resolved, { recursive: true });
    fs.writeFileSync(path.join(resolved, "SuperpositionNFT.json"), JSON.stringify(payload.abi, null, 2));
    console.log("ABI synced to", path.join(resolved, "SuperpositionNFT.json"));
  }
}

async function main() {
  const networkName = network.name;
  const deployerKey = process.env.DEPLOYER_KEY;

  if (!deployerKey && networkName !== "hardhat") {
    throw new Error("DEPLOYER_KEY must be configured for live network deployments.");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const SuperpositionFactory = await ethers.getContractFactory("SuperpositionNFT");
  const contract = await SuperpositionFactory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SuperpositionNFT deployed to:", address);

  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "SuperpositionNFT.sol", "SuperpositionNFT.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  writeDeploymentFile({
    address,
    abi: artifact.abi,
    transactionHash: contract.deploymentTransaction()?.hash ?? null,
    networkName
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
