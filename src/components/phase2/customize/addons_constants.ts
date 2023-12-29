import { ethers } from "ethers";

const SKILLS = {
    mystic: 0,
    farmer: 1,
    fighter: 2,
  };
  
  export const TRAIT = {
    hat: 0,
    hand: 1,
    mask: 2,
    special: 3,
  };

  export type AddonType = {
    id: string;
    name: string;
    hasMax: boolean;
    skin: "any" | "gold" | "white";
    max: number;
    cs_level: number;
    skill_level: number;
    requiresPass: boolean;
    skill: number;
    trait: number;
    price: {
      tokenA: string;
      amountA: ethers.BigNumber;
      tokenB: string;
      amountB: ethers.BigNumber;
    }
  }
  
  export const ALL_ADDONS = (magicAddress: string, bonesAddress: string): AddonType[] => {
    return [{
      id: 'foundfire',
      name: 'Found Fire',
      hasMax: true,
      skin: "white",
      max: 100,
      cs_level: 100,
      skill_level: 0,
      requiresPass: false, 
      skill: SKILLS.mystic,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }, {
      id: 'foundfiregold',
      name: 'Found Fire Gold',
      hasMax: true,
      skin: "gold",
      max: 100,
      cs_level: 100,
      skill_level: 0,
      requiresPass: false, 
      skill: SKILLS.mystic,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }, {
      id: 'wizardhat',
      name: 'Wizard Hat',
      hasMax: true,
      skin: "any",
      max: 100,
      cs_level: 0,
      skill_level: 100,
      requiresPass: false, 
      skill: SKILLS.mystic,
      trait: TRAIT.hat,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("10"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("5000")
      }
    }, {
      id: 'elderscepter',
      name: 'Elder Scepter',
      hasMax: true,
      skin: "white",
      max: 100,
      cs_level: 0,
      skill_level: 0,
      requiresPass: true, 
      skill: SKILLS.mystic,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("10"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("5000")
      }
    }, {
      id: 'eldersceptergold',
      name: 'Elder Scepter Gold',
      hasMax: true,
      skin: "gold",
      max: 100,
      cs_level: 0,
      skill_level: 0,
      requiresPass: true, 
      skill: SKILLS.mystic,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("10"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("5000")
      }
    }, {
      id: 'magicball',
      name: 'Magic Ball',
      hasMax: true,
      skin: "white",
      max: 50,
      cs_level: 0,
      skill_level: 250,
      requiresPass: false, 
      skill: SKILLS.mystic,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }, {
      id: 'magicballgold',
      name: 'Magic Ball Gold',
      hasMax: true,
      skin: "gold",
      max: 50,
      cs_level: 0,
      skill_level: 250,
      requiresPass: false, 
      skill: SKILLS.mystic,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }, {
      id: 'strawhat',
      name: 'Straw Hat',
      hasMax: true,
      skin: "any",
      max: 100,
      cs_level: 0,
      skill_level: 100,
      requiresPass: false, 
      skill: SKILLS.farmer,
      trait: TRAIT.hat,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("10"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("5000")
      }
    }, {
      id: 'spear',
      name: 'Spear',
      hasMax: true,
      skin: "white",
      max: 50,
      cs_level: 0,
      skill_level: 250,
      requiresPass: false, 
      skill: SKILLS.fighter,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }, {
      id: 'speargold',
      name: 'Spear (gold)',
      skin: "gold",
      hasMax: true,
      max: 50,
      cs_level: 0,
      skill_level: 250,
      requiresPass: false, 
      skill: SKILLS.fighter,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }, {
      id: 'fighterhelmet',
      name: 'Fighter Helmet',
      hasMax: true,
      skin: "any",
      max: 100,
      cs_level: 0,
      skill_level: 100,
      requiresPass: false, 
      skill: SKILLS.fighter,
      trait: TRAIT.hat,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("10"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("5000")
      }
    }, {
      id: 'pitchfork',
      name: 'Pitchfork',
      hasMax: true,
      skin: "white",
      max: 50,
      cs_level: 0,
      skill_level: 250,
      requiresPass: false, 
      skill: SKILLS.farmer,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }, {
      id: 'pitchforkgold',
      name: 'Pitchfork Gold', 
      hasMax: true,
      skin: "gold",
      max: 50,
      cs_level: 0,
      skill_level: 250,
      requiresPass: false, 
      skill: SKILLS.farmer,
      trait: TRAIT.hand,
      price: {
        tokenA: magicAddress,
        amountA: ethers.utils.parseEther("15"),
        tokenB: bonesAddress,
        amountB: ethers.utils.parseEther("7500")
      }
    }]
    
    
  }