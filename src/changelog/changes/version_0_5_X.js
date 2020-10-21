import MajorMinor from '../MajorMinor';
import Patch from '../Patch';

export default new MajorMinor({
  version: '0.5',
  name: 'Gone Nuclear',
  patches: [
    new Patch({
      version: '0',
      notes: [
        ['Whats New', [
          'I\'ve redone the whole bot in Javascript, because I\'ve lost my mind',
        ]],
        ['WIP Features', [
          'Additional ways of collecting coins',
          'Visual indication of coin condition',
        ]],
      ],
    }),
  ],
});
