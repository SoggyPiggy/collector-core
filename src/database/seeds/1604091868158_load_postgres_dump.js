/* eslint-disable no-param-reassign */
import fs from 'fs';
import { join } from 'path';
import {
  Account,
  Coin,
  CoinInstance,
  Series,
  Suggestion,
} from '../../structures';
import { AccountLogger, CoinInstanceLogger } from '../../loggers';

export default {
  version: 1604091868158,
  async run() {
    // PRELOADING STUFF
    const regex = /(?:COPY.+?;)\n((?:.|\n)+?)\n\\\./g;
    const path = join(process.cwd(), '/src/database/pgsql_dump/');

    const accountsMap = new Map();
    const seriesMap = new Map();
    const coinsMap = new Map();
    const coinInstancesMap = new Map();
    const coinTransactionsMap = new Map();
    const suggestionsMap = new Map();

    const accounts = fs.readFileSync(join(path, '/accounts.dat'), { encoding: 'utf-8' });
    const accountSettings = fs.readFileSync(join(path, '/account_settings.dat'), { encoding: 'utf-8' });
    const sets = fs.readFileSync(join(path, '/sets.dat'), { encoding: 'utf-8' });
    const coins = fs.readFileSync(join(path, '/coins.dat'), { encoding: 'utf-8' });
    const coinInstances = fs.readFileSync(join(path, '/coin_instances.dat'), { encoding: 'utf-8' });
    const coinTransactions = fs.readFileSync(join(path, '/coin_transactions.dat'), { encoding: 'utf-8' });
    const suggestions = fs.readFileSync(join(path, '/suggestions.dat'), { encoding: 'utf-8' });

    // SETTING UP ACCOUNTS MAP
    [...accounts.matchAll(regex)][0][1]
      .split('\n').map((table) => table.split('\t'))
      .map(([
        _postgresID,
        discordID,
        insertedAt,
      ]) => ({
        _postgresID: Number(_postgresID),
        discordID: `${discordID}`,
        scrap: 0,
        insertedAt: new Date(insertedAt),
      }))
      .forEach((account) => accountsMap.set(account._postgresID, account));

    [...accountSettings.matchAll(regex)][0][1]
      .split('\n').map((table) => table.split('\t'))
      .map(([
        _postgresID,
        _postgresAccountID,
        settingSendNotifications,
        isAdmin,
        isAdminEnabled,
        discordiaTechDemoInvite,
      ]) => ({
        _postgresID: Number(_postgresID),
        _postgresAccountID: Number(_postgresAccountID),
        settingSendNotifications: settingSendNotifications === 't',
        isAdmin: isAdmin === 't',
        isAdminEnabled: isAdminEnabled === 't',
        discordiaTechDemoInvite: discordiaTechDemoInvite === 't',
      }))
      .forEach((accountSetting) => {
        const account = accountsMap.get(accountSetting._postgresAccountID);
        const {
          _postgresAccountID,
          settingSendNotifications,
          isAdmin,
          isAdminEnabled,
          discordiaTechDemoInvite,
        } = accountSetting;
        accountsMap.set(_postgresAccountID, {
          ...account,
          settingSendNotifications,
          isAdmin,
          isAdminEnabled,
          discordiaTechDemoInvite,
        });
      });

    // SETTING UP SETS/SERIES
    [...sets.matchAll(regex)][0][1]
      .split('\n').map((table) => table.split('\t'))
      .map(([
        _postgresID,
        name,
        directory,
        _postgresSeriesID,
      ]) => ({
        _postgresID: Number(_postgresID),
        _postgresSeriesID: _postgresSeriesID === '\\N' ? undefined : Number(_postgresSeriesID),
        name,
        directory,
      }))
      .forEach((series) => seriesMap.set(series._postgresID, series));

    // SETTING UP COINS
    [...coins.matchAll(regex)][0][1]
      .split('\n').map((table) => table.split('\t'))
      .map(([
        _postgresID,
        name,
        directory,
        _postgresSeriesID,
        inCirculation,
        weight,
        value,
        isError,
      ]) => ({
        _postgresID: Number(_postgresID),
        _postgresSeriesID: Number(_postgresSeriesID),
        name,
        directory,
        weight: Number(weight),
        value: Number(value),
        inCirculation: inCirculation === 't',
        isError: isError === 't',
      }))
      .forEach((coin) => coinsMap.set(coin._postgresID, coin));

    // SETTING UP COIN INSTANCES
    [...coinInstances.matchAll(regex)][0][1]
      .split('\n').map((table) => table.split('\t'))
      .map(([
        _postgresID,
        _postgresCoinID,
        condition,
        insertedAt,,
        _postgresAccountID,
        value,
        conditionRoll,
        conditionNatural,
        isAltered,
      ]) => ({
        _postgresID: Number(_postgresID),
        _postgresCoinID: Number(_postgresCoinID),
        _postgresAccountID: _postgresAccountID === '\\N' ? undefined : Number(_postgresAccountID),
        reference: Number(_postgresID),
        condition: _postgresAccountID === '\\N' ? Number(condition) * 0.5 : Number(condition),
        value: Number(value),
        conditionRoll: Number(conditionRoll),
        conditionNatural: Number(conditionNatural),
        isAltered: isAltered === '\\N' ? false : (isAltered === 't'),
        insertedAt: new Date(insertedAt),
      }))
      .forEach((coinInstance) => coinInstancesMap.set(coinInstance._postgresID, coinInstance));

    // SETTING UP SUGGESTIONS
    [...suggestions.matchAll(regex)][0][1]
      .split('\n').map((table) => table.split('\t'))
      .map(([
        _postgresID,
        content,
        discordUsername,
        _postgresAccountID,
        insertedAt,
      ]) => ({
        _postgresID: Number(_postgresID),
        _postgresAccountID: Number(_postgresAccountID),
        reference: Number(_postgresID),
        content,
        discordUsername,
        insertedAt: new Date(insertedAt),
      }))
      .forEach((suggestion) => suggestionsMap.set(suggestion._postgresID, suggestion));

    // SETTING UP COIN TRANSACTIONS
    [...coinTransactions.matchAll(regex)][0][1]
      .split('\n').map((table) => table.split('\t'))
      .map(([
        _postgresID,
        _postgresAccountID,
        _postgresCoinInstanceID,,
        transaction,
        timestamp,
      ]) => ({
        _postgresID: Number(_postgresID),
        _postgresAccountID: Number(_postgresAccountID),
        _postgresCoinInstanceID: Number(_postgresCoinInstanceID),
        transaction,
        timestamp: new Date(timestamp),
      }))
      .forEach((transaction) => coinTransactionsMap.set(transaction._postgresID, transaction));

    let result;
    // ADD ACCOUNTS TO DATABASE
    result = await ((await Account.collection).bulkWrite(
      [...accountsMap.values()]
        .map((data) => {
          const account = new Account(data);
          delete account._postgresID;
          accountsMap.set(data._postgresID, account);
          return { insertOne: account };
        }),
    ));

    [...accountsMap.values()]
      .forEach((account, index) => {
        const { _id } = result.result.insertedIds[`${index}`];
        account._id = _id;
      });

    // ADD SERIES TO DATABASE
    result = await ((await Series.collection).bulkWrite(
      [...seriesMap.values()]
        .filter(({ _postgresSeriesID }) => typeof _postgresSeriesID === 'undefined')
        .map((data) => {
          const series = new Series(data);
          const { _postgresID } = series;
          delete series._postgresID;
          delete series._postgresSeriesID;
          seriesMap.set(_postgresID, series);
          return { insertOne: series };
        }),
    ));
    [...seriesMap.values()]
      .filter((series) => series instanceof Series)
      .forEach((series, index) => {
        const { _id } = result.result.insertedIds[`${index}`];
        series._id = _id;
      });

    result = await ((await Series.collection).bulkWrite(
      [...seriesMap.values()]
        .filter((series) => !(series instanceof Series))
        .map((data) => {
          const series = new Series(data);
          const { _postgresID, _postgresSeriesID } = series;
          const { _id } = seriesMap.get(_postgresSeriesID);
          series._seriesID = _id;
          delete series._postgresID;
          delete series._postgresSeriesID;
          seriesMap.set(_postgresID, series);
          return { insertOne: series };
        }),
    ));
    [...seriesMap.values()]
      .filter((series) => !(series instanceof Series))
      .forEach((series, index) => {
        const { _id } = result.result.insertedIds[`${index}`];
        series._id = _id;
      });

    // ADD COINS TO DATABASE
    result = await ((await Coin.collection).bulkWrite(
      [...coinsMap.values()]
        .map((data) => {
          const coin = new Coin(data);
          const { _postgresID, _postgresSeriesID } = coin;
          const { _id } = seriesMap.get(_postgresSeriesID);
          coin._seriesID = _id;
          delete coin._postgresID;
          delete coin._postgresSeriesID;
          coinsMap.set(_postgresID, coin);
          return { insertOne: coin };
        }),
    ));
    [...coinsMap.values()]
      .forEach((coin, index) => {
        const { _id } = result.result.insertedIds[`${index}`];
        coin._id = _id;
      });

    // ADD COIN INSTANCES TO DATABASE
    result = await ((await CoinInstance.collection).bulkWrite(
      [...coinInstancesMap.values()]
        .map((data) => {
          const coinInstance = new CoinInstance(data);
          const { _postgresID, _postgresCoinID, _postgresAccountID } = coinInstance;
          const _coinID = coinsMap.get(_postgresCoinID)._id;
          coinInstance._coinID = _coinID;
          if (coinInstance._postgresAccountID) {
            const _accountID = accountsMap.get(_postgresAccountID)._id;
            coinInstance._accountID = _accountID;
          }
          delete coinInstance._postgresID;
          delete coinInstance._postgresCoinID;
          delete coinInstance._postgresAccountID;
          coinInstancesMap.set(_postgresID, coinInstance);
          return { insertOne: coinInstance };
        }),
    ));
    [...coinInstancesMap.values()]
      .forEach((coinInstance, index) => {
        const { _id } = result.result.insertedIds[`${index}`];
        coinInstance._id = _id;
      });

    // ADD SUGGESTIONS TO DATABASE
    result = await ((await Suggestion.collection).bulkWrite(
      [...suggestionsMap.values()]
        .map((data) => {
          const suggestion = new Suggestion(data);
          const { _postgresID, _postgresAccountID } = suggestion;
          const { _id } = accountsMap.get(_postgresAccountID);
          suggestion._accountID = _id;
          delete suggestion._postgresID;
          delete suggestion._postgresAccountID;
          suggestionsMap.set(_postgresID, suggestion);
          return { insertOne: suggestion };
        }),
    ));
    [...suggestionsMap.values()]
      .forEach((suggestion, index) => {
        const { _id } = result.result.insertedIds[`${index}`];
        suggestion._id = _id;
      });

    // ADD COIN TRANSACTIONS TO DATABASE
    (await CoinInstanceLogger.collection).bulkWrite(
      [...coinTransactionsMap.values()]
        .map((data) => {
          const coinInstance = coinInstancesMap.get(data._postgresCoinInstanceID);
          const account = accountsMap.get(data._postgresAccountID);
          if (data.transaction === 'collect') {
            return CoinInstanceLogger.newCollectLog(
              { ...coinInstance, _accountID: account._id },
              account,
              'from postgres dump',
            );
          }
          const { conditionNatural } = coinInstance;
          return CoinInstanceLogger.newScrappedlLog(
            { ...coinInstance, condition: conditionNatural, _accountID: account._id },
            account,
            'from postgres dump',
          ).setAfter(coinInstance);
        })
        .map((log) => ({ insertOne: log })),
    );

    // SIMULATE ACCOUNT CREATIONS
    (await AccountLogger.collection).bulkWrite(
      [...accountsMap.values()].map((account) => {
        const log = AccountLogger.newAccountCreationLog(account, 'from postgres dump');
        log.timestamp = account.insertedAt;
        return { insertOne: log };
      }),
    );

    // SIMULATE ACCOUNT SCRAP GAIN
    (await AccountLogger.collection).bulkWrite(
      [
        [8, 251, new Date('2020-09-25 02:07:47')],
        [3, 303, new Date('2020-09-17 15:59:49')],
        [1, 349, new Date('2020-09-17 15:42:57')],
        [1, 255, new Date('2020-09-17 15:43:01')],
      ].map(([
        _postgresAccountID,
        scrap,
        timestamp,
      ]) => {
        const account = accountsMap.get(_postgresAccountID);
        const log = AccountLogger.newScrapDepositLog(account, 'from postgres dump');
        log.timestamp = timestamp;
        account.scrap += scrap;
        log.setAfter(account);
        return { insertOne: log };
      }),
    );

    // UPDATE ACCOUNTS WITH SCRAP
    Account.update(accountsMap.get(8)).then(() => {
      Account.update(accountsMap.get(3)).then(() => {
        Account.update(accountsMap.get(1));
      });
    });
  },
};
