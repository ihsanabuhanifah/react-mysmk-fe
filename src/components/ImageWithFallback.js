import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, fallbackSrc }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className="w-full h-full object-cover relative z-0 rounded-full" 
      onError={handleError}
    />
  );
};

export default ImageWithFallback;