import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const artifact = JSON.parse(
  readFileSync(join(__dirname, "..", "artifacts", "contracts", "SuperpositionNFT.sol", "SuperpositionNFT.json"), "utf8")
);

const targetDir = join(__dirname, "..", "abi");
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "SuperpositionNFT.json"), JSON.stringify(artifact.abi, null, 2));
console.log("ABI exported to", join(targetDir, "SuperpositionNFT.json"));
