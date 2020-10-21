import MajorMinor from '../MajorMinor';
import Patch from '../Patch';

export default new MajorMinor({
  version: '0.3',
  name: 'Scrap and Slap',
  patches: [
    new Patch({
      version: '0',
      notes: [
        ['Whats New', [
          'Coins have a value associated with them',
          'The base coin value is reassessed every 30 minutes',
          'New resource (scrap) is gathered from scrapping coins',
          'The scrap is used to repair other coins which increase their value',
          "Be warned, a repaired coin looses some initial value due to the coin being considered 'altered'",
          'Use the profile command to check out users stats',
          'Some command now use arguments',
          "example: 'command --argument value'",
          'For better examples of arguments use help',
          'Maybe people will like this version of coin grades',
        ]],
        ['Added', [
          'Profile Command',
          'Scrap Command',
          'Repair Command',
          'Scrap Resource',
          'Coin Values',
          'Altered Coin Status',
        ]],
        ['Changed', [
          'Coin value made public',
          'Coin value displayed on coin embeds',
          'Coin value considers if a coin is altered',
          'Profile command made public',
          'More stats added onto profile command',
          'Help command now accepts other commands as argument',
        ]],
        ['WIP Features', [
          'Additional ways of collecting coins',
          'Visual indication of coin condition',
        ]],
      ],
    }),
  ],
});
