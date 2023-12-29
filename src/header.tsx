import Head from 'next/head';

const titleDefault = 'Smol Age';
const url = 'https://smolage.com/';
const description =
  'Smol Age is an innovative gamified NFT collection that allows you to gather $BONES, develop your Common Sense, and unlock new skills on the Arbitrum Layer 2 Network.';
const banner = '/static/images/banner.webp';

const Header = ({ title = titleDefault }) => {
  return (
    <>
      <Head>
        {/* Recommended Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="language" content="english" />
        <meta httpEquiv="content-type" content="text/html" />

        <link rel="shortcut icon" href="/static/images/logo.webp" />
        {/* Search Engine Optimization Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="Smol Age, Arbitrum, Magic, NFT, Gaming, Community, Web3, Blockchain"
        />
        <meta name="robots" content="index,follow" />
        <meta name="distribution" content="web" />
        {/* 
      Facebook Open Graph meta tags
        documentation: https://developers.facebook.com/docs/sharing/opengraph */}
        <meta name="og:title" content={title} />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={url} />
        <meta name="og:image" content={banner} />
        <meta name="og:site_name" content={title} />
        <meta name="og:description" content={description} />

        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        {/* Meta Tags for HTML pages on Mobile */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1.0" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={banner} />
        <meta name="twitter:site" content="@SmolAge_NFT" />
        <meta name="twitter:creator" content="@SmolAge_NFT" />
      </Head>
    </>
  );
};

export default Header;
