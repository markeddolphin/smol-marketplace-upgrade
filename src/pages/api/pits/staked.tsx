import { ARBITRUM, ARBITRUM_GOERLI, SMOL_AGE_BONES, THE_PITS, POLYGON_MUMBAI } from '@config';
import { Bones__factory, Pits__factory } from '@typechain';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(422).json({ error: true, message: 'Nah ah ah, ooga ooga' });
  }

  const chain = +(req.query['chainId'] as string);
  const isTest = chain === POLYGON_MUMBAI;
  const chainNumber = isTest ? POLYGON_MUMBAI : ARBITRUM;
  // const isTest = chain === ARBITRUM_GOERLI;
  // const chainNumber = isTest ? ARBITRUM_GOERLI : ARBITRUM;

  const provider = new ethers.providers.InfuraProvider(
    isTest ? 'arbitrum-goerli' : 'arbitrum',
    process.env.NEXT_PUBLIC_INFURA_ID,
  );
    
  const getTotalSupply = Bones__factory.connect(SMOL_AGE_BONES[chainNumber], provider).totalSupply();

  const getTotalBonesStaked = Pits__factory.connect(
    THE_PITS[chain],
    provider,
  ).getTotalBonesStaked();

  const getThreshold = Pits__factory.connect(
    THE_PITS[chain],
    provider,
  ).minimumPercent();

  const [totalSupply, totalStaked, threshold] = await Promise.all([
    getTotalSupply,
    getTotalBonesStaked,
    getThreshold
  ]);

  return res.status(200).json({
    totalSupply,
    totalStaked,
    threshold: threshold.mul(10)
  });
}
