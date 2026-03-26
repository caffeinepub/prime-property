import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import {
  Building2,
  ChevronRight,
  Clock,
  Facebook,
  Home,
  KeyRound,
  MapPin,
  Menu,
  Phone,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import { Loader2, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdminPage from "./AdminPage";
import { useActor } from "./hooks/useActor";
import { useGetAllProperties } from "./hooks/useQueries";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Properties", href: "#properties" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    icon: <Home className="w-10 h-10" />,
    title: "Property Buying",
    description:
      "Find your dream home in Jind with expert guidance. We help you navigate every step — from shortlisting to final registration.",
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    title: "Property Selling",
    description:
      "Maximize the value of your property. Our experienced agents ensure a smooth, transparent, and profitable sale process.",
  },
  {
    icon: <KeyRound className="w-10 h-10" />,
    title: "Property Renting",
    description:
      "Whether you're a landlord or tenant, we match you with the right property in DC Colony, Huda Market and beyond.",
  },
  {
    icon: <UserCheck className="w-10 h-10" />,
    title: "Personalized Guidance",
    description:
      "Get end-to-end real estate consultation tailored to your budget, location preference, and timeline.",
  },
];

const TESTIMONIALS = [
  {
    name: "Kuldeep Kaushik",
    initials: "KK",
    rating: 5,
    text: "Communication was prompt, clear, and honest throughout the entire process. Highly recommend Prime Property for anyone looking to buy or sell in Jind!",
    source: "Google Review",
  },
  {
    name: "Mona Chandiwal",
    initials: "MC",
    rating: 5,
    text: "Best service provider for rental properties in Jind. They found the perfect tenant for my property within a week. Very professional team.",
    source: "Google Review",
  },
  {
    name: "Rajesh Sharma",
    initials: "RS",
    rating: 5,
    text: "Excellent support during the entire home buying journey. The team at Prime Property truly goes above and beyond for their clients.",
    source: "Facebook Review",
  },
];

function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  const stars = Array.from({ length: max }, (_, i) => ({
    id: `star-pos-${i + 1}`,
    filled: i < count,
  }));
  return (
    <span className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={star.id}
          className={`w-4 h-4 ${star.filled ? "fill-gold text-gold" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  );
}

function MainSite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { actor } = useActor();
  const { data: properties = [], isLoading: propertiesLoading } =
    useGetAllProperties();
  const contactRef = useRef<HTMLElement>(null);

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitInquiry(data.name, data.phone, data.message);
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", phone: "", message: "" });
      toast.success("Inquiry submitted! We'll contact you shortly.");
    },
    onError: () => {
      toast.error("Failed to send. Please try again or call us directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="font-poppins min-h-screen bg-background">
      <Toaster richColors />

      {/* ─── HEADER ─── */}
      <header
        id="home"
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs"
        data-ocid="header.panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-md bg-navy flex items-center justify-center">
              <span className="text-white text-sm font-bold tracking-tight">
                PP
              </span>
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold text-foreground">
                Prime Property
              </span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest">
                Jind Realty Experts
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-gold transition-colors"
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA phone */}
          <a
            href="tel:08708059321"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-gold hover:text-primary transition-colors"
            data-ocid="header.phone.link"
          >
            <Phone className="w-4 h-4" />
            087080 59321
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.menu.toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-white px-4 pb-4"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 py-3 text-sm font-medium text-foreground hover:text-gold border-b border-border/50 last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gold" />
                  {link.label}
                </a>
              ))}
              <a
                href="tel:08708059321"
                className="flex items-center gap-2 mt-3 text-sm font-semibold text-gold"
              >
                <Phone className="w-4 h-4" /> 087080 59321
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── HERO ─── */}
      <section
        className="relative min-h-[92vh] flex items-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-property.dim_1600x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <span className="inline-block mb-5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold border border-gold/50 rounded-full">
              Jind's Most Trusted Realty
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Your Trusted <span className="text-gold">Real Estate</span>{" "}
              Partner in Jind
            </h1>

            <p className="text-base sm:text-lg text-white/85 mb-7 leading-relaxed">
              Expert guidance for buying, selling &amp; renting properties in
              Haryana. Available 24 hours a day, 7 days a week.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-x-0 gap-y-2 mb-10 text-sm text-white/80 font-medium">
              {["Expertise", "Trust", "Local Knowledge"].map((pill, i) => (
                <span key={pill} className="flex items-center">
                  {i > 0 && <span className="mx-3 text-gold/60">|</span>}
                  {pill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a href="#contact" data-ocid="hero.primary_button">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-white font-semibold px-7 py-3 h-auto shadow-lg"
                >
                  Get Free Consultation
                </Button>
              </a>
              <a href="#services" data-ocid="hero.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/60 text-white bg-white/10 hover:bg-white/20 hover:text-white font-semibold px-7 py-3 h-auto backdrop-blur-sm"
                >
                  Our Services
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Rating badge */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-10 right-10 hidden lg:flex flex-col gap-3"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-gold text-gold" />
              <span className="text-white font-bold text-lg">4.9</span>
            </div>
            <div className="text-white/70 text-xs">
              <div className="font-semibold text-white text-sm">
                Google Rating
              </div>
              <div>200+ Happy Clients</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-gold text-gold" />
              <span className="text-white font-bold text-lg">5.0</span>
            </div>
            <div className="text-white/70 text-xs">
              <div className="font-semibold text-white text-sm">
                Facebook Rating
              </div>
              <div>100% Satisfied</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-gold text-xs font-semibold uppercase tracking-widest mb-3 block">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Our Professional Services
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">
              From buying your first home to managing rental portfolios — PP
              Estates delivers end-to-end real estate solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                data-ocid={`services.item.${i + 1}`}
                className="bg-white rounded-xl p-7 shadow-card hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4 group"
              >
                <div className="w-16 h-16 rounded-lg bg-cream flex items-center justify-center text-gold group-hover:bg-navy group-hover:text-white transition-colors duration-300">
                  {svc.icon}
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {svc.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {svc.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROPERTIES ─── */}
      <section id="properties" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-gold text-xs font-semibold uppercase tracking-widest mb-3 block">
              Explore Listings
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground uppercase tracking-wide">
              Available Properties
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm">
              Browse our latest listings in Jind and surrounding areas.
            </p>
          </motion.div>

          {propertiesLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="properties.loading_state"
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-xl overflow-hidden shadow-card bg-white"
                >
                  <Skeleton className="h-52 w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="properties.empty_state"
            >
              <Building2 className="w-12 h-12 text-border mb-4" />
              <p className="text-muted-foreground font-medium">
                No properties listed yet.
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Check back soon for new listings!
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="properties.list"
            >
              {properties.map((prop, i) => (
                <motion.div
                  key={prop.id.toString()}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  data-ocid={`properties.item.${i + 1}`}
                  className="bg-white rounded-xl shadow-card overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden bg-cream">
                    {prop.imageUrl ? (
                      <img
                        src={prop.imageUrl}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-border" />
                      </div>
                    )}
                    <Badge
                      className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 ${
                        prop.propertyType === "Sale"
                          ? "bg-navy text-white"
                          : "bg-gold text-white"
                      }`}
                    >
                      {prop.propertyType === "Sale" ? "For Sale" : "For Rent"}
                    </Badge>
                  </div>
                  <div className="p-5 flex flex-col gap-2.5 flex-1">
                    <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2">
                      {prop.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      {prop.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gold">
                      <Tag className="w-3.5 h-3.5" />
                      {prop.price}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-1">
                      {prop.description}
                    </p>
                    <a href="#contact" className="mt-auto pt-3">
                      <Button
                        size="sm"
                        className="w-full bg-navy hover:bg-navy/90 text-white text-xs"
                      >
                        Enquire Now
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <span className="text-gold text-xs font-semibold uppercase tracking-widest mb-3 block">
              What Our Clients Say
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground uppercase tracking-wide">
              Client Testimonials &amp; Ratings
            </h2>
          </motion.div>

          {/* Rating pills */}
          <div className="flex flex-wrap justify-center gap-5 mb-12">
            <div className="flex items-center gap-3 bg-cream rounded-full px-6 py-2.5 shadow-xs">
              <StarRating count={5} />
              <span className="text-sm font-semibold text-foreground">4.9</span>
              <span className="text-sm text-muted-foreground">
                | Google Reviews
              </span>
            </div>
            <div className="flex items-center gap-3 bg-cream rounded-full px-6 py-2.5 shadow-xs">
              <Facebook className="w-4 h-4 text-blue-600 fill-blue-600" />
              <StarRating count={5} />
              <span className="text-sm font-semibold text-foreground">5.0</span>
              <span className="text-sm text-muted-foreground">
                | Facebook Reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                data-ocid={`testimonials.item.${i + 1}`}
                className="bg-cream rounded-xl p-7 shadow-xs flex flex-col gap-4 relative"
              >
                <div className="text-gold text-5xl font-serif leading-none select-none opacity-30 absolute top-5 right-6">
                  &ldquo;
                </div>
                <StarRating count={t.rating} />
                <p className="text-sm text-foreground leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.source}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" ref={contactRef} className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-gold text-xs font-semibold uppercase tracking-widest mb-3 block">
              Reach Out
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground uppercase tracking-wide">
              Get In Touch With Us
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm">
              Have a question or ready to start your real estate journey? We're
              available 24/7.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Office Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl overflow-hidden shadow-card"
            >
              <img
                src="/assets/generated/office-interior.dim_600x500.jpg"
                alt="Prime Property Office"
                className="w-full h-72 lg:h-80 object-cover"
              />
              <div className="bg-navy text-white p-5">
                <div className="text-lg font-bold">Prime Property</div>
                <div className="text-xs text-white/70 mt-1">
                  Jind Realty Experts
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-card"
            >
              <h3 className="text-lg font-bold text-foreground mb-6">
                Send Us a Message
              </h3>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8 gap-4"
                    data-ocid="contact.success_state"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                      <Star className="w-7 h-7 text-green-600 fill-green-600" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">
                      Thank You!
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We've received your inquiry. Our team will contact you
                      within the hour.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                      className="mt-2"
                    >
                      Send Another
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                    data-ocid="contact.form"
                  >
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide"
                      >
                        Full Name
                      </label>
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        data-ocid="contact.name.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="contact-phone"
                        placeholder="Your phone number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, phone: e.target.value }))
                        }
                        data-ocid="contact.phone.input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide"
                      >
                        Message
                      </label>
                      <Textarea
                        id="contact-message"
                        placeholder="Tell us about your property needs..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            message: e.target.value,
                          }))
                        }
                        data-ocid="contact.message.textarea"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="bg-gold hover:bg-gold/90 text-white font-semibold h-11 w-full"
                      data-ocid="contact.submit_button"
                    >
                      {mutation.isPending ? "Sending..." : "Send Inquiry"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-5"
            >
              {[
                {
                  icon: (
                    <MapPin className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  ),
                  label: "Our Office",
                  value:
                    "Shop no. 98, opp. D.R.D.A, Huda Market, DC Colony, Jind, Haryana 126102",
                },
                {
                  icon: <Phone className="w-5 h-5 text-gold shrink-0" />,
                  label: "Phone",
                  value: "087080 59321",
                  href: "tel:08708059321",
                },
                {
                  icon: <Clock className="w-5 h-5 text-gold shrink-0" />,
                  label: "Working Hours",
                  value: "Open 24 Hours — 7 Days a Week",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-5 shadow-xs flex gap-4 items-start"
                >
                  {item.icon}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-medium text-foreground hover:text-gold transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-sm font-medium text-foreground">
                        {item.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Map embed */}
              <div className="rounded-xl overflow-hidden shadow-xs h-44 bg-muted">
                <iframe
                  title="Prime Property Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3488.789!2d76.315!3d29.318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDE5JzA1LjAiTiA3NsKwMTgnNTQuMCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-md bg-gold flex items-center justify-center">
                  <span className="text-white text-sm font-bold">PP</span>
                </div>
                <div>
                  <div className="text-sm font-bold">Prime Property</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest">
                    Jind Realty Experts
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Your most trusted real estate partner in Jind, Haryana. Expert
                guidance, transparent deals, and 24/7 support.
              </p>
              <div className="flex items-center gap-2">
                <StarRating count={5} />
                <span className="text-white/60 text-xs">4.9 / 5 on Google</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 hover:text-gold transition-colors flex items-center gap-1.5"
                      data-ocid={`footer.${link.label.toLowerCase()}.link`}
                    >
                      <ChevronRight className="w-3 h-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">
                Contact Info
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-white/60">
                  <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  Shop no. 98, opp. D.R.D.A, Huda Market, DC Colony, Jind,
                  Haryana 126102
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <a
                    href="tel:08708059321"
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    087080 59321
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/60">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  Open 24 Hours
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Prime Property. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs text-white/30">
                Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/60 transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
              <a
                href="#admin"
                className="text-xs text-white/20 hover:text-white/40 transition-colors"
                data-ocid="footer.admin.link"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (hash === "#admin") {
    return <AdminPage />;
  }
  return <MainSite />;
}
