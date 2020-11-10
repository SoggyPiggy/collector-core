import Guide from './Guide';
import ListSection from './ListSection';
import TextSection from './TextSection';

/* eslint-disable global-require */
export const guides = {
  grades: require('./guides/coin_grades').default,
};
/* eslint-enable global-require */

export {
  Guide,
  ListSection,
  TextSection,
};
