'use client'
import React from 'react';
import usePreloadImages from '../hooks/usePreload';
import { ALL_TEXTURES } from '../utils/tables';

export default function AppWrapper({ children }) {
  const ready = usePreloadImages(ALL_TEXTURES);

  if (!ready) {
    return <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
      Loading assets…
    </div>;
  }
  return children;
}
