import { LoadingButton } from '@components/LoadingButton';
import { useState } from 'react';

interface StakeInputProps {
  loading: boolean;
  maxValue: string;
  onClick: (value: string) => Promise<boolean>;
}

export const StakeInput: React.FC<StakeInputProps> = ({ loading, maxValue, onClick }) => {
  const [numStake, setNumStake] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div className="ml-1 flex h-full items-center gap-1">
      <div className="relative">
        <input
          type="number"
          name="amount"
          id="amount"
          min={0}
          value={numStake}
          onChange={(e) => {
            setNumStake(e.target.value ?? '');
          }}
          className="block py-2 pl-2 text-[0.6rem] tracking-tighter text-black outline-none focus:border-smolBrownLight focus:ring-smolBrownLight"
          placeholder="AMOUNT TO STAKE"
          aria-describedby="bone-amount"
        />
        <button
          onClick={() => setNumStake(maxValue)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[0.6rem] text-smolBrownLight"
        >
          MAX
        </button>
      </div>
      <LoadingButton
        loading={loading && clicked}
        disabled={+numStake <= 0}
        text="Stake"
        onClick={() => {
          setClicked(true);
          onClick(numStake)
            .then(() => setNumStake(''))
            .finally(() => setClicked(false));
        }}
        spinnerClassName='w-3 h-3'
        className="btn border-[4px] bg-smolBrown text-[0.55rem]"
      />
    </div>
  );
};
