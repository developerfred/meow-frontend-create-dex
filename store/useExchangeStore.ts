//@ts-nocheck
import { create } from "zustand";

const useExchangeStore = create((set) => ({
  tokenAddress: "",
  amount: "",
  transactionHash: "",
  error: "",
  exchangeAmount: "",
  isBuying: true,
  tokenSymbol: "",
  isApprovalNeeded: false,
  allowance: BigInt(0),
  setTokenAddress: (tokenAddress) => set({ tokenAddress }),
  setAmount: (amount) => set({ amount }),
  setTransactionHash: (transactionHash) => set({ transactionHash }),
  setError: (error) => set({ error }),
  setExchangeAmount: (exchangeAmount) => set({ exchangeAmount }),
  setIsBuying: (isBuying) => set((state) => ({ isBuying: !state.isBuying })),
  setTokenSymbol: (tokenSymbol) => set({ tokenSymbol }),
  setIsApprovalNeeded: (isApprovalNeeded) => set({ isApprovalNeeded }),
  setAllowance: (allowance) => set({ allowance }),
}));

export default useExchangeStore;
