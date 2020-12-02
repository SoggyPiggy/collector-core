import { Setting } from '../../structures';

export default {
  version: 1606885308103,
  async run() {
    const current = new Date();
    Setting.set('claim-doomsday-endDate', new Date(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate()));
  },
};
