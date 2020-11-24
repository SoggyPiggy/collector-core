import express from 'express';
import renderCoin from '../renderer/renderCoin';
import renderCoinInstance from '../renderer/renderCoinInstance';
import { CoinInstance } from '../structures';

const app = express();
const port = 3000;

app.get('/render/coin/:reference', async (request, response) => {
  const { reference } = request.params;
  const { condition = true } = request.query;
  let { size = 128 } = request.query;
  size = Math.min(4096, Math.max(16, size));
  const coinInstance = await CoinInstance.getByReference(reference);
  if (typeof coinInstance !== 'undefined') {
    const coin = condition ? coinInstance : await coinInstance.coin;
    const renderer = condition ? renderCoinInstance : renderCoin;
    const buffer = await renderer(coin, { size });
    response.contentType('image/png');
    response.send(buffer);
  } else {
    response.status(404);
  }
});

app.listen(port, () => {
});

export default app;
