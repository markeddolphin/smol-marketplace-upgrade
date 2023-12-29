import Link from 'next/link';

export const Roadmap = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <h2 id="roadmap" className="mx-auto mb-16 scroll-mt-20 text-4xl text-smolBrown md:text-6xl">
        ROAD MAP
      </h2>
      <div className="mx-auto grid max-w-xs grid-flow-col grid-rows-3 gap-4 text-smolBrown md:max-w-xl md:grid-rows-1">
        <Link
          href="/static/roadmaps/Smol_Age_Whitepaper_PT_1.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 bg-[url('/static/images/roadmap-button.png')] bg-cover bg-center px-24 py-8 md:px-8"
        >
          Part 1
        </Link>
        <Link
          href="/static/roadmaps/Smol_Age_Whitepaper_PT_2.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 bg-[url('/static/images/roadmap-button.png')] bg-cover bg-center px-24 py-8 md:px-8"
        >
          Part 2
        </Link>
        <Link
          href="/static/roadmaps/Smol_Age_Whitepaper_PT_3.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 bg-[url('/static/images/roadmap-button.png')] bg-cover bg-center px-24 py-8 md:px-8"
        >
          Part 3
        </Link>
      </div>
    </div>
  );
};
