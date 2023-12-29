import Link from "next/link";
import Image from "next/image";

export const Logo = () => (
    <>
      <span className="sr-only">Smol Age</span>
      <Link href="/">
        <div className="relative h-20 w-20 cursor-pointer md:h-24 md:w-24">
          <Image src="/static/images/logoWhiteLetter.webp" alt="Smol Age Logo" fill />
        </div>
      </Link>
    </>
  );