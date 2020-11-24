import express from 'express';
import { renderCoin, renderCoinInstance } from '../renderer';
import { CoinInstance } from '../structures';

const app = express();
const port = 3000;

app.get('/render/coin/:reference', async (request, response) => {
  const { reference } = request.params;
  let { size = 256, base = false } = request.query;
  size = Math.min(4096, Math.max(16, size));
  base = base === false;
  const coinInstance = await CoinInstance.getByReference(reference);
  if (typeof coinInstance !== 'undefined') {
    const coin = base ? coinInstance : await coinInstance.coin;
    const renderer = base ? renderCoinInstance : renderCoin;
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
