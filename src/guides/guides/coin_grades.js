import Guide from '../Guide';

const guide = new Guide(
  'Coin Grades/Conditions',
  'Coin grades are the titles given to an instance of a coin based off of its condition.',
)
  .addText('Coin Condition', 'Instances of coins are generated with a generated value assigned to it. This value is the condition. Conditions are a float that range from 0.0 to 1.0 inclusive. A coin\'s condition can be altered with commands such as repair and scrap. Once a coins condition has been altered the value of the coin will be affected negatively, but the increase of condition can cover the offset.')
  .addList('List of Grades (top-bottom, best-worst)', [
    'Mint+',
    'Mint',
    'Good+',
    'Good',
    'Good-',
    'Average+',
    'Average',
    'Average-',
    'Bad+',
    'Bad',
    'Bad-',
    'Terrible',
  ]);

export default guide;
