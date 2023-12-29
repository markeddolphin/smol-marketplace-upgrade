import { create } from 'zustand';

interface ListModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useListingModal = create<ListModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useListingModal;
