// ImageCarousel.jsx
import React, { useState, useEffect, useRef } from 'react';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import './ImageCarousel.css';
import { Lightbox } from './Lightbox';



const ImageCarousel = ({ images = [],theme }) => {
  const glideRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    
    const glide = new Glide(glideRef.current, {
      type: "slider",
      startAt: 0,
      focusAt: "center",
      perView: 3,
      autoplay: 5000,
      hoverpause: true,
      breakpoints: {
        1024: { perView: 2 },
        600: { perView: 1 },
      },
    });
    
    glide.mount();
    
    return () => glide.destroy();
  }, [images]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="image-carousel-container">
      <div className="glide" ref={glideRef}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {images.map((image, index) => (
              <li 
                className="glide__slide" 
                key={image.src}
                onClick={() => openLightbox(index)}
              >
                <div className="slide-content">
                  <img src={image.src} alt={`Slide ${index + 1}`} />
                  <div className="slide-overlay">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glide__arrows" data-glide-el="controls">
          <button style={{backgroundColor:theme}} className="glide__arrow glide__arrow--left" data-glide-dir="<">
            <svg viewBox="0 0 24 24">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
          </button>
          <button style={{backgroundColor:theme}} className="glide__arrow glide__arrow--right" data-glide-dir=">">
            <svg viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={goToNextImage}
          onPrev={goToPrevImage}
        />
      )}
    </div>
  );
};

export default ImageCarousel;