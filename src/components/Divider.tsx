import Image from 'next/image';

export const Divider = () => (
  <Image
    src="/static/images/divider.webp"
    width={2100}
    height={420}
    alt="divider"
    className="mb-12 w-full"
    draggable={false}
  />
);
