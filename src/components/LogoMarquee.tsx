// Logo marquee component with infinite CSS scroll animation
// Inspired by rasmic.xyz company logos section

// Logo item can be a simple path string or an object with src and link
export interface LogoItem {
  src: string; // Image path from /public/images/logos/
  href?: string; // Optional link URL
}

export interface LogoGalleryConfig {
  enabled: boolean;
  images: (string | LogoItem)[]; // Array of image paths or logo objects
  position: "above-footer" | "below-featured";
  speed: number; // Seconds for one complete scroll cycle
  title?: string; // Optional title above the marquee
}

interface LogoMarqueeProps {
  config: LogoGalleryConfig;
}

// Normalize image to LogoItem format
function normalizeImage(image: string | LogoItem): LogoItem {
  if (typeof image === "string") {
    return { src: image };
  }
  return image;
}

export default function LogoMarquee({ config }: LogoMarqueeProps) {
  // Don't render if disabled or no images
  if (!config.enabled || config.images.length === 0) {
    return null;
  }

  // Normalize and duplicate images for seamless infinite scroll
  const normalizedImages = config.images.map(normalizeImage);
  const duplicatedImages = [...normalizedImages, ...normalizedImages];

  return (
    <div className="logo-marquee-container">
      {config.title && (
        <p className="logo-marquee-title">{config.title}</p>
      )}
      <div
        className="logo-marquee"
        style={
          {
            "--marquee-speed": `${config.speed}s`,
          } as React.CSSProperties
        }
      >
        <div className="logo-marquee-track">
          {duplicatedImages.map((logo, index) => (
            <div key={`${logo.src}-${index}`} className="logo-marquee-item">
              {logo.href ? (
                <a
                  href={logo.href}
                  target={logo.href.startsWith("http") ? "_blank" : undefined}
                  rel={logo.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="logo-marquee-link"
                >
                  <img
                    src={logo.src}
                    alt=""
                    className="logo-marquee-image"
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={logo.src}
                  alt=""
                  className="logo-marquee-image"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
