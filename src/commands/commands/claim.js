import crypto from 'crypto';
import Command from '../Command';

export const generateHash = function generateSecureHashForCodes(code) {
  return crypto.createHmac('sha256', process.env.HASH_KEY).update(code).digest('hex');
};

const execute = async function executeCommand({ inputArguments }) {
  const [code] = inputArguments;
  const hash = generateHash(code);
  switch (hash) {
    // Doomsday code
    case '828a871294bf08124b4abbb646cd04f10d65a1bfd7621c16a54b62365d7b75d0':
      throw new Error('No doomsday code support yet');
    // Leaderboard battle code
    case '0d25f181ae2dfc226eaa0f83d9c4a967bd3993be4cfe54a0fda7f62b53467810':
      throw new Error('No code support yet');
    default: throw new Error(`Unknown claimable code: ${code}`);
  }
};

const command = new Command({
  id: 'claim',
  title: 'Claim',
  description: 'Claim redeemable codes',
  aliases: ['claim'],
  examples: ['claim doomsday'],
  onExecute: execute,
});

export default command;
