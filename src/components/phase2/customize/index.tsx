import { Phase2Context } from '@context/phase2Context';
import { NFTObject } from '@model/model';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';

import { useContext, useEffect, useMemo, useState } from 'react';
import { getNeandersmolPrimarySkills } from '@api/getNeandersmolPrimarySkills';
import { useNetwork, useProvider } from 'wagmi';
import { ARBITRUM } from '@config';
import { formatUnits, parseEther } from 'ethers/lib/utils.js';
import { getNeandersmolEnabledAddons } from '@api/getNeandersmolAddons';
import { useCustomizeSmol } from '@hooks/useCustomizeSmol';
import { Addon } from './addon';
import { ALL_ADDONS, AddonType, TRAIT } from './addons_constants';

export const CustomizeComponent = () => {
  const { nfts } = useContext(Phase2Context);
  const [selected, setSelected] = useState<NFTObject | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 pt-[140px] max-md:relative sm:px-8">
      <div className="relative w-full bg-black/40 p-4 pb-4 sm:p-6">
        <Link href="/phase2">
          <Image
            src="/static/images/back.png"
            height={200}
            width={200}
            alt="Back Button"
            className="absolute left-[-20px] top-1/2 w-[60px] -translate-y-1/2"
          />
        </Link>

        <h1>Customize my neandersmols</h1>
        {nfts.length === 0 && (
          <div className="m-5 text-center text-xs uppercase">We couldn't find any neandersmols</div>
        )}
        <div className="grid max-h-[45vh] grid-cols-2 gap-2 overflow-y-scroll xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
          {nfts.map((nft: NFTObject) => {
            const isSelected = selected && selected.id === nft.id;
            return (
              <button
                key={nft.id.toString()}
                className={`${
                  isSelected ? 'border-smolBrownLight' : 'border-black'
                } btn mx-auto mt-4`}
                onClick={() => {
                  if (isSelected) {
                    setSelected(null);
                  } else {
                    setSelected(nft);
                  }
                }}
              >
                <>
                  <Image
                    src={nft.image}
                    alt={`smol #${nft.id.toString()}`}
                    width={110}
                    height={110}
                  />
                  <div className="pt-2 text-center text-xs uppercase">#{nft.id}</div>
                </>
              </button>
            );
          })}
        </div>

        <div>
          {selected && (
            <div>
              <CustomizeSmol smol={selected} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

enum Skill {
  Mystics,
  Farmers,
  Fighters,
}

function CustomizeSmol({ smol }: { smol: NFTObject }) {
  const provider = useProvider();
  const { chain } = useNetwork();
  const chainId = !chain || chain?.unsupported ? ARBITRUM : chain?.id;
  const [skillInfo, setSkillInfo] = useState({
    farmer: BigNumber.from(0),
    mystic: BigNumber.from(0),
    fighter: BigNumber.from(0),
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const neandersmolData = require(`@utils/metadata/${Number(smol.id)}/${Number(smol.id)}.json`);
  const isGold =
    neandersmolData.attributes
      .find((i) => i.trait_type === 'Neandersmol')
      ?.value.toLowerCase()
      .includes('gold') || false;
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // List of addons that we can enable for this smol
  const [allowedAddons, setAllowedAddons] = useState<AddonType[]>([]);

  // Holds the mapping of the skills selected
  const [selectedAddons, setSelectedAddons] = useState({
    hat: '',
    hand: '',
    mask: '',
    special: '',
  });

  const { execute, isLoading: isLoadingCustomize } = useCustomizeSmol(
    chainId,
    smol.id as unknown as number,
    selectedAddons,
  );

  const allAddons = ALL_ADDONS('', '');

  useEffect(() => {
    const getSkills = async () => {
      try {
        setLoading(true);
        setError(false);

        const skills = await getNeandersmolPrimarySkills(chainId, smol.id as any, provider);
        const addons = await getNeandersmolEnabledAddons(chainId, smol.id as any, provider);
        // Update the current addons
        setSelectedAddons(addons);

        // Update the current skill
        setSkillInfo(skills);

        // Update the list of allowed addons to display in the UI

        const newAddons = allAddons.filter((i) => {
          // filter by gold
          if (i.skin === 'gold' && !isGold) {
            return false;
          }

          if (i.skin === 'white' && isGold) {
            return false;
          }

          return true;

          // if (
          //   i.skill === Skill.Mystics &&
          //   skills.mystic.gte(parseEther(i.skill_level.toString()))
          // ) {
          //   return true;
          // }
          // if (
          //   i.skill === Skill.Farmers &&
          //   skills.farmer.gte(parseEther(i.skill_level.toString()))
          // ) {
          //   return true;
          // }
          // if (
          //   i.skill === Skill.Fighters &&
          //   skills.fighter.gte(parseEther(i.skill_level.toString()))
          // ) {
          //   return true;
          // }

          // // Filter by common sense
          // if (i.cs_level > 0 && i.cs_level <= smol.commonSense) {
          //   return true;
          // }

          return false;
        });

        setAllowedAddons(newAddons);

        // Set loading flag
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    };

    getSkills();
  }, [smol, chainId, provider]);

  const hatAddons = useMemo(() => {
    return allowedAddons.filter((i) => i.trait === TRAIT.hat);
  }, [allowedAddons]);

  const handAddons = useMemo(() => {
    return allowedAddons.filter((i) => i.trait === TRAIT.hand);
  }, [allowedAddons]);

  const maskAddons = useMemo(() => {
    return allowedAddons.filter((i) => i.trait === TRAIT.mask);
  }, [allowedAddons]);

  const specialAddons = useMemo(() => {
    return allowedAddons.filter((i) => i.trait === TRAIT.special);
  }, [allowedAddons]);

  const addonsString = useMemo(() => {
    return Object.values(selectedAddons)
      .filter((i) => i !== '')
      .join(',');
  }, [selectedAddons]);

  const selectItem = (value: string, item: string) => {
    if (selectedAddons[item] === value) {
      setSelectedAddons({
        ...selectedAddons,
        [item]: '',
      });
      return;
    }

    setSelectedAddons({
      ...selectedAddons,
      [item]: value,
    });
  };

  const tabs = ['Hats', 'Hand', 'Mask', 'Special'];
  const [activeTab, setActiveTab] = useState('Hats');

  return (
    <div className="mt-4">
      <p>Smol #{smol.id.toString()}</p>
      <p>Common Sense: {smol.commonSense}</p>
      <p>Farmer level: {formatUnits(skillInfo.farmer)}</p>
      <p>Mystic level: {formatUnits(skillInfo.mystic)}</p>
      <p>Fighter level: {formatUnits(skillInfo.fighter)}</p>

      <div className="editor mt-4 flex">
        <div className="relative flex  w-4/12 flex-col items-center pr-4">
          <img
            src={`https://dynamic-image-generation.vercel.app/api?id=${smol.id}${
              addonsString ? `&addons=${addonsString}` : ''
            }&empty=true`}
            alt={`smol #${smol.id.toString()}`}
            className=""
          />

          <div className="editor__buttons mt-4">
            <button
              className="btn btn--primary"
              onClick={() => {
                if (!isLoadingCustomize) {
                  execute();
                }
              }}
            >
              {isLoadingCustomize ? 'Saving...' : 'Save customization'}
            </button>
          </div>
        </div>
        {loading && (
          <div className="editor__addons">
            <p>Loading...</p>
          </div>
        )}
        {error && (
          <div className="editor__addons">
            <p>Error loading customizer</p>
          </div>
        )}
        {!loading && !error && (
          <div className="editor__addons w-8/12 bg-gray-800 p-4">
            <div className="flex flex-row justify-between">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`btn btn--primary ${activeTab === tab ? 'bg-smolBrownLight' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content mt-4">
              {activeTab === 'Hats' && (
                <div className="editor__addons__hat mb-4">
                  <div className="flex flex-wrap">
                    {hatAddons.length === 0 && (
                      <div className="text-center text-xs uppercase">No hat addons available</div>
                    )}
                    {hatAddons.map((i) => (
                      <Addon
                        key={i.id}
                        addon={i}
                        smolId={smol.id as unknown as BigNumber}
                        skills={skillInfo}
                        csLevel={smol.commonSense}
                        selected={selectedAddons.hat === i.id}
                        onSelected={() => selectItem(i.id, 'hat')}
                        chainId={chainId}
                      />
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'Hand' && (
                <div className="editor__addons__hand">
                  <div className="flex flex-wrap">
                    {handAddons.length === 0 && (
                      <div className="text-center text-xs uppercase">No hand addons available</div>
                    )}
                    {handAddons.map((i) => (
                      <Addon
                        key={i.id}
                        addon={i}
                        smolId={smol.id as unknown as BigNumber}
                        skills={skillInfo}
                        csLevel={smol.commonSense}
                        selected={selectedAddons.hand === i.id}
                        onSelected={() => selectItem(i.id, 'hand')}
                        chainId={chainId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Mask' && (
                <div className="editor__addons__hand">
                  <div className="flex flex-wrap">
                    {maskAddons.length === 0 && (
                      <div className="text-center text-xs uppercase">No mask addons available</div>
                    )}
                    {maskAddons.map((i) => (
                      <Addon
                        key={i.id}
                        addon={i}
                        smolId={smol.id as unknown as BigNumber}
                        skills={skillInfo}
                        csLevel={smol.commonSense}
                        selected={selectedAddons.mask === i.id}
                        onSelected={() => selectItem(i.id, 'mask')}
                        chainId={chainId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Special' && (
                <div className="editor__addons__hand">
                  <div className="flex flex-wrap">
                    {specialAddons.length === 0 && (
                      <div className="text-center text-xs uppercase">
                        No special addons available
                      </div>
                    )}
                    {specialAddons.map((i) => (
                      <Addon
                        key={i.id}
                        addon={i}
                        smolId={smol.id as unknown as BigNumber}
                        skills={skillInfo}
                        csLevel={smol.commonSense}
                        selected={selectedAddons.special === i.id}
                        onSelected={() => selectItem(i.id, 'special')}
                        chainId={chainId}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
