//@ts-nocheck
import { create } from "zustand";

const useTokenFactoryStore = create((set) => ({
  formData: {
    name: "",
    symbol: "",
    initialSupply: "",
    reserveWeight: "",
    slope: "",
    creator: "", 
    reserveTokenAddress: "",
    exchangeAddress: "",
  },
  setFormData: (newFormData) =>
    set((state) => ({ formData: { ...state.formData, ...newFormData } })),
}));

export default useTokenFactoryStore;