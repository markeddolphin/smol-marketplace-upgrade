import { ARBITRUM, SMOL_AGE_STAKING } from '@config';
import { Staking__factory } from '@typechain';
import { isAddress } from 'ethers/lib/utils.js';
import { useAccount, useContractRead, useNetwork } from 'wagmi';

export const useStakedNFTs = () => {
  const { chain } = useNetwork();
  //const address = '0xd411c5C70339F15bCE20dD033B5FfAa3F8d2806f';
  const { address } = useAccount();

  return useContractRead({
    address: SMOL_AGE_STAKING[chain?.id ?? ARBITRUM],
    abi: Staking__factory.abi,
    functionName: 'getUserInfo',
    args: [address],
    enabled: isAddress(address),
  });
};
