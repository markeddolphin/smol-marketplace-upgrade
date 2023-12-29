import { ARBITRUM, SMOL_AGE_BONES_STAKING } from '@config';
import { WalletContext } from '@context/wallet-context';
import { BonesStaking__factory } from '@typechain';
import { cn } from '@utils';
import { isAddress } from 'ethers/lib/utils.js';
import Link from 'next/link';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import { LoadingButton } from './LoadingButton';


const Play = () => {
  const { unstakeAllBones, unstakeAllSmols, isLoading } = useContext(WalletContext);
  const [action, setAction] = useState(0);
  const { chain } = useNetwork();
  const { address } = useAccount()

  const { data } = useContractRead({
    address: SMOL_AGE_BONES_STAKING[chain?.id ?? ARBITRUM],
    abi: BonesStaking__factory.abi,
    functionName: 'getStakes',
    args: [address],
    enabled: isAddress(address),
  });

  return (
    <div className="relative flex min-h-screen bg-game-page bg-cover bg-center max-xs:overflow-x-scroll">
      <div className="px-4 absolute left-1/2 top-[55%] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2">
        <Link href="/phase2">
          <Image src="/static/images/back.png" height={200} width={200} alt="Back Button" className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[60px]" />
        </Link>
        <div className="mb-10 bg-black/60 px-6 py-8 md:p-12 max-sm:text-xs text-sm space-y-4">
          <div className='flex gap-4 pb-4 justify-center'>
            <LoadingButton className='btn' onClick={async () => {
              setAction(1);
              await unstakeAllBones();
              setAction(0);
            }}
              loading={isLoading && action === 1} text={'unstake $BONES'} />
            <LoadingButton className={cn(data?.length > 0 ? "bg-gray-500 cursor-default" : "", 'btn')} onClick={() => {
              setAction(2);
              unstakeAllSmols();
              setAction(0);
            }} loading={isLoading && action === 2} text={'unstake Smols'} disabled={data?.length > 0} />
          </div>
          <p>
            Unstake all $BONES and Neandersmols and join phase 2. OOGA!
          </p>
          <p>
            Important: You must first unstake your $BONES before unstaking your Neandersmols.
          </p>
          <p>
            NOTE: you can unstake 50 stakes of $BONES per transaction.
            If you staked more, you may be prompted to sign multiple transactions.
          </p>
        </div>
      </div>
    </div >
  );
};

export default Play;
