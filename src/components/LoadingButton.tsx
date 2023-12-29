import { Spinner } from '@components/Spinner';
import { cn } from '@utils';

interface LoadingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading: boolean;
  text: string;
  className?: string;
  spinnerClassName?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  disabled,
  loading,
  text,
  className,
  spinnerClassName,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(disabled ? 'bg-gray-300' : 'bg-greenish hover:bg-greenish/80', className)}
  >
    {loading ? <Spinner className={spinnerClassName} /> : text}
  </button>
);
