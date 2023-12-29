import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useNetwork, useProvider } from 'wagmi';
import { formatEther } from 'ethers/lib/utils.js';
import { cn, generateHash } from '@utils';

import { ARBITRUM, SMOL_AGE_ADDRESS } from '@config';
import { NeanderSmol, NeanderSmol__factory } from '@typechain';
import { DevGroundFeInfoStructOutput } from '@typechain/DevelopmentGrounds';

import Image from 'next/image';
import { GroundIcon } from './GroundIcon';
import { StakeDetail } from './StakeDetail';

export const StakedTokenRow = ({
  token,
  selected,
  bonesBalance,
  refetchUserStake,
  setSelected,
}: {
  token: DevGroundFeInfoStructOutput;
  selected: BigNumber[];
  bonesBalance: BigNumber;
  refetchUserStake: () => void;
  setSelected: (value: BigNumber[]) => void;
}) => {
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const provider = useProvider();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [primarySkill, setPrimarySkill] = useState<NeanderSmol.PrimarySkillStructOutput>();

  const tokenId = token.stakedSmols.toString();
  const isSelected = selected?.includes(token.stakedSmols);
  const imageHash = generateHash(tokenId + '.png');

  const refetchPrimarySkill = async () => {
    const primarySkill = await NeanderSmol__factory.connect(
      SMOL_AGE_ADDRESS[chainId],
      provider,
    ).getPrimarySkill(tokenId);
    setPrimarySkill(primarySkill);
  };

  const refresh = async () => {
    refetchUserStake();
    await refetchPrimarySkill();
  };

  useEffect(() => {
    (async () => {
      await refetchPrimarySkill();
    })();
  }, [token.stakedSmols]);

  return (
    <>
      <tr
        key={tokenId}
        className={cn(isSelected ? 'bg-smolBrownLight/40' : '', 'cursor-pointer')}
        onClick={() => {
          if (selected?.includes(token.stakedSmols)) {
            setSelected(selected.filter((id) => id !== token.stakedSmols));
          } else {
            setSelected([...(selected ?? []), token.stakedSmols]);
          }
        }}
      >
        <>
          <th scope="row" className="whitespace-nowrap text-center">
            <input
              type="checkbox"
              checked={isSelected}
              className="h-5 w-5 rounded text-smolBrown focus:ring-0"
            />
          </th>
          <td className="flex flex-col items-center justify-center whitespace-nowrap py-2 text-xs">
            <div className="relative">
              <Image
                src={`/api/neandersmols/image/${tokenId}?chainId=${chainId}&date=${Date.now()}`}
                alt={`smol #${tokenId.toString()}`}
                width={100}
                height={100}
                className="m-2 rounded-lg"
              />
              <div className="absolute -right-0.5 -top-0.5">
                <GroundIcon ground={token.ground} size={35} className="mx-auto rounded-full animate-beat" />
              </div>
            </div>

            <div className="pt-2 uppercase">#{tokenId.toString()}</div>
          </td>
          <td className="whitespace-nowrap text-center text-xs">
            {/* LEVEL: {formatEther(token.skillLevel.toString())} */}
            Mystic Level:{' '}
            <span className="text-[#e84bd9]">
              {parseFloat(formatEther(primarySkill?.mystics.toString() ?? 0)).toFixed(0)}
            </span>
            <br />
            Fighter Level:{' '}
            <span className="text-smolBrownAlternative">
              {parseFloat(formatEther(primarySkill?.fighters.toString() ?? 0)).toFixed(0)}
            </span>
            <br />
            Farmer Level:{' '}
            <span className="text-[#36f645]">
              {parseFloat(formatEther(primarySkill?.farmers.toString() ?? 0)).toFixed(0)}
            </span>
            <br />
            <br />
            <span className="pt-2">
              $BONES: {parseFloat(formatEther(token.bonesAccured).toString()).toFixed(0)}
            </span>
          </td>
          <td className="whitespace-nowrap text-center text-xs">
            {parseFloat(formatEther(token.totalBonesStaked).toString()).toFixed(0)}
          </td>
          <td className="whitespace-nowrap text-center text-xs">
            {token.timeLeft.toNumber() + 1} days
          </td>
          <td>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetail(!showDetail);
              }}
              className="btn border-black bg-green-400 font-bold text-black px-3"
            >
              details
            </button>
          </td>
        </>
      </tr>
      {showDetail && <StakeDetail token={token} balance={bonesBalance} refresh={refresh} />}
    </>
  );
};
