'use client';

import { useState } from 'react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';

export default function SafeImage({ src, alt, style }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMG);

  return (
    <img
      src={imgSrc}
      alt={alt}
      style={style}
      onError={() => {
        if (imgSrc !== FALLBACK_IMG) setImgSrc(FALLBACK_IMG);
      }}
    />
  );
}
