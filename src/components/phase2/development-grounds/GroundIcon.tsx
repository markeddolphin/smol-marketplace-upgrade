import { Ground } from '@model/model';
import Image from 'next/image';

interface GroundProps {
  ground: Ground;
  size: number;
  className?: string;
}

export const GroundIcon: React.FC<GroundProps> = ({ ground, size, className }) => {
  if (ground === Ground.Mystic) {
    return (
      <Image
        src="/static/images/mystic.png"
        height={size}
        width={size}
        alt="mystic"
        className={className}
      />
    );
  }
  if (ground === Ground.Warrior) {
    return (
      <Image
        src="/static/images/fighter.png"
        height={size}
        width={size}
        alt="figher"
        className={className}
      />
    );
  }

  if (ground === Ground.Farmer) {
    return (
      <Image
        src="/static/images/farmer.png"
        height={size}
        width={size}
        alt="farmer"
        className={className}
      />
    );
  }
};
