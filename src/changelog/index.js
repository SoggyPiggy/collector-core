/* eslint-disable camelcase */
import Version_0_5_X from './changes/version_0_5_X';
import Version_0_4_X from './changes/version_0_4_X';
import Version_0_3_X from './changes/version_0_3_X';
import Version_0_2_X from './changes/version_0_2_X';
import Version_0_1_X from './changes/version_0_1_X';

export const getList = function getChangeLogList() {
  return [
    Version_0_5_X,
    Version_0_4_X,
    Version_0_3_X,
    Version_0_2_X,
    Version_0_1_X,
  ];
};

export const getLatest = function getLatestChangeLog() {
  return getList()[0];
};
