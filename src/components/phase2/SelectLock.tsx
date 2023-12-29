import { Listbox, Transition } from '@headlessui/react';
import { cn } from '@utils';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { FaChevronDown } from 'react-icons/fa';


const locks = [{ period: 50  }, { period: 100 }, { period: 150 }];

export const SelectLock = ({
  selected,
  updateLock,
}: {
  selected: number;
  updateLock: Dispatch<SetStateAction<number>>;
}) => (
  <Listbox value={selected} onChange={(value) => updateLock(value)}>
    <div className="relative w-60">
      <Listbox.Button className="relative w-full bg-gray-300 py-2 pl-3 pr-10 text-left text-sm">
        <span className="block truncate text-black">
          {selected ? `${selected} days` : 'Stake Period'}
        </span>
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
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-gray-200 py-1 text-xs">
          {locks.map((lock) => (
            <Listbox.Option
              key={lock.period}
              className={({ active }) =>
                `relative cursor-default select-none py-1.5 pl-6 ${
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                }`
              }
              value={lock.period}
            >
              {({ selected }) => (
                <span
                  className={cn(selected ? 'font-medium' : 'font-normal', 'block truncate')}
                >
                  {lock.period} days
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
);
