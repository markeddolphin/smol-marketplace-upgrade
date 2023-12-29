import { ADDONS_CONTROLLER_ADDRESS } from '@config';
import { AddonsController__factory } from '@typechain';
import { Signer } from 'ethers';
import type { Provider } from '@ethersproject/providers';

export async function getNeandersmolEnabledAddons(
  chainId: number,
  tokenId: number,
  provider: Signer | Provider,
): Promise<{
  hat: string;
  hand: string;
  mask: string;
  special: string;
}> {
  try {
    const addonsController = AddonsController__factory.connect(
      ADDONS_CONTROLLER_ADDRESS[chainId],
      provider,
    );

    const result = await addonsController.getTokenAddons(tokenId);
    return {
      hat: result.hat,
      hand: result.hand,
      mask: result.mask,
      special: result.special,
    };
  } catch (e) {
    console.error(e);
    return {
      hat: '',
      hand: '',
      mask: '',
      special: '',
    };
  }
}
