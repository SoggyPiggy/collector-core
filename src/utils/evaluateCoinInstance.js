export default function evaluateCoinInstance(coin, instance) {
  let { value } = coin;
  if (instance.condition === 0) value *= 0.5;
  else value *= (0.9 * instance.condition) + 0.1;
  if (instance.isAltered) value *= 0.8;
  return value;
}
