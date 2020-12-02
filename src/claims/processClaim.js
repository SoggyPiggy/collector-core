import claims from './claims';
import CollectorError from '../error';
import { generateHash } from '../utils';
import { ClaimLogger } from '../loggers';

const processClaim = async function processClaimCode(code, commandExecuteArgs) {
  const hash = generateHash(code);
  const claimFunction = (await claims).get(hash);
  if (typeof claimFunction !== 'function') throw new CollectorError(`Unknown claimable code: ${code}`);
  const { discordMessage, account } = commandExecuteArgs;
  if (typeof discordMessage !== 'undefined' && discordMessage.deletable) discordMessage.delete();
  if (await ClaimLogger.hasClaimed(hash, account)) throw new CollectorError('Code already claimed');
  return claimFunction(commandExecuteArgs);
};
export default processClaim;
