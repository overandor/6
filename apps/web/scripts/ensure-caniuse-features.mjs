import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const searchRoots = [
  resolve(here, "..", "node_modules"),
  resolve(here, "..", "..", "node_modules"),
  resolve(here, "..", "..", "..", "node_modules")
];

const stub = {
  A: { A: {}, B: {}, C: {}, D: {}, E: {}, F: {}, G: {}, H: {}, I: {}, J: {}, K: {}, L: {}, M: {}, N: {}, O: {}, P: {}, Q: {}, R: {}, S: {} },
  B: 0,
  C: "Stubbed caniuse-lite feature",
  D: true
};

const stubSource = `module.exports = ${JSON.stringify(stub)};\n`;

for (const root of searchRoots) {
  const featuresIndex = resolve(root, "caniuse-lite", "data", "features.js");
  try {
    const contents = await fs.readFile(featuresIndex, "utf8");
    const featureNames = Array.from(contents.matchAll(/\.\/features\/([a-z0-9-]+)/gi)).map((match) => match[1]);
    const uniqueNames = [...new Set(featureNames)];
    await Promise.all(
      uniqueNames.map(async (name) => {
        const target = resolve(root, "caniuse-lite", "data", "features", `${name}.js`);
        try {
          await fs.access(target);
        } catch {
          await fs.mkdir(dirname(target), { recursive: true });
          await fs.writeFile(target, stubSource);
        }
      })
    );
  } catch {
    // ignore missing roots
  }
}
