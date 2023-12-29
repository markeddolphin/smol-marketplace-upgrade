import { LoadingButton } from '@components/LoadingButton';
import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface NumberInputProps {
  min?: number;
  max?: number;
  step?: number;
  loading: boolean;
  onClick: (value: number) => Promise<boolean>;
}

export const NumberInput: React.FC<NumberInputProps> = ({ min, max, step, loading, onClick }) => {
  const [numBones, setNumBones] = useState<number>(0);

  return (
    <div className="relative bg-smolBrown">
        <div className="flex h-8 w-full border-[4px] border-smolBrownLight bg-transparent focus:outline-none">
          <button
            disabled={numBones <= min}
            onClick={() => setNumBones((prev) => prev - step)}
            className="h-full w-8 text-smolBrownLight outline-none"
          >
            <FaMinus className="m-auto" />
          </button>
          <input
            type="number"
            className="bg-transparent px-0 border-x-[4px] border-smolBrownLight text-center text-xs font-semibold focus:ring-0 focus:border-smolBrownAlternative"
            name="custom-input-number"
            min={min}
            max={max}
            step={step}
            readOnly={true}
            value={numBones}
          ></input>
          <button
            disabled={max && numBones >= max}
            onClick={() => setNumBones((prev) => prev + step)}
            className="h-full w-8 text-smolBrownLight"
          >
            <FaPlus className="m-auto" />
          </button>
      </div>
      <LoadingButton
        loading={loading}
        disabled={+numBones <= 0}
        text="Stake"
        onClick={() => onClick(numBones).then(() => setNumBones(0))}
        className="w-full border-[4px] border-smolBrownLight bg-transparent text-xs uppercase px-1.5 py-1 sm:px-2 -mt-1"
        spinnerClassName='mx-auto'
      />
    </div>
  );
};
