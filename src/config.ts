import { Address } from 'wagmi';
import { arbitrum, arbitrumGoerli, polygonMumbai, polygon } from 'wagmi/chains';

export const ARBITRUM = 42161;
export const ARBITRUM_GOERLI = 421613;
export const POLYGON_MUMBAI = 80001;
export const POLYGON = 137;


export const MAGIC_ADDRESS: Record<number, Address> = {
  [arbitrum.id]: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
  [arbitrumGoerli.id]: '0xB704163b3Eb66dF2B9f6A942fAb88263A3b215A9',
};

export const SMOL_AGE_ADDRESS: Record<number, Address> = {
  [arbitrum.id]: '0x4d28e11f3ccf53229fd5ff78534068038266957b',
  [arbitrumGoerli.id]: '0x4d28e11f3ccf53229fd5ff78534068038266957b',
  [polygonMumbai.id]: '0xDBC4f966717933eB06B6d4fBbeFAb54683052e91',
  [polygon.id]: '0x6Fb413b2472C0C00d9aAf5EF84A26B459dFf0083',
};
// export const SMOL_AGE_ADDRESS: Record<number, Address> = {
//   [arbitrum.id]: '0x6b86936967a328b327a6b8deafda9884f5006832',
//   [arbitrumGoerli.id]: '0x12144be562a3b86801d3524a60f8bfdec4010ff9',
// };

export const ADDONS_CONTROLLER_ADDRESS : Record<number, Address> = {
  [arbitrum.id]: '0x6a502fee591d57ec2d2567fd04657ba10a0590bd',
  [arbitrumGoerli.id]: '0x1315b3955b2636a864679a4079fcaf324d1d9c4b',
};

export const COUNCIL_PASS_ADDRESS: Record<number, Address> = {
  [arbitrum.id]: '0x95f24518ba299f8096b36a4868ee599b65f927bc',
  [arbitrumGoerli.id]: '0xe858b5d5DcE0bd69a4Ba38C34d307aCa40FB0626',
}

export const ANIMALS: Record<number, Address> = {
  [arbitrum.id]: '0x0dd35869e1c11767aa044da506e4d31459a9d028',
  [arbitrumGoerli.id]: '0x77af3636f97370483BFa127d37C6A8Ce2F3a16b7',
  [polygonMumbai.id]: '0x302B7Ff0617Ab81BC50F1b7aaB52a8A931a5CEeb',
  [polygon.id]: '0x7AE028EeDbaF3fEC0bcbdd82f19e99ec2a23C364',
};

export const SMOL_AGE_STAKING: Record<number, Address> = {
  [arbitrum.id]: '0xd2ff4c438993bd5201a59b44dc11a8d452959a81',
  [arbitrumGoerli.id]: '0x3D3b2eBf946bD0F39f8Cdc0801A1D3D9014821fC',
};

export const SMOL_AGE_BONES: Record<number, Address> = {
  [arbitrum.id]: '0x7e5eede8305f7ffff0fff609fa9462ab41f364f4',
  [arbitrumGoerli.id]: '0x7e5eede8305f7ffff0fff609fa9462ab41f364f4',
  [polygonMumbai.id]: '0xc886bddBc732E9474833007eA838a73046a5084f',
  [polygon.id]: '0x681382830e013eE4A086B55C712253214889F89f',
};
// export const SMOL_AGE_BONES: Record<number, Address> = {
//   [arbitrum.id]: '0x74912f00bda1c2030cf33e7194803259426e64a4',
//   [arbitrumGoerli.id]: '0x7D1d0B0C445bA80b569FcC60128D4F9ee61Eb2f5',
// };

export const SMOL_AGE_TREASURE: Record<number, Address> = {
  [arbitrum.id]: '0xc5295C6a183F29b7c962dF076819D44E0076860E',
  [arbitrumGoerli.id]: '0x177aB4547Cf636a9206d41aD44026A14C90c0F11',
};

export const SMOL_AGE_BONES_STAKING: Record<number, Address> = {
  [arbitrum.id]: '0x88dc64651d2152b4e3ad36c05c95be923d7cc9a6',
  [arbitrumGoerli.id]: '0xfF092132F0FaE5898F9658cb06835A6E1d1D1Bdb',
};

export const SMOL_AGE_SMOL: Record<number, Address> = {
  [arbitrum.id]: '0x9E64D3b9e8eC387a9a58CED80b71Ed815f8D82B5',
  [arbitrumGoerli.id]: '0x177aB4547Cf636a9206d41aD44026A14C90c0F11',
};

export const THE_PITS: Record<number, Address> = {
  [arbitrum.id]: '0xC761FCb27A2ED10e8FE07dc2F585E9CAeBf91d0C',
  [arbitrumGoerli.id]: '0x325a8a63a0D039cdF76a541B494ca295d67F46b6',
};

export const SHOP: Record<number, Address> = {
  [arbitrum.id]: '0x390E3496B494Ebbfe8c7e37387f9b6B82d007153',
  [arbitrumGoerli.id]: '0xe4a82Cb3D5bEEFf2299D406b6C3059f2d876A562',
}

export const CAVES: Record<number, Address> = {
  [arbitrum.id]: '0x48Bcf04AeAEd9fF1AE3452E5806BADa19E7B3E83',
  [arbitrumGoerli.id]: '0x52ccfD3096691Cb5225872Bcb63E18bCE413f7C4',
};

export const CONSUMABLES: Record<number, Address> = {
  [arbitrum.id]: '0xbD725e919eCf207E78D44A413289a724e467d808',
  [arbitrumGoerli.id]: '0x3119DB6D3e31f976d3AA0eded07022921c3d3DBc',
  [polygonMumbai.id]: '0x4AdA7b8f21CF6eEb291A722124fcdE4f3bbF2673',
  [polygon.id]: '0x4AdA7b8f21CF6eEb291A722124fcdE4f3bbF2673',
}

export const DEVELOPMENT_GROUNDS: Record<number, Address> = {
  [arbitrum.id]: '0xbE342A5836E820d0a3f0AcbF28D8e7822328A7d8',
  [arbitrumGoerli.id]: '0x7D5512770E83dBB997C7388fF1ca723FFa104647',
}

export const LABOR_GROUNDS: Record<number, Address> = {
  [arbitrum.id]: '0x7A4B086D6Df2993970Ae3138B7a1f33F1E75fa52',
  [arbitrumGoerli.id]: '0xA8e9CF021b6F6F27d9D7405352d0957A6c2d665B',
}

export const NFT_MARKET_PLACE: Record<number, Address> = {
  [arbitrum.id]: '0x9225A88245D29c44432bEe2a394a306091a3A54e',
  [arbitrumGoerli.id]: '0x9225A88245D29c44432bEe2a394a306091a3A54e',
  [polygonMumbai.id]: '0xF89600eD9884239374dB032Be904F5d6A9fBb58b',
  [polygon.id]: '0xb45FE0cbCc8Bc8FdB2718cC7B368553Ad7D7bdA1',
};
// export const NFT_MARKET_PLACE: Record<number, Address> = {
//   [arbitrum.id]: '0xbA123D5AA37b9D2fd428fb77348c4700672e79c5',
//   [arbitrumGoerli.id]: '0xbA123D5AA37b9D2fd428fb77348c4700672e79c5',
// };

export const THE_GRAPH_API_URL: Record<number, string> = {
  [arbitrum.id]: 'https://api.thegraph.com/subgraphs/name/magiclars-off/neandersmol-arb',
  [arbitrumGoerli.id]: 'https://api.thegraph.com/subgraphs/name/rafinskipg/test-neandersmol',
  [polygonMumbai.id]: 'https://api.thegraph.com/subgraphs/name/rafinskipg/test-neandersmol',
  [polygon.id]: 'https://api.thegraph.com/subgraphs/name/rafinskipg/test-neandersmol',
};

export const SUBGRAPH_OF_MARKETPLACE: Record<number, string> = {
  [arbitrum.id]: 'https://api.thegraph.com/subgraphs/name/millicare/smolagemarketplace',
  [arbitrumGoerli.id]: 'https://api.thegraph.com/subgraphs/name/millicare/smolagemarketplace',
  [polygonMumbai.id]: 'https://api.thegraph.com/subgraphs/name/millicare/smolagemarketplace',
  [polygon.id]: 'https://api.thegraph.com/subgraphs/name/devdiamondassassin/realmarketplace',
};