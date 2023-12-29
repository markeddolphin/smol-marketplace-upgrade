import { cn } from '@utils';
import { useState } from 'react';
import { LoadingButton } from './LoadingButton';

interface StakeInputProps {
  className: string;
  inputClassName?: string;
  placeholder: string;
  buttonText: string;
  maxValue: string;
  onClick: (value: string) => Promise<boolean>;
  loading: boolean;
}

export const StakeInput: React.FC<StakeInputProps> = ({
  className,
  inputClassName,
  placeholder,
  buttonText,
  maxValue,
  onClick,
  loading,
}) => {
  const [numStake, setNumStake] = useState<string>('');

  return (
    <div className={className}>
      <div className="flex h-full items-center justify-between gap-2">
        <div className="relative">
          <input
            type="number"
            name="amount"
            id="amount"
            min={0}
            value={numStake}
            onChange={(e) => {
              setNumStake(e.target.value ?? '')
            }}
            className={cn(inputClassName ?? "block w-full py-3 pl-7 pr-12 text-xs",
              "text-black focus:border-smolBrownLight focus:ring-smolBrownLight rounded-xl"
            )}
            placeholder={placeholder}
            aria-describedby="bone-amount"
          />
          <button
            onClick={() => setNumStake(maxValue)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 pt-1/2 text-smolBrownLight text-xs"
          >
            MAX
          </button>
        </div>
        <LoadingButton
          loading={loading}
          disabled={+numStake <= 0}
          text={buttonText}
          onClick={() => onClick(numStake).then(() => setNumStake(''))}
          className="border-4 border-smolBrownLight bg-smolBrown p-2 text-xs uppercase sm:w-[150px] sm:px-8 rounded-xl"
          spinnerClassName='mx-auto'
        />
      </div>
    </div>
  );
};
