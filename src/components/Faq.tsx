import { Disclosure } from '@headlessui/react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const faqs = [
  {
    id: 1,
    question: 'Q: What is Smol Age?',
    answer:
      'Smol Age is the story of how the Smolverse developed. The first collection in Smol Age will be 5,678 Neandersmols. Future collections will continue to tell the story of how Smols Brains evolved from multiple perspectives through multiple periods of time.',
  },
  {
    id: 2,
    question: 'Q: Is Smol Age a game?',
    answer:
      'In a traditional sense, no. In an NFT sense, yes. There will be game theory and decision making involved.But this project was not created for financial gainz.',
  },
  {
    id: 3,
    question: 'Q: Wen mint?',
    answer: 'We minted out! Buy a Neandersmol on Trove',
  },
];

export const Faq = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div className="mx-auto max-w-3xl px-6 max-sm:py-24 sm:pb-32 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 id="faq" className="mb-24 scroll-mt-20 text-6xl md:text-6xl">
            FAQ
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.id} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-smolBrown">
                        <span className="text-lg font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <FaMinus className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <FaPlus className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-3 pr-12">
                      <p className="text-left leading-6 text-smolBrown">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
