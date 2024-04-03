export const toWei = (number: string | number | bigint | boolean) => {
  const weiConversionFactor = BigInt(1e18);
  let numberBigInt = BigInt(number);

  if (numberBigInt < weiConversionFactor) {
    numberBigInt = numberBigInt * weiConversionFactor;
  }

  return numberBigInt;
};
