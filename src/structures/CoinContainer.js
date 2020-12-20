export default class CoinContainer {
  constructor(coin, options = {}) {
    this.coin = coin;
    this.isOwned = false;
    this.isPublic = false;
    Object.assign(this, options);
  }
}
