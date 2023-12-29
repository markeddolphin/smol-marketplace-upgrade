import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  name: string;
  imageUrl: string;
  twitter: string;
  role: string;
}

const team: TeamMember[] = [
  {
    name: 'Dolor Vi',
    imageUrl: '/static/images/team/dolorvi.png',
    twitter: 'https://twitter.com/1dolorvi',
    role: 'Founder/ Artist',
  },
  {
    name: 'Dale Denton',
    imageUrl: '/static/images/team/dale.png',
    twitter: 'https://twitter.com/0xDaleDenton',
    role: 'Product Lead',
  },
  {
    name: 'Maaz',
    imageUrl: '/static/images/team/maaz.png',
    twitter: 'https://twitter.com/0xMaaz',
    role: 'Solidity Developer',
  },
  {
    name: 'Wh',
    imageUrl: '/static/images/team/wh.png',
    twitter: 'https://twitter.com/0xAdemola',
    role: 'Solidity Developer',
  },
  {
    name: 'Snuf',
    imageUrl: '/static/images/team/snuf.png',
    twitter: 'https://twitter.com/0xSnuf',
    role: 'Frond-end Developer',
  },
  {
    name: 'Berchtold',
    imageUrl: '/static/images/team/berchtold.png',
    twitter: 'https://twitter.com/DanielBerchtold',
    role: 'Graphic Designer',
  },
];

export const TeamSection = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <h2 id="team" className="mb-12 scroll-mt-20 text-2xl text-smolBrown md:mb-24 md:text-6xl">
        Our Team
      </h2>
      <ul
        role="list"
        className="mx-auto mt-20 grid max-w-xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-3 sm:gap-20"
      >
        {team.map((teamMember: TeamMember) => (
          <li key={teamMember.name}>
            <Link href={teamMember.twitter} target="_blank" rel="noopener noreferrer">
              <Image
                width={96}
                height={96}
                className="mx-auto rounded-full"
                src={teamMember.imageUrl}
                alt={teamMember.name}
              />
              <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                {teamMember.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{teamMember.role}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
