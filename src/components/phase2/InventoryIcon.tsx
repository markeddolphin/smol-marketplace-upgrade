import Image from 'next/image';
import useInventoryBox from '@hooks/useInventoryBox';

export const InventoryIcon = () => {
  const inventoryBox = useInventoryBox();
  
  return (
    <div className="relative cursor-pointer" onClick={() => inventoryBox.onOpen()}>
      <Image
        src="/static/images/inventory_box.png"
        height={100}
        width={100}
        alt="Inventory"
        className="aspect-square"
      />
      <p className="absolute left-1/2 bottom-[0px] -translate-x-1/2 stroke-black text-[9px] text-white">
        Inventory
      </p>
    </div>
  );
};
