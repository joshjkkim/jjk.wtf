'use client'
import { useEffect, useState } from 'react';

export default function usePreloadImages(urls) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    Promise.all(
      urls.map(src => new Promise(res => {
        const img = new Image();
        img.onload = res;
        img.src    = src;
      }))
    ).then(() => setDone(true));
  }, [urls]);
  return done;
}