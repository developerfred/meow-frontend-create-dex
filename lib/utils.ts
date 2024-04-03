import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const toWei = (number: string | number | bigint | boolean) => {
  const weiConversionFactor = BigInt(1e18);
  let numberBigInt = BigInt(number);

  if (numberBigInt < weiConversionFactor) {
    numberBigInt = numberBigInt * weiConversionFactor;
  }

  return numberBigInt;
};
