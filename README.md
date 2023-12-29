# Smol Age Frontend

The smol age application frontend. Preview lnk: smol-age-website-delta.vercel.app

## Getting started

- Clone the project
```
git clone https://github.com/Smol-Obits-Team/Smol-Age-Website.git
```
- Go to the root directory:
```
cd Smol-Age-Website && cd frontend
```
- Install the dependencies:
```
npm install
```
- Start the localhost:
```
npm run dev
```
- The website will be running locally at: http://localhost:3000



## Adding new contracts to the typechain definitions

- Add the new abi under `src/abis` with the name of the contract.
- Run `npm run typechain` to generate the new typechain definitions.

## Adding new addons to the customizer:

We need to follow 4 steps to add new images to the customizer:

- 1) Images need to be added into the addons folder with the right name
`/public/static/images/addons`
- 2) Images need to be added to the Dynamic traits API with the same name. `https://github.com/Smol-Obits-Team/dynamic-image-generation/tree/master/api/images/addons`
- 3) In the addons controller contract we need to add the new allowed addons, this is easier done through the scripts on the NeandersmolsV2 contract. https://github.com/Smol-Obits-Team/NeandersmolV2/blob/addons/scripts/setAllowedAddons.js
- 4) In the Addons component we need to define the allowed addons  (src/components/phase2/customizer/index.tsx)

```
const ALL_ADDONS: {
  value: string;
  name: string;
  type: 'hat' | 'hand' | 'mask' | 'special';
  skill: Skill;
}[] = [
  {
    value: 'farmerhat',
    name: 'Farmer Hat',
    type: 'hat',
    skill: Skill.Farmers,
  },
  {
    value: 'stick',
    name: 'Stick',
    type: 'hand',
    skill: Skill.Farmers,
  },
  {
    value: 'wizardhat',
    name: 'Wizard Hat',
    type: 'hat',
    skill: Skill.Mystics,
  },
  {
    value: 'elderscepter',
    name: 'Elder Scepter',
    type: 'hand',
    skill: Skill.Mystics,
  },
  {
    value: 'fighterhat',
    name: 'Fighter Hat',
    type: 'hat',
    skill: Skill.Fighters,
  },
];
```