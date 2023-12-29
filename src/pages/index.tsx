import { Collections } from '@components/Collections';
import { Divider } from '@components/Divider';
import { Faq } from '@components/Faq';
import { LandingNav } from '@components/LandingNav';
import Layout from '@components/Layout';
import { PhaseSelector } from '@components/PhaseSelector';
import { Roadmap } from '@components/Roadmap';
import { TeamSection } from '@components/TeamSection';
import { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import useSound from 'use-sound';

const Landing: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [first, setIsFirst] = useState(true);
  const [play, { stop }] = useSound('/static/sounds/landingPageMusicUpdated.wav');

  function playSong() {
    setIsPlaying(true);
    play();
  }

  function stopSong() {
    setIsPlaying(false);
    stop();
  }

  return (
    <Layout>
      <LandingNav />

      <div
        onMouseDown={() => {
          if (first && !isPlaying) {
            setIsFirst(false);
            playSong();
          }
        }}
        className="w-full bg-[url('/static/images/bg_sand.webp')] bg-cover bg-center"
      >
        <div className="fixed bottom-0 right-0 h-16 w-16">
          {isPlaying ? (
            <Image
              onClick={() => stopSong()}
              height={64}
              width={64}
              src="/static/images/playButton.webp"
              alt="Play Button"
              className="cursor-pointer"
            />
          ) : (
            <Image
              onClick={() => playSong()}
              height={64}
              width={64}
              src="/static/images/soundDisabled.webp"
              alt="Sound Disabled"
              className="cursor-pointer"
            />
          )}
        </div>
        <div className="mask-bottom relative mb-24 max-md:p-4 max-md:pt-8 min-h-[calc(100vh_-_120px)] bg-landing-page-mobile bg-cover bg-center md:bg-landing-page">
          <PhaseSelector className="md:absolute md:top-1/2 md:left-1/2 md:w-[650px] md:-translate-x-1/2 md:-translate-y-1/2" />
        </div>
        <div className="text-center">
          <h1
            id="about"
            className="mb-12 scroll-mt-20 px-4 text-2xl text-smolBrown md:mb-24 md:text-6xl"
          >
            The Neandersmols
          </h1>
          <div>
            <div className="relative mx-2 mb-16 aspect-[240/300] max-w-2xl overflow-hidden bg-rockboard bg-cover sm:mx-auto">
              <p className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-14 font-mono text-[.6rem] text-white xs:text-xs sm:text-lg md:p-16">
                Smol Age will tell the story of how the modern day Smolverse came to be. Our goal is
                to tell the full story of how the Smolverse developed over time. From multiple
                perspectives throughout multiple periods of time. <br></br>
                <br></br> The first generation in Smol Age will be called Neandersmols and they will
                live in the Prehistoric Smolverse.
                <br></br>
                <br></br>
                Neandersmols will develop, become productive members of civilization and finally
                retire before passing their skill sets and assets down to the next generation in
                Smol Age.
                <br></br>
                <br></br>
                <span className="text-md md:text-2xl">Oogaooooooooooo!</span>
              </p>
            </div>
          </div>
        </div>
        <Divider />
        <TeamSection className="mb-24 text-center" />
        <Divider />
        <Faq className="text-center text-smolBrown px-4" />

        <Divider />
        <Roadmap className="text-center" />
        <Divider />
        <Collections className="text-center" />
        <div className="mx-auto mt-36 text-center md:invisible">
          <Image
            src="/static/images/logo.webp"
            alt="Smol Age Logo"
            height={96}
            width={96}
            className="mx-auto"
          />
          <p className="pt-4">Smol Age</p>
        </div>
        <div className="invisible mx-auto text-center md:visible">
          <img src="/static/images/boneCliffFooter.webp" alt="Bone Cliff" className="mx-auto" />
        </div>
      </div>
    </Layout>
  );
};
export default Landing;
