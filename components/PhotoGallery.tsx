import React from 'react';

interface Photo {
  src: string; // Will now be a Base64 data URL
  alt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section className="my-6 sm:my-10">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-pink-300 mb-4 sm:mb-6 text-center">
        Our Cherished Moments
      </h2>
      <div className="flex overflow-x-auto space-x-3 sm:space-x-4 py-3 sm:py-4 px-1 sm:px-2 -mx-1 sm:-mx-2">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-40 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-lg shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <p className="text-center text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3 italic">Scroll to see more moments...</p>
    </section>
  );
};

export default PhotoGallery;
