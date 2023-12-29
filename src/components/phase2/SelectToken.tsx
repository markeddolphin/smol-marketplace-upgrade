import { Listbox, Transition } from '@headlessui/react';
import { cn } from '@utils';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { Address } from 'wagmi';

export enum TokenStandard {
  ERC20,
  ERC721,
  ERC1155,
}
export type Token = { name: string; id: number; address: Address; type: TokenStandard, pricePerTool: number };

export const SelectToken = ({
  updateToken,
  tokens,
}: {
  updateToken: Dispatch<SetStateAction<Token>>;
  tokens: Token[];
}) => {
  const [selected, setSelected] = useState<Token>();

  const handleChange = (selected: Token) => {
    setSelected(selected);
    updateToken(selected);
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative w-60">
        <span className="text-sm">Pay With</span>
        <Listbox.Button className="relative mt-2 w-full bg-gray-300 py-2 pl-3 pr-10 text-left text-sm rounded-lg">
          <span className="block truncate text-black">{selected?.name ?? 'Select Token'}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <FaChevronDown className="h-5 w-5 text-black" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-gray-200 py-1 text-xs rounded-lg">
            {tokens.map((token, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-1.5 pl-6 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={token}
              >
                {({ selected }) => (
                  <span
                    className={cn(
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate',
                    )}
                  >
                    {token.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
