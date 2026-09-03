import { useState } from "react";

const ImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video rounded-xl bg-[#1c1917] border border-[#33302c] flex items-center justify-center">
        <span className="text-[#948b80] text-sm">No images available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#1c1917] border border-[#33302c]">
        <img
          src={images[activeIndex]}
          alt={`Gallery image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                index === activeIndex
                  ? "border-[#c9a26d]"
                  : "border-[#33302c] opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;