import { SelectLock } from '@components/phase2/SelectLock';
import { Phase2Context } from '@context/phase2Context';
import useGroundsModal from '@hooks/useGroundsModal';
import { useStakedInPits } from '@hooks/useStakedInPits';
import { Ground, NFTObject } from '@model/model';
import { cn } from '@utils';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';

type SelectedItem = { tokenId: BigNumber; lock: number; ground: Ground };

const borderColor = (ground: Ground) => {
  switch (ground) {
    case Ground.Farmer:
      return 'border-[#5f8734]';
    case Ground.Warrior:
      return 'border-[#825540]';
    case Ground.Mystic:
      return 'border-[#58579b]';
    default:
      return 'border-smolBrownLight';
  }
};

export const Stake = () => {
  const { nfts, enterDevelopmentGrounds } = useContext(Phase2Context);
  const [selected, setSelected] = useState<SelectedItem[]>();
  const [lock, setLock] = useState<number>(100);

  const groundsModal = useGroundsModal();
  const { open } = useStakedInPits();

  const onStake = () => {
    if (!open) {
      return groundsModal.onOpen();
    }
    return enterDevelopmentGrounds(
      selected.map((item) => ({
        ...item,
        lock: lock * 86400, // in seconds
      })),
    );
  };

  const handleClick = (ground: Ground, nft: NFTObject) => {
    const newSelection = { tokenId: nft.id, lock, ground };
    const select = selected?.filter((item) => item.tokenId == nft.id);
    if (select?.length > 0) {
      setSelected((prev) =>
        select[0].ground === ground
          ? prev.filter((item) => item.tokenId !== nft.id)
          : prev.map((item) => (item.tokenId === nft.id ? newSelection : item)),
      );
    } else {
      setSelected([...(selected ?? []), newSelection]);
    }
  };

  const eligibleSmols: NFTObject[] = useMemo(
    () => nfts?.filter((nft: NFTObject) => nft.commonSense >= 100 && !nft.staked),
    [nfts],
  );

  if (!eligibleSmols || eligibleSmols?.length === 0) {
    return <div className='w-full'>
      <p className="my-4 px-4 text-center text-sm">
        Only Neandersmols with 100+ Common Sense can enter the Development Ground.
      </p>
      <Link className='btn py-2 justify-center flex w-fit mx-auto'
        href="https://app.treasure.lol/collection/neandersmols?chain%5B%5D=arb&chain%5B%5D=eth&chain%5B%5D=arbnova&collection%5B%5D=smol-jrs&collection%5B%5D=neandersmols&tab=vault&trait%5B%5D=Common+Sense%3A100%3A100">
        Buy one to enter
      </Link>
    </div>
  }

  return (
    <>
      <div className="grid max-h-[35vh] grid-cols-2 gap-2 overflow-y-scroll xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
        {eligibleSmols.map((nft: NFTObject) => {
          const selectedNft = selected?.filter((item) => item.tokenId === nft.id);
          const isSelected = selectedNft?.length > 0;
          return (
            <button
              //disabled={!isSelected}
              onClick={() =>
                setSelected((prev) => prev?.filter((item) => item.tokenId !== nft.id))
              }
              key={nft.id.toString()}
              className={cn(
                isSelected ? borderColor(selectedNft[0].ground) : 'border-black',
                'btn mx-auto',
              )}
            >
              <>
                <Image
                  src={nft.image}
                  alt={`smol #${nft.id.toString()}`}
                  width={110}
                  height={110}
                  className="rounded-lg"
                />
                <div className="py-2 text-center text-xs uppercase">#{nft.id}</div>
                <div className="grid w-full grid-cols-3">
                  <Image
                    src="/static/images/farmer.png"
                    height={30}
                    width={30}
                    alt="farmer"
                    className="mx-auto cursor-pointer rounded-full border-white hover:border"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(Ground.Farmer, nft);
                    }}
                  />
                  <Image
                    src="/static/images/fighter.png"
                    height={30}
                    width={30}
                    alt="figher"
                    className="mx-auto cursor-pointer rounded-full border-white hover:border"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(Ground.Warrior, nft);
                    }}
                  />
                  <Image
                    src="/static/images/mystic.png"
                    height={30}
                    width={30}
                    alt="mystic"
                    className="mx-auto cursor-pointer rounded-full border-white hover:border"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(Ground.Mystic, nft);
                    }}
                  />
                </div>
              </>
            </button>
          );
        })}
      </div>
      <p className="my-4 flex h-[20px] justify-center text-xs uppercase">
        {selected?.length > 0 && `${selected.length} selected`}
      </p>
      <div className="flex h-9 items-center justify-center gap-6">
        <SelectLock selected={lock} updateLock={setLock} />
        <button
          disabled={!selected || selected?.length === 0}
          onClick={onStake}
          className="flex h-full items-center border-4 border-black bg-smolBrownAlternative px-2 text-[.60rem] uppercase"
        >
          Stake
        </button>
      </div>
    </>
  );
};
