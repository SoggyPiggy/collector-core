import { join } from 'path';
import fs from 'fs';
import { Setting } from '../structures';

export const generate = async function generateSeedFile(data) {
  const timestamp = Date.now();
  const name = data.replace(/ /g, '_').toLowerCase();
  const file = join(process.cwd(), './src/database/seeds/', `${timestamp}_${name}.js`);
  return new Promise((resolve, reject) => {
    fs.writeFile(file,
      `import {} from '../../structures';

      export default {
        version: ${timestamp},
        async run() {
        },
      };
      `.replace(/^ {6}/gm, ''), { flag: 'wx' }, (error) => {
        if (error) reject(error);
        else resolve(`Command file generated: ${file}`);
      });
  });
};

const runSeeds = async function runSeedsRecursive(seeds) {
  if (seeds.length <= 0) return;
  const [seed, ...tail] = seeds;
  await seed.run();
  await runSeeds(tail);
};

const settingSeedVersion = 'seed_version';

export const update = async function updateDatabaseWithNewSeeds() {
  const path = join(process.cwd(), '/src/database/seeds/');
  const currentVersion = await Setting.get(settingSeedVersion, 0);
  let latestVersion = currentVersion;
  const unfilteredSeeds = await Promise.all(
    fs.readdirSync(path).map((file) => import(join(path, file))),
  );
  const seeds = unfilteredSeeds
    .map((module) => module.default)
    .filter(({ version }) => version > currentVersion)
    .sort((a, b) => a.version > b.version);
  if (seeds.length > 0) {
    await runSeeds(seeds);
    latestVersion = seeds[seeds.length - 1].version;
    await Setting.set(settingSeedVersion, latestVersion);
  }
  return { seeds, old: currentVersion, new: latestVersion };
};
