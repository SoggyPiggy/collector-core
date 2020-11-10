import MajorMinor from './MajorMinor';
import Patch from './Patch';

/* eslint-disable global-require */
export const versions = [
  require('./changes/version_0_5_X').default,
  require('./changes/version_0_4_X').default,
  require('./changes/version_0_3_X').default,
  require('./changes/version_0_2_X').default,
  require('./changes/version_0_1_X').default,
];
/* eslint-enable global-require */

export const latest = versions[0];

export {
  MajorMinor,
  Patch,
};
