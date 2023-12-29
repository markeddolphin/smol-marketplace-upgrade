import { ARBITRUM_GOERLI } from "@config";

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
  
    const data = {
      name: neandersmolData.name,
      description: neandersmolData.description,
      attributes: neandersmolData.attributes,
      // Change this to production
      image: `https://smol-age-website-git-addons-smolage.vercel.app/api/neandersmols/image/${id}?chainId=${ARBITRUM_GOERLI}&date=${Date.now()}`,
      token_id: neandersmolData.token_id,
    };
  
    return res.status(200).json(data);
  }
  