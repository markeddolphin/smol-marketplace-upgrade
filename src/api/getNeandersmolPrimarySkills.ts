import { SMOL_AGE_ADDRESS } from '@config';
import { NeanderSmol__factory } from '@typechain';
import { BigNumber, Signer } from 'ethers';
import type { Provider } from "@ethersproject/providers";
import { parseEther } from 'ethers/lib/utils.js';

// address staked 0xaa848e2e0074c468b1062d8551123243405b5f74
// dev grounds: https://arbiscan.io/address/0xbE342A5836E820d0a3f0AcbF28D8e7822328A7d8#readProxyContract
// Token id 3129

export async function getNeandersmolPrimarySkills(chainId: number, tokenId: number, provider: Signer | Provider): Promise<{
  mystic: BigNumber,
  farmer: BigNumber,
  fighter: BigNumber
}> {
  // We need to call the neandersmol contract the function getPrimarySkill 
  // It will return an array that is [mystic, farmers, fighters]

  const smolContract = NeanderSmol__factory.connect(SMOL_AGE_ADDRESS[chainId], provider);

  const primarySkill = await smolContract.getPrimarySkill(tokenId);
  return {
    mystic: primarySkill[0],
    farmer: primarySkill[1],
    fighter: primarySkill[2]
  }

}