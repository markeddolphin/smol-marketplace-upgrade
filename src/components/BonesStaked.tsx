interface GroundsStateProps {
  percentage?: string;
  open: boolean;
}

export const GroundsState: React.FC<GroundsStateProps> = ({ percentage, open }) => (
  <h3 className="pt-[120px] text-center uppercase text-black sm:pt-[150px]">
    <span className={open ? 'text-green-600/90' : 'text-red-700/90'}>
      {percentage ?? 0}%
    </span>{' '}
    $BONES staked - Grounds {open ? 'open' : 'closed'}
  </h3>
);

