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

const runSeeds = function runSeedsRecursive(seeds) {
  if (seeds.length <= 0) return;
  const [seed, ...tail] = seeds;
  seed.run().then(() => runSeeds(tail)).catch();
};

export const update = async function updateDatabaseWithNewSeeds() {
  const currentVersion = await Setting.get('seed_version', 0);
  const path = join(process.cwd(), '/src/database/seeds/');
  return new Promise((resolve) => {
    Promise.all(
      fs.readdirSync(path).map((file) => import(join(path, file))),
    ).then((unfilteredSeeds) => {
      const seeds = unfilteredSeeds
        .map((module) => module.default)
        .filter(({ version }) => version > currentVersion)
        .sort((a, b) => a.version > b.version);
      runSeeds(seeds);
      const latestVersion = seeds[seeds.length - 1].version;
      Setting.set('seed_version', latestVersion);
      resolve({ seeds, old: currentVersion, new: latestVersion });
    }).catch();
  });
};
