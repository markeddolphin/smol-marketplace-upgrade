import { ARBITRUM, DEVELOPMENT_GROUNDS } from '@config';
import { Phase2Context } from '@context/phase2Context';
import { DevelopmentGrounds__factory } from '@typechain';
import { DevGroundFeInfoStructOutput } from '@typechain/DevelopmentGrounds';
import { BigNumber } from 'ethers';
import { useContext, useEffect, useState, useMemo } from 'react';
import { useAccount, useNetwork, useProvider } from 'wagmi';
import { StakedTokenRow } from './StakedTokenRow';

interface MyStakesProps {
  bonesBalance?: BigNumber;
  refetchUserStake: () => void;
}

export const MyStakes: React.FC<MyStakesProps> = ({ bonesBalance, refetchUserStake }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const provider = useProvider();
  const { claimBonesDevelopmentGrounds, leaveDevelopmentGrounds } = useContext(Phase2Context);
  const [selected, setSelected] = useState<BigNumber[]>();
  const [stakedTokens, setStakedTokens] = useState<DevGroundFeInfoStructOutput[]>([]);

  useEffect(() => {
    if (!!address && chainId) {
      stakedInCave();
    }
  }, [address, chainId]);

  const stakedInCave = async () => {
    const stakedTokens: DevGroundFeInfoStructOutput[] = await DevelopmentGrounds__factory.connect(
      DEVELOPMENT_GROUNDS[chainId],
      provider,
    ).getDevGroundFeInfo(address);
    setStakedTokens(stakedTokens);
  };

  const isAllSelected = useMemo(
    () => selected?.length === stakedTokens.length && stakedTokens.length > 0,
    [selected, stakedTokens],
  );

  return (
    <>
      <div className="h-[60vh] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-[10] bg-smolBrownAlternative py-2 text-xs text-black">
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
                      setSelected(stakedTokens.map((token) => token.stakedSmols));
                    }
                  }}
                />
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-xs sm:pl-6">
                Neandersmol
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs">
                Skill/
                <br />
                $BONES accrued
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs">
                Total $BONES staked
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs">
                Remaining
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-xs" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stakedTokens.map((token: DevGroundFeInfoStructOutput) => {
              return (
                <StakedTokenRow
                  token={token}
                  selected={selected}
                  setSelected={setSelected}
                  bonesBalance={bonesBalance}
                  refetchUserStake={refetchUserStake}
                  key={JSON.stringify(token)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mx-auto mt-4 flex justify-center space-x-4">
        <button
          disabled={!selected || selected?.length === 0}
          onClick={() => claimBonesDevelopmentGrounds(selected).then(stakedInCave)}
          className="btn w-[180px]"
        >
          Claim $BONES
        </button>
        <button
          disabled={!selected || selected?.length === 0}
          onClick={() => leaveDevelopmentGrounds(selected).then(stakedInCave)}
          className="btn"
        >
          Unstake Selected
        </button>
      </div>
    </>
  );
};
