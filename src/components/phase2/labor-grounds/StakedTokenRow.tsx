import { LaborGroundFeInfoStructOutput } from '@typechain/LaborGrounds';
import { cn, generateHash } from '@utils';
import { BigNumber } from 'ethers';
import { toast } from 'react-toastify';

import Timer from '@components/Timer';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Disclosure } from '@headlessui/react';

import { hasAnimal, animals } from './MyStakes';
import { Animal } from '@model/model';

export const StakedTokenRow = ({
  token,
  selectableAnimals,
  isSelected,
  onSelect,
  onElapsed,
  onAnimalChange,
}: {
  token: LaborGroundFeInfoStructOutput;
  selectableAnimals: Animal[];
  isSelected: boolean;
  onSelect: (tokenId: BigNumber) => void;
  onElapsed: (tokenId: BigNumber) => void;
  onAnimalChange: (animal: Animal | null) => void;
}) => {
  const tokenId = token.tokenId.toString();
  const imageHash = generateHash(tokenId + '.png');
  const animal = useMemo(
    () => animals.find((animal) => animal.id.eq(token.animalId)),
    [token.animalId],
  );

  const [animalInQueue, setAnimalInQueue] = useState<Animal | null>(null);
  const [jobCompleted, setJobCompleted] = useState<boolean>(false);

  const addAnimalToQueue = (animal: Animal) => {
    setAnimalInQueue(animal);
    onAnimalChange(animal);
  };

  const removeAnimalFromQueue = () => {
    setAnimalInQueue(null);
    onAnimalChange(null);
  };

  return (
    <Disclosure>
      <>
        <tr
          key={tokenId}
          className={cn(isSelected ? 'bg-smolBrownLight/40' : '', 'cursor-pointer')}
          onClick={() => {
            onSelect(token.tokenId);
          }}
        >
          <th scope="row" className="whitespace-nowrap text-center">
            <input
              type="checkbox"
              checked={isSelected}
              className="h-5 w-5 rounded text-smolBrown focus:ring-0"
            />
          </th>
          <td className="flex flex-col items-center justify-center whitespace-nowrap py-2 text-xs">
            <Image
              src={`https://smolage.com/assets/neandersmols/${imageHash}.png`}
              alt={`smol #${tokenId.toString()}`}
              width={70}
              height={70}
              className="p-1 rounded-lg"
            />
            <div className="pt-2 uppercase">#{tokenId.toString()}</div>
          </td>
          <td className="whitespace-nowrap px-3 py-2 text-center text-sm">
            <div className="flex flex-col items-center text-xs">
              {hasAnimal(token) && animal ? (
                <>
                  <Image
                    src={animal.image}
                    alt={`animal ${animal.name}`}
                    width={70}
                    height={70}
                    className="p-1"
                  />
                  <div className="pt-2 uppercase">{animal.name} </div>
                </>
              ) : animalInQueue ? (
                <>
                  <div className="relative">
                    <Image
                      src={animalInQueue.image}
                      alt={`animal ${animalInQueue.name}`}
                      width={70}
                      height={70}
                      className="p-1"
                    />
                    <div
                      className="absolute -right-0.5 -top-0.5 mx-auto h-[25px] w-[25px] rounded-full border border-smolBrownLight bg-[#8a0303] leading-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAnimalFromQueue();
                      }}
                    >
                      x
                    </div>
                  </div>
                  <div className="pt-2 uppercase">{animalInQueue.name} </div>
                </>
              ) : selectableAnimals.length > 0 ? (
                <Disclosure.Button
                  onClick={(e) => e.stopPropagation()}
                  className="btn h-[50px] w-[50px] rounded-full border-black bg-green-400 p-2 text-sm font-bold text-black"
                >
                  +
                </Disclosure.Button>
              ) : (
                <button
                  className="btn h-[50px] w-[50px] rounded-full border-black bg-green-400 p-2 text-sm font-bold text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.error("Ser, you don't have any animals to put in");
                  }}
                >
                  +
                </button>
              )}
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-center text-sm">
            {jobCompleted ? (
              <span className="font-[13px]">JOB COMPLETED</span>
            ) : (
              <Timer
                seconds={token.timeLeft.toNumber()}
                onElapsed={() => {
                  setJobCompleted(true);
                  onElapsed(token.tokenId);
                }}
              />
            )}
          </td>
        </tr>
        <Disclosure.Panel as="tr" className="border-none">
          <td colSpan={4}>
            <div className="grid grid-cols-3 bg-black bg-opacity-60 p-2 sm:grid-cols-4 md:grid-cols-6">
              {selectableAnimals.map((animal) => {
                return (
                  <Disclosure.Button
                    className="flex flex-col items-center text-xs"
                    onClick={() => {
                      addAnimalToQueue(animal);
                    }}
                  >
                    <Image
                      src={animal.image}
                      alt={`animal ${animal.name}`}
                      width={70}
                      height={70}
                      className="p-1"
                    />
                    <div className="pt-2 uppercase">{animal.name} </div>
                  </Disclosure.Button>
                );
              })}
            </div>
          </td>
        </Disclosure.Panel>
      </>
    </Disclosure>
  );
};
