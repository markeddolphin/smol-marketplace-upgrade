import { getNeandersmolEnabledAddons } from '@api/getNeandersmolAddons';
import { ARBITRUM, ARBITRUM_GOERLI, POLYGON_MUMBAI, POLYGON } from '@config';
import { generateHash } from '@utils';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { polygonMumbai, polygon} from 'wagmi/dist/chains';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(422).json({ error: true, message: 'Nah ah ah, ooga ooga' });
  }



  // Headers for image content
  // res.setHeader(
  //   "Cache-Control",
  //   `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
  // );
  res.setHeader("Content-Type", "image/png");

  // Verify the id is valid
  const { id, chainId, empty, date } = req.query;
  if (!id || Number(id) < 0 || Number(id) >= 5678) {
    return res.status(404).json({ error: 'invalid id' });
  }

  // Get the chain and provider info
  const chain = Number(chainId);

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

  // Get the development grounds info
  // const { mystic, farmer, fighter } = await getNeandersmolPrimarySkills(chainNumber, id, provider);

  // Base image
  const imageHash = generateHash(String(id) + '.png');
  const baseImage = `/public/assets/neandersmols/${imageHash}.png`;
  const filePath = path.join(process.cwd(), baseImage);

  // We get the enabled addons from the addon controller contract
  const addons = await getNeandersmolEnabledAddons(chainNumber, Number(id), provider);


  const foundAddons = Object.values(addons).filter((addon) => !!addon).join(',');

  // const addon = mystic.gte(parseEther('100')) ? 'wizardhat' : farmer.gte(parseEther('100')) ? 'farmerhat' : fighter.gte(parseEther('100')) ? 'fighterhat' : null;
  if (foundAddons && !empty) {
    try {
      const imageWithAddons = `https://dynamic-image-generation.vercel.app/api?id=${id}&addons=${foundAddons}`
      // Fetch the image from the external API
      const response = await fetch(imageWithAddons);

      // Check if the response is successful
      if (!response.ok) {
        res.status(response.status).send('Error fetching the image');
        return;
      }

      // Set the response headers to match the content type of the fetched image
      // res.setHeader('Content-Type', response.headers.get('Content-Type'));
      // Return the image
      const nodeReadableStream = Readable.from(response.body as any);
      nodeReadableStream.pipe(res);
      return
    } catch (error) {
      console.error('Error fetching image:', error);

    }
  }

  // Return default image
  const readStream = fs.createReadStream(filePath);
  await new Promise(function (resolve) {
    readStream.pipe(res);

    readStream.on("end", resolve);
  });
}
