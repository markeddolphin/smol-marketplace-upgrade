import { create } from 'zustand';

interface InventoryBoxStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useInventoryBox = create<InventoryBoxStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useInventoryBox;
