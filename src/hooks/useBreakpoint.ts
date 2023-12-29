import { useState, useEffect } from 'react';

export const enum WindowSize {
  XS,
  SM,
  MD,
  LG,
  XL,
}

const useBreakPoint = () => {
  const [breakPoint, setBreakPoint] = useState<WindowSize>(WindowSize.LG);
  const handleResize = () => {
    if (window.innerWidth > 0 && window.innerWidth < 640) {
      setBreakPoint(WindowSize.XS);
    }
    if (window.innerWidth >= 640 && window.innerWidth < 768) {
      setBreakPoint(WindowSize.SM);
    }
    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setBreakPoint(WindowSize.MD);
    }
    if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
      setBreakPoint(WindowSize.LG);
    }
    if (window.innerWidth >= 1280) {
      setBreakPoint(WindowSize.XL);
    }
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return breakPoint;
};

export default useBreakPoint;
