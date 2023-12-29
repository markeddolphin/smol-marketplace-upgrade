import { ADDONS_CONTROLLER_ADDRESS } from '@config';
import { Phase2Context } from '@context/phase2Context';
import { AddonsController__factory } from '@typechain';
import { BigNumber } from 'ethers';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';


export function useCustomizeSmol(
  chainId: number,
  tokenId: number,
  selectedAddons: {
    hat: string;
    hand: string;
    mask: string;
    special: string;
  },

) {

  const { refetchNFTs } = useContext(Phase2Context);

  const selectedAddonsToSend = {
    hat: selectedAddons.hat,
    hand: selectedAddons.hand,
    mask: selectedAddons.mask,
    special: selectedAddons.special,
  };


  const { config, error: errorConfig } = usePrepareContractWrite({
    address: ADDONS_CONTROLLER_ADDRESS[chainId],
    abi: AddonsController__factory.abi,
    chainId,
    functionName: 'setAddons',
    args: [BigNumber.from(tokenId),  [selectedAddonsToSend.hat, selectedAddonsToSend.hand, selectedAddonsToSend.mask, selectedAddonsToSend.special]],
  });

  const { data: approvalData, writeAsync, isLoading, error } = useContractWrite(config);

  const execute = async () => {
    if (writeAsync) {
      try {
        await writeAsync();
      toast.success('Addons updated');
      refetchNFTs();
      } catch (e) {
        toast.error('Something went wrong');
      }
    } else {
      toast.error('Something went wrong');
    }
  };
  return {
    isLoading,
    error,
    execute,
  };
}
