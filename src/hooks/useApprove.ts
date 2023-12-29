import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Address,
  erc20ABI,
  erc721ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

export const useApproveERC721 = (address: Address, spender: Address) => {
  const [isSuccess, setIsSuccess] = useState({value: false});
  const { config } = usePrepareContractWrite({
    address,
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    args: [spender, true],
    enabled: !!address,
  });

  const { data: approvalData, write: writeApproval } = useContractWrite(config);

  useEffect(() => {
    if (approvalData) {
      approvalData
        .wait(1)
        .then(() => {
          setIsSuccess({value: true})
          toast.success('Approval set!')
        })
        .catch(() => toast.error('Approval failed!'));
      // .finally(() => setLoading(false));
    }
  }, [approvalData]);

  return {success: isSuccess, approve: writeApproval};
};

export const useApproveERC20 = (address: Address, spender: Address, value: BigNumber, onComplete?: () => void) => {
  const [isSuccess, setIsSuccess] = useState({value: false});
  const { config } = usePrepareContractWrite({
    address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender, value],
    enabled: !!address,
  });

  const { data: approvalData, writeAsync: writeApproval } = useContractWrite(config);

  useEffect(() => {
    if (approvalData) {
      approvalData
        .wait(1)
        .then(() => {
          setIsSuccess({value: true})
          toast.success('Approval set!')
          if (onComplete) {
            onComplete();
          }
        })
        .catch(() => toast.error('Approval failed!'));
      // .finally(() => setLoading(false));
    }
  }, [approvalData]);

  return {success: isSuccess, approve: writeApproval};
};

export const useAllowance = (
  address: Address,
  ownerAddress: Address,
  spender: Address,
  enabled?: boolean,
) =>
  useContractRead({
    address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [ownerAddress, spender],
    enabled: !!address && enabled,
  });

export const useIsApprovedERC721 = (
  address: Address,
  ownerAddress: Address,
  spender: Address,
  enabled?: boolean,
) =>
  useContractRead({
    address,
    abi: erc721ABI,
    functionName: 'isApprovedForAll',
    args: [ownerAddress, spender],
    enabled: !!address && enabled,
  });