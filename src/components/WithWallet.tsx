import {
  ARBITRUM,
  SMOL_AGE_ADDRESS, SMOL_AGE_BONES_STAKING,
  SMOL_AGE_STAKING,
  THE_GRAPH_API_URL
} from '@config';
import { WalletContext } from '@context/wallet-context';
import { useStakedNFTs } from '@hooks/useStakedNFTs';
import { useStakes } from '@hooks/useStakes';
import { NFTObject, UserToken } from '@model/model';
import {
  BonesStaking__factory, NeanderSmol__factory,
  Staking__factory
} from '@typechain';
import { generateHash } from '@utils';
import { BigNumber, ethers, utils } from 'ethers';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from 'urql';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

type Props = {
  children?: ReactNode;
};

const client = (chainId: number) =>
  createClient({
    url: THE_GRAPH_API_URL[chainId],
  });

const WithWallet = ({ children }: Props) => {
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const { address } = useAccount();
  //const address = '0xd411c5C70339F15bCE20dD033B5FfAa3F8d2806f';
  const provider = useProvider();
  const { data: signerData } = useSigner();
  const { data: stakedNfs } = useStakedNFTs();
  const { stakes: stakesData, refetch } = useStakes();
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<NFTObject[]>([]);
  const contract = NeanderSmol__factory.connect(SMOL_AGE_ADDRESS[ARBITRUM], provider);

  useEffect(() => {
    const onAddress = async () => {
      await getNfts();
    };
    if (!address || !chain) {
      setNfts([]);
    } else {
      onAddress();
    }
  }, [address, chain, stakedNfs]);

  const getError = (error) => {
    console.log('RAW ERROR', error);

    if (error.message) {
      if (error.message.includes('insufficient funds')) {
        return `Insufficient funds`;
      } else if (error.message.includes('insufficient balance for transfer')) {
        return 'Insuffienct funds.';
      } else if (error.message.includes('unstake the $BONES')) {
        return 'First unstake the $Bones paired with this Neander';
      } else if (error.message.includes('execution reverted')) {
        return error.message;
      } else if (chain?.id !== 42161) {
        return 'You must be connected to the mainnet to mint. Please switch to the Arbitrum Mainnet in your wallet.';
      } else if (error.message.includes("Returned values aren't valid, did it run Out of Gas?")) {
        if (chain?.id === 42161) {
          return 'YOU HAVE DEBUG ENABLED. Switch to Rinkeby network.';
        }

        return 'Client out of date. Please refresh the page.';
      }

      return 'Transaction reverted by contract.';
    } else {
      return error;
    }
  };

  // Start Staking

  const getNfts = async (): Promise<any> => {
    // get nft's of user
    const tokensQuery = `query ($account: String!) {
    user(id: $account) {
      tokens(first: 500) {
        tokenID
        name
        staked
        stakeLocation
        commonSense
      }
     }
    }`;

    await refetch();

    const { data, error } = await client(chainId)
      .query(tokensQuery, { account: address.toLowerCase() })
      .toPromise();

    const sNfts =
      stakedNfs?.length > 0
        ? await Promise.all(
          stakedNfs?.map(async (t) => {
            const stakes = stakesData.filter(
              (stake) => stake.tokenId.toString() === t.tokenId.toString(),
            );
            const amountStaked =
              stakes?.length > 0
                ? stakes.reduce((total, object) => total + object.amountStaked, 0)
                : 0;
            const sense = await contract.commonSense(t.tokenId);
            const commonSense = Number(utils.formatUnits(sense, 9));

            return {
              id: t.tokenId,
              name: `Neander Smol #${t.tokenId.toString()}`,
              staked: true,
              endTime: new Date(+t.endTime * 1000).getTime(),
              image: `/api/neandersmols/image/${t.tokenId}?chainId=${chainId}&date=${Date.now()}`,
              stakes: stakes ?? [],
              amountStaked,
              commonSense,
            };
          }),
        )
        : [];

    if (error) {
      toast.error('Something went wrong with fetching your account info.');
      return;
    }

    if (data?.user?.tokens?.length >= 0) {
      const nfts = data.user.tokens.map((t: UserToken) => {
        return {
          id: BigNumber.from(t.tokenID),
          name: t.name,
          staked: t.staked,
          image: `/api/neandersmols/image/${t.tokenID}?chainId=${chainId}&date=${Date.now()}`,
          commonSense: t.commonSense,
        };
      });

      setNfts(nfts.concat(sNfts));
      return;
    }
    setNfts(sNfts);
  };

  const unStake = async (tokenIds): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      const stakingContract = Staking__factory.connect(
        SMOL_AGE_STAKING[chainId],
        signerData,
      );
      const txRes = await stakingContract.unstakeSmol(tokenIds);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        await getNfts();
        toast.success('Your Neandersmol has left the Bone Yard');
        success = true;
      } else {
        console.log('Un staking error', txRes);
        toast.error('Something went wrong with un staking your smoles. Please try again.');
      }
    } catch (error) {
      toast.error(getError(error));
    }
    setIsLoading(false);
    return success;
  };

  // End Staking

  const unstakeBones = async (startTime, tokenId: ethers.BigNumberish): Promise<boolean> => {
    setIsLoading(true);

    let success = false;
    try {
      startTime = startTime.getTime() / 1000;

      const bonesStakingAddress = SMOL_AGE_BONES_STAKING[chainId];
      const bonesStakingContract = BonesStaking__factory.connect(bonesStakingAddress, signerData);
      const txRes = await bonesStakingContract.unstakeBones(startTime, tokenId);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        toast.success('Your Bones have been unstaked!');
        await getNfts();
        success = true;
      } else {
        toast.error('Something went wrong with claiming rewards. Please try again.');
      }
    } catch (error) {
      toast.error(getError(error));
    }
    setIsLoading(false);
    return success;
  };

  const claimCommonSense = async (tokenId: ethers.BigNumberish): Promise<any> => {
    setIsLoading(true);
    // sanity check chain id

    try {
      const bonesStakingAddress = SMOL_AGE_BONES_STAKING[chainId];
      const bonesStakingContract = BonesStaking__factory.connect(bonesStakingAddress, signerData);
      const txRes = await bonesStakingContract.claimRewards(tokenId);
      const receipt = await txRes.wait(1);

      if (receipt.status) {
        toast.success('Your Common Sense has been claimed!');
        await getNfts();
      } else {
        toast.error('Something went wrong with claiming rewards. Please try again.');
      }
    } catch (error) {
      toast.error(getError(error));
    }
    setIsLoading(false);
  };

  // unstake all

  const unstakeAllBones = async (): Promise<any> => {
    setIsLoading(true);

    try {
      const bonesStakingAddress = SMOL_AGE_BONES_STAKING[chainId];
      const bonesStakingContract = BonesStaking__factory.connect(bonesStakingAddress, signerData);

      // get all staked bones
      const stakedBones = await bonesStakingContract.getStakes(address);
      if (stakedBones?.length === 0) {
        toast.success('No bones to unstake.');
        return
      }

      // for each 50 stakes unstakeAll
      for (let i = 0; i < Math.ceil(stakedBones?.length / 50); i++) {
        const txRes = await bonesStakingContract.unstakeAll();
        await txRes.wait(1);
      }

      toast.success('Your Bones have been unstaked!');
    }
    catch (error) {
      toast.error(getError(error));
    }
    setIsLoading(false);
  }

  const unstakeAllSmols = async (): Promise<any> => {
    setIsLoading(true);

    try {
      const stakingAddress = SMOL_AGE_STAKING[chainId];
      const stakingContract = Staking__factory.connect(stakingAddress, signerData);

      // get all staked bones
      const tx = await stakingContract.unstakeAll();
      await tx.wait(1);
    
      toast.success('Your Neandersmols have been unstaked. OOOGA!');
    }
    catch (error) {
      if (error.message.includes("No Stakes")) {
        toast.success('No Neandersmols to unstake.');
        return
      }
    
      toast.error(getError(error));
    }
    setIsLoading(false);
  }


  return (
    <WalletContext.Provider
      value={{
        isLoading,
        unStake,
        nfts,
        unstakeBones,
        claimCommonSense,

        unstakeAllBones,
        unstakeAllSmols,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WithWallet;
