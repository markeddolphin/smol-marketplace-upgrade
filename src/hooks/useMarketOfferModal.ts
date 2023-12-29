import { create } from 'zustand';

interface MarketOfferModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useMarketOfferModal = create<MarketOfferModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useMarketOfferModal;
