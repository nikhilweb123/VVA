import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import ImageGallery from "@/components/ImageGallery";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProjects />
      <ImageGallery />
      <About />
      <Footer />
    </main>
  );
};

export default Index;
