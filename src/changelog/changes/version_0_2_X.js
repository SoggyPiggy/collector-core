import MajorMinor from '../MajorMinor';
import Patch from '../Patch';

export default new MajorMinor({
  version: '0.2',
  name: 'Baby Steps',
  patches: [
    new Patch({
      version: '2',
      notes: [
        ['Whats New', [
          "The old coin grade scheme was based off of real life coin grading, but they're dumb so its been changed",
        ]],
        ['Changed', [
          'Coin grade naming convention',
          'Coin grade generation uses new bell curve',
        ]],
        ['Fixed', [
          'Potentially bugged coin grade generation',
        ]],
      ],
    }),
    new Patch({
      version: '2',
      notes: [
        ['Whats New', [
          'A couple of things now use Base36 to reference itself for easier typing',
          "You can use the collection command to view all the coins you've collected",
          "Using the view coin command you can view a coin you've collected",
        ]],
        ['Added', [
          'References to suggestions',
          'References to coin instances',
          'Command View',
          'Command Collection',
          'A surprise',
        ]],
        ['Changed', [
          'Help command now displays the main alias of a command in the list',
          'Suggestion IDs are now shown as their references',
          'Modified a good portion of the internal coding structure',
        ]],
        ['WIP Features', [
          'Proper command argument handling',
          'Improvement of already added commands',
          'More features',
          'Additional ways of collecting coins',
          'Visual indication of coin condition',
        ]],
      ],
    }),
  ],
});
