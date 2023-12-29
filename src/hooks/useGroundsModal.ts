import { create } from 'zustand';

interface GroundsModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useGroundsModal = create<GroundsModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useGroundsModal;
