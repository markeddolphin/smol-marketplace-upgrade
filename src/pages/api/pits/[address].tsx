import { ARBITRUM, ARBITRUM_GOERLI, SMOL_AGE_BONES, THE_PITS, POLYGON_MUMBAI, POLYGON } from '@config';
import { Bones__factory, Pits__factory } from '@typechain';
import { BigNumber, ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

const ZERO = BigNumber.from(0);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(422).json({ error: true, message: 'Nah ah ah, ooga ooga' });
  }
  const chain = +(req.query['chainId'] as string);
  const address = req.query['address'] as string;

  const isTest = chain === POLYGON;
  const chainNumber = isTest ? POLYGON : ARBITRUM;
  // const isTest = chain === POLYGON_MUMBAI;
  // const chainNumber = isTest ? POLYGON_MUMBAI : ARBITRUM;
  // const isTest = chain === ARBITRUM_GOERLI;
  // const chainNumber = isTest ? ARBITRUM_GOERLI : ARBITRUM;

  const provider = new ethers.providers.InfuraProvider(
    isTest ? 'arbitrum-goerli' : 'arbitrum',
    process.env.NEXT_PUBLIC_INFURA_ID,
  );

  const bonesBalance = Bones__factory.connect(SMOL_AGE_BONES[chainNumber], provider).balanceOf(address);
  const bonesStaked = Pits__factory.connect(
    THE_PITS[chain],
    provider,
  ).getBonesStaked(address);

  const [balance, staked]: BigNumber[] = await Promise.allSettled([
    bonesBalance,
    bonesStaked,
  ]).then((results) => results.map((value) => (value.status === 'fulfilled' ? value.value : ZERO)));

  return res.status(200).json({
    bonesBalance: balance,
    bonesStaked: staked,
  });
}
