export default function calculateCoinInstanceValue(coin, accounts, instances) {
  const owners = [...new Set(instances.map(({ _accountID }) => _accountID)).values()].length;
  let value = ((1000 / coin.weight) ** 3) * 5;
  if (accounts.length !== owners) value *= (0.5 * ((owners - 1) / accounts.length)) + 0.5;
  if (!coin.inCirculation) value *= 1.2;
  if (coin.isRetired) value *= 1.2;
  if (coin.isError) value *= 1.8;
  return value;
}
