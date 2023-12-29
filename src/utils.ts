import { createHmac } from "crypto";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const shortAddr = (addr: string): string => {
  return addr.substring(0, 4) + '...' + addr.substring(addr.length - 4);
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const hashKey = 'eVRY8G>XdgfdsXZd+8vrAGApwrQd>adPGM+0*a}Y:*~F0tu';
export const generateHash = (name: string) => {
  return createHmac('sha256', hashKey).update(name).digest('hex');
}


export const toDays = (seconds: number) => {
  if (seconds === 0) return "0 days";
  const daysLeft = Math.round(seconds / 60 / 60 / 24);
  return daysLeft == 0 ? "<1 day" : `${daysLeft} days`
}

export const toHMS = (seconds: number) => {
  function z(n){return (n<10?'0':'') + n;}
  const sign = seconds < 0? '-':'';
  seconds = Math.abs(seconds);
  return sign + z(seconds/3600 |0) + ':' + z((seconds%3600) / 60 |0) + ':' + z(seconds%60);
}

export const min = (a: number, b: number) => {
  return a > b ? b : a;
}

export const max = (a: number, b: number) => {
  return a > b ? a : b;
}