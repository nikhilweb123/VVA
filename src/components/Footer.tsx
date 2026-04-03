import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const { ref, isRevealed } = useScrollReveal(0.1);

  return (
    <footer id="contact" className="section-padding py-20 md:py-32 border-t border-border">
      <div ref={ref} className={`reveal-up ${isRevealed ? "revealed" : ""}`}>
        <div className="grid md:grid-cols-3 gap-16 mb-20">
          <div>
            <h3 className="heading-serif text-3xl md:text-4xl text-foreground mb-6">
              Let's Create<br />Together
            </h3>
            <a href="mailto:studio@ensodesign.in" className="text-body text-primary hover:text-gold-light transition-colors">
              studio@ensodesign.in
            </a>
          </div>

          <div>
            <span className="text-label text-muted-foreground mb-4 block">Location</span>
            <p className="text-body text-foreground/80">
              Design Studio, Sector 15<br />
              Noida, Uttar Pradesh<br />
              India — 201301
            </p>
          </div>

          <div>
            <span className="text-label text-muted-foreground mb-4 block">Follow</span>
            <div className="flex flex-col gap-3">
              {["Instagram", "LinkedIn", "Behance"].map((social) => (
                <a key={social} href="#" className="nav-link text-foreground/80 w-fit">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-border">
          <span className="heading-serif text-xl text-foreground">
            Enso<span className="text-primary">.</span>
          </span>
          <p className="text-body text-muted-foreground text-xs">
            © 2024 Enso Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
