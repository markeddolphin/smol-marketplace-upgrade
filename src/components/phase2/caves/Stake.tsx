import { Phase2Context } from '@context/phase2Context';
import useGroundsModal from '@hooks/useGroundsModal';
import { useStakedInPits } from '@hooks/useStakedInPits';
import { NFTObject } from '@model/model';
import { cn } from '@utils';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import { useContext, useState } from 'react';

const disclaimer =
  'Disclaimer: staking your Neandersmol in the caves will lock it for 100 days. You will not be able to withdraw or transfer your Neandersmol until the stake period is complete.';

export const Stake = () => {
  const { enterCaves, nfts } = useContext(Phase2Context);
  const [selected, setSelected] = useState<BigNumber[]>();

  const groundsModal = useGroundsModal()
  const { open } = useStakedInPits();

  const onStake = () => {
    if (!open) {
      return groundsModal.onOpen();
    }
    return enterCaves(selected)
  }

  return (
    <div>
      <p className="mx-auto max-w-2xl text-xs text-white">{disclaimer}</p>

      <div className="grid max-h-[45vh] grid-cols-3 gap-1 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
        {nfts
          ?.filter((nft) => !nft.staked)
          .map((nft: NFTObject) => {
            const isSelected = selected?.includes(nft.id);
            return (
              <button
                key={nft.id.toString()}
                className={cn(
                  isSelected ? 'border-smolBrownLight' : 'border-black',
                  'mx-auto mt-4 btn',
                )}
                onClick={() => {
                  if (selected?.includes(nft.id)) {
                    setSelected(selected.filter((id) => id !== nft.id));
                  } else {
                    setSelected([...(selected ?? []), nft.id]);
                  }
                }}
              >
                <>
                  <Image
                    src={nft.image}
                    alt={`smol #${nft.id.toString()}`}
                    width={110}
                    height={110}
                    className="rounded-lg"
                  />
                  <div className="pt-3 text-center text-xs uppercase">#{nft.id}</div>
                </>
              </button>
            );
          })}
      </div>

      <p className="mt-4 flex h-[20px] justify-center text-xs uppercase">
        {selected?.length > 0 && `${selected.length} selected`}
      </p>
      {selected?.length > 0 && (
        <button
          disabled={!selected || selected?.length === 0}
          onClick={onStake}
          className="btn flex px-8 mx-auto mt-2"
        >
          Stake
        </button>
      )}
    </div>
  );
};
