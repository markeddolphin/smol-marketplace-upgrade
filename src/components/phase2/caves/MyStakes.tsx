import { ARBITRUM, CAVES } from '@config';
import { Phase2Context } from '@context/phase2Context';
import { Caves__factory } from '@typechain';
import { CavesFeInfoStructOutput } from '@typechain/Caves';
import { cn, toDays } from '@utils';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import Image from 'next/image';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useNetwork, useProvider } from 'wagmi';

export const MyStakes = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { leaveCave, claimCaveReward } = useContext(Phase2Context);
  const [selected, setSelected] = useState<BigNumber[]>();
  const [stakedTokens, setStakedTokens] = useState<CavesFeInfoStructOutput[]>([]);

  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;

  useEffect(() => {
    if (!!address && chainId) {
      stakedInCave();
    }
  }, [address, chainId]);

  const stakedInCave = async () => {
    const stakedTokens: CavesFeInfoStructOutput[] = await Caves__factory.connect(
      CAVES[chainId],
      provider,
    ).getCavesFeInfo(address);
    setStakedTokens(stakedTokens);
  };

  const tokensWithClaimableRewards = useMemo(
    () =>
      stakedTokens
        .filter((token) => BigNumber.from(token.reward).gt(0))
        .map((token) => token.stakedSmols),
    [stakedTokens],
  );

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
                    setSelected(isAllSelected ? [] : stakedTokens.map((token) => token.stakedSmols));
                  }}
                />
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-xs sm:pl-6">
                Neandersmol
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs">
                Days Remaining
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs">
                $BONES Accrued
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stakedTokens.map((token: CavesFeInfoStructOutput) => {
              const tokenId = token.stakedSmols.toString();
              const isSelected = selected?.includes(token.stakedSmols);
              return (
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
                  <th scope="row" className="whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      className="h-5 w-5 rounded text-smolBrown focus:ring-0"
                    />
                  </th>
                  <td className="flex flex-col items-center justify-center whitespace-nowrap py-2 text-xs">
                    <Image
                      src={`/api/neandersmols/image/${tokenId}?chainId=${chainId}&date=${Date.now()}`}
                      alt={`smol #${tokenId.toString()}`}
                      width={70}
                      height={70}
                      className="rounded-lg"
                    />
                    <div className="pt-2 uppercase">#{tokenId.toString()}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-sm">
                    {toDays(token.timeLeft.toNumber())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-sm">
                    {parseFloat(formatEther(token.reward.toString()).toString()).toFixed(0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mx-auto mt-4 flex justify-center space-x-4">
        <button
          disabled={!tokensWithClaimableRewards || tokensWithClaimableRewards?.length === 0}
          onClick={() => claimCaveReward(tokensWithClaimableRewards).then(stakedInCave)}
          className="btn w-[180px]"
        >
          Claim $BONES
        </button>
        <button
          disabled={!selected || selected?.length === 0}
          onClick={() => leaveCave(selected)}
          className="btn"
        >
          Unstake Selected
        </button>
      </div>
    </>
  );
};
