import { create } from 'zustand';

interface AcceptModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAcceptModal = create<AcceptModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useAcceptModal;
