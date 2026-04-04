import { useScrollReveal } from "@/hooks/useScrollReveal";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [
  { src: gallery1, alt: "Gallery Interior", className: "row-span-2" },
  { src: gallery2, alt: "Modern Kitchen", className: "" },
  { src: gallery3, alt: "Spiral Staircase", className: "row-span-2" },
  { src: gallery4, alt: "Penthouse Living", className: "" },
  { src: gallery5, alt: "Chapel Interior", className: "row-span-2" },
  { src: gallery6, alt: "Fine Dining", className: "" },
];

const ImageGallery = () => {
  const { ref, isRevealed } = useScrollReveal(0.05);

  return (
    <section className="section-padding py-24 md:py-40">
      <div className={`reveal-up ${isRevealed ? "revealed" : ""} mb-16 md:mb-24`} ref={ref}>
        <span className="text-label text-muted-foreground mb-4 block">Portfolio</span>
        <h2 className="heading-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
          Design Gallery
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
        {images.map((img, i) => (
          <GalleryItem key={i} image={img} index={i} />
        ))}
      </div>
    </section>
  );
};

const GalleryItem = ({ image, index }: { image: typeof images[0]; index: number }) => {
  const { ref, isRevealed } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`gallery-item ${image.className} reveal-up ${isRevealed ? "revealed" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <img
        src={image.src.src}
        alt={image.alt}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageGallery;
