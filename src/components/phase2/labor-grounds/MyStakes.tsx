import { ANIMALS, ARBITRUM, LABOR_GROUNDS } from '@config';
import { Phase2Context } from '@context/phase2Context';
import { LaborGroundFeInfoStructOutput } from '@typechain/LaborGrounds';
import { BigNumber } from 'ethers';

import { useApproveERC721, useIsApprovedERC721 } from '@hooks/useApprove';
import { useBalancesERC1155 } from '@hooks/useBalance';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useNetwork } from 'wagmi';

import { ConsumableRewardModal } from '@components/modals/ConsumableRewardModal';
import { Animal, Consumable, ConsumableType } from '@model/model';
import { tools } from '../shop/Shop';
import { StakedTokenRow } from './StakedTokenRow';

export const animals: Animal[] = [
  {
    name: 'BABY DINO',
    image: '/static/images/phase2/animals/baby_dino.gif',
    id: BigNumber.from(10),
  },
  { name: 'WOLF', image: '/static/images/phase2/animals/wolf.gif', id: BigNumber.from(11) },
  {
    name: 'SABERTOOTH',
    image: '/static/images/phase2/animals/sabertooth.gif',
    id: BigNumber.from(12),
  },
  { name: 'TREX', image: '/static/images/phase2/animals/trex.gif', id: BigNumber.from(13) },
  { name: 'MAMMOTH', image: '/static/images/phase2/animals/mammoth.gif', id: BigNumber.from(14) },
  { name: 'WHALE', image: '/static/images/phase2/animals/whale.gif', id: BigNumber.from(15) },
];

export const consumables: Consumable[] = [
  {
    id: BigNumber.from(16),
    name: 'DIRT',
    image: 'https://ipfs.io/ipfs/QmPftfaQG1eJ9jwX4RCx8dfgBidsj3jB2icfEEzxzKeiuK',
    type: ConsumableType.Common,
  },
  {
    id: BigNumber.from(17),
    name: 'HERB',
    image: 'https://ipfs.io/ipfs/QmQb4MngE9kdzak4wMMMxAD6vQo2UJvuTSq16XjUcxmNNe',
    type: ConsumableType.Common,
  },
  {
    id: BigNumber.from(18),
    name: 'STONES',
    image: 'https://ipfs.io/ipfs/QmcSH8EKkopoFzTJ8zyNHUgnJrqJYfxAhZUfDzLvm21KQY',
    type: ConsumableType.Common,
  },
  {
    id: BigNumber.from(19),
    name: 'FERTILE SOIL',
    image: 'https://ipfs.io/ipfs/QmPhfquvL6EDkY2YLiLh7cSZgeWTXQmyA5qWnDdTWnzCUo',
    type: ConsumableType.Rare,
  },
  {
    id: BigNumber.from(20),
    name: 'FUNGI',
    image: 'https://ipfs.io/ipfs/QmUjBBzK7D9PtZyTSeLM3VzmDu3DVpb4yLXbDGCxqRRw6o',
    type: ConsumableType.Rare,
  },
  {
    id: BigNumber.from(21),
    name: 'PRECIOUS METALS',
    image: 'https://ipfs.io/ipfs/QmaCr3QLNBLQve52ZYP2MZLpxav3prLym8UfRSUuT7sAKK',
    type: ConsumableType.Rare,
  },
];

const UINT32_MAX_VALUE = BigNumber.from('0xFFFFFFFF');

export const hasAnimal = (token: LaborGroundFeInfoStructOutput) => {
  return !token.animalId.eq(UINT32_MAX_VALUE);
};

export const MyStakes = ({ job }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const {
    stakedSmolsInLaborGrounds,
    leaveLaborGrounds,
    claimCollectableLaborGrounds,
    bringInAnimalsToLaborGrounds,
    removeAnimalsFromLaborGrounds,
  } = useContext(Phase2Context);

  const supplyToken = tools.find((tool) => tool.tokenId.eq(BigNumber.from(job.id + 1)));

  const [selected, setSelected] = useState<BigNumber[]>([]);
  const [stakedTokens, setStakedTokens] = useState<LaborGroundFeInfoStructOutput[]>([]);
  const selectedTokensHavingAnimals = useMemo(
    () =>
      stakedTokens.filter(
        (token: LaborGroundFeInfoStructOutput) =>
          selected.includes(token.tokenId) && hasAnimal(token),
      ),
    [selected.length, stakedTokens.length],
  );
  const [animalsInQueue, setAnimalsInQueue] = useState([]);
  const claimableTokenIds = useRef([]);

  const [txSucceed, setTxSucceed] = useState({ value: false });

  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  const { data: animalBalances, refetch: refetchAnimalBalances } = useBalancesERC1155(
    ANIMALS[chainId],
    Array(animals.length).fill(address),
    animals.map((animal) => animal.id),
  );
  const { data: animalAllowance, refetch: refetchAnimalAllowance } = useIsApprovedERC721(
    ANIMALS[chainId],
    address,
    LABOR_GROUNDS[chainId],
  );
  const { approve: approveAnimal, success: approvingTxSucceed } = useApproveERC721(
    ANIMALS[chainId],
    LABOR_GROUNDS[chainId],
  );

  const [claimingTxSucceed, setClaimingTxSucceed] = useState({ value: false });

  const selectableAnimals = useMemo(() => {
    if (!animalBalances) return [];
    const _animalBalances = [...animalBalances];
    animalsInQueue.forEach((x) => {
      const index = animals.findIndex((y) => y.id.eq(x.animalId));
      _animalBalances[index] = _animalBalances[index].sub(1);
    });
    const animalIndexes = _animalBalances
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value.gt(0))
      .map(({ value, index }) => index);
    return animals.filter((animal, index) => animalIndexes.includes(index));
  }, [animalsInQueue.length, animalBalances]);

  useEffect(() => {
    if (!!address && chainId) {
      stakedInLaborGrounds();
      refetchAnimalBalances();
    }
  }, [address, chainId, txSucceed]);

  useEffect(() => {
    refetchAnimalAllowance();
  }, [approvingTxSucceed]);

  const stakedInLaborGrounds = async () => {
    const stakedTokens = await stakedSmolsInLaborGrounds(address);
    setStakedTokens(stakedTokens.filter((token) => token.supplyId.eq(supplyToken.tokenId)));
    setSelected([]);
    setAnimalsInQueue([]);
  };

  const onSelect = (tokenId: BigNumber) => {
    if (selected?.includes(tokenId)) {
      setSelected(selected.filter((id) => id !== tokenId));
    } else {
      setSelected([...(selected ?? []), tokenId]);
    }
  };

  const onElapsedLockTime = (tokenId: BigNumber) => {
    claimableTokenIds.current.push(tokenId);
  };

  const isClaimable = (tokenId: BigNumber) => {
    return claimableTokenIds.current.map((x) => x.toNumber()).includes(tokenId.toNumber());
  };

  const validateClaimable = (tokenIds: BigNumber[]) => {
    if (tokenIds.filter((tokenId: BigNumber) => !isClaimable(tokenId)).length > 0) {
      toast.error('Unclaimable token selected');
      return false;
    }
    return true;
  };

  const unstake = async () => {
    if (!validateClaimable(selected)) return;
    const success = await leaveLaborGrounds(selected);
    if (success) {
      setTxSucceed({ value: true });
      setClaimingTxSucceed({ value: true });
    }
  };

  const claim = async () => {
    if (!validateClaimable(selected)) return;
    const success = await claimCollectableLaborGrounds(selected);
    if (success) {
      setTxSucceed({ value: true });
      setClaimingTxSucceed({ value: true });
    }
  };

  const addAnimals = async () => {
    if (!animalAllowance) await approveAnimal();
    const success = await bringInAnimalsToLaborGrounds(
      animalsInQueue.map((animal) => animal.tokenId),
      animalsInQueue.map((animal) => animal.animalId),
    );
    if (success) {
      setTxSucceed({ value: true });
    }
  };

  const removeAnimals = async () => {
    const success = await removeAnimalsFromLaborGrounds(
      selectedTokensHavingAnimals.map((token) => token.tokenId),
    );
    if (success) {
      setTxSucceed({ value: true });
    }
  };

  const isAllSelected = useMemo(
    () => selected?.length === stakedTokens.length && stakedTokens.length > 0,
    [selected, stakedTokens],
  );
  
  return (
    <>
      <div className="h-[50vh] overflow-auto">
        <table className="w-full p-4">
          <thead className="sticky top-0 bg-smolBrownAlternative py-2 text-xs text-black">
            <tr className="py-2">
              <th scope="col" className="py-3.5 px-3 text-center text-xs sm:pl-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  className="h-5 w-5 rounded text-smolBrown ring-0 focus:ring-0"
                  onChange={() => {
                    if (isAllSelected) {
                      setSelected([]);
                    } else {
                      setSelected(stakedTokens.map((token) => token.tokenId));
                    }
                  }}
                />
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-xs sm:pl-6">
                Neandersmol
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs">
                Animal
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs">
                Time Remaining
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stakedTokens.map((token: LaborGroundFeInfoStructOutput) => (
              <StakedTokenRow
                token={token}
                selectableAnimals={selectableAnimals}
                isSelected={selected?.includes(token.tokenId)}
                onSelect={onSelect}
                onElapsed={onElapsedLockTime}
                onAnimalChange={(animal: Animal | null) => {
                  if (animal === null) {
                    const index = animalsInQueue.findIndex((x) => x.tokenId === token.tokenId);
                    if (index !== -1) {
                      const _animalsInQueue = [...animalsInQueue];
                      _animalsInQueue.splice(index, 1);
                      setAnimalsInQueue(_animalsInQueue);
                    }
                  } else {
                    setAnimalsInQueue([
                      ...animalsInQueue,
                      { tokenId: token.tokenId, animalId: animal.id },
                    ]);
                  }
                }}
                key={JSON.stringify(token)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mx-auto mt-4 flex flex-col justify-between  gap-5 sm:flex-row">
        <div className="flex justify-center gap-2">
          <button disabled={!selected || selected?.length == 0} onClick={claim} className="btn">
            claim selected
          </button>
          <button disabled={!selected || selected?.length == 0} onClick={unstake} className="btn">
            Unstake selected
          </button>
        </div>
        <div className="flex justify-center gap-2">
          <button
            disabled={!animalsInQueue || animalsInQueue?.length == 0}
            onClick={addAnimals}
            className="btn"
          >
            add animals
          </button>
          <button
            disabled={!selectedTokensHavingAnimals || selectedTokensHavingAnimals?.length == 0}
            onClick={removeAnimals}
            className="btn"
          >
            remove animals
          </button>
        </div>
      </div>
      <ConsumableRewardModal claimingTxSucceed={claimingTxSucceed} supplyToken={supplyToken} />
    </>
  );
};
