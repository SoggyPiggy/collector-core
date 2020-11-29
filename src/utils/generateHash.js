import crypto from 'crypto';

const generateHash = function generateSecureHashForCodes(code) {
  return crypto.createHmac('sha256', process.env.HASH_KEY).update(code).digest('hex');
};
export default generateHash;
