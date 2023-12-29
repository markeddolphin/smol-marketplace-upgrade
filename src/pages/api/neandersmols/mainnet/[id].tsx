import { getNeandersmolEnabledAddons } from "@api/getNeandersmolAddons";
import { ALL_ADDONS } from "@components/phase2/customize/addons_constants";
import { ARBITRUM } from "@config";
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(422).json({ error: true, message: 'Nah ah ah, ooga ooga' });
  }

  const { id } = req.query;
  if (!id || Number(id) < 0 || Number(id) >= 5678) {
    return res.status(404).json({ error: 'invalid id' });
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const neandersmolData = require(`@utils/metadata/${Number(id)}/${Number(id)}.json`);

  if (!neandersmolData) {
    return res.status(404).json({ error: 'neandersmol not found' });
  }
  
  const provider = new ethers.providers.InfuraProvider(
    'arbitrum',
    process.env.NEXT_PUBLIC_INFURA_ID,
  );
  const addons = await getNeandersmolEnabledAddons(ARBITRUM, Number(id), provider);

  const foundHatAddon = ALL_ADDONS("","").find((addon) => addon.id === addons.hat);
  const foundHandAddon = ALL_ADDONS("","").find((addon) => addon.id === addons.hand);
  const foundMaskAddon = ALL_ADDONS("","").find((addon) => addon.id === addons.mask);
  const foundSpecialAddon = ALL_ADDONS("","").find((addon) => addon.id === addons.special);

  const data = {
    name: neandersmolData.name,
    description: neandersmolData.description,
    attributes: [...neandersmolData.attributes,  {
      "trait_type": "Hat",
      "value": foundHatAddon ? foundHatAddon.name : "None"
    },{
      "trait_type": "Hand",
      "value": foundHandAddon ? foundHandAddon.name : "None"
    },{
      "trait_type": "Mask",
      "value": foundMaskAddon ? foundMaskAddon.name : "None"
    },{
      "trait_type": "Special",
      "value": foundSpecialAddon ? foundSpecialAddon.name : "None"
    }],
    // Change this to production
    image: `https://www.smolage.com/api/neandersmols/image/${id}?date=${Date.now()}`,
    token_id: neandersmolData.token_id,
  };

  return res.status(200).json(data);
}
