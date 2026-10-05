import { create } from "zustand";

const useCheckoutStore = create((set) => ({
  contact: {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    whatsapp: "+91 98765 43210",
  },
  address: {
    address1: "",
    city: "",
    state: "Madhya Pradesh",
    pin: "",
  },
  paymentMethod: "upi",
  setContact: (data) => set({ contact: data }),
  setAddress: (data) => set({ address: data }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
}));

export default useCheckoutStore;
