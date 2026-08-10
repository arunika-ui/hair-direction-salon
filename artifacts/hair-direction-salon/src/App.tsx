import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  Instagram,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useServiceGroups } from "./hooks/use-services";
import { normalizeRawGroups, type ServiceGroup } from "./lib/services";
import { useGalleryImages } from "./hooks/use-gallery";
import type { GalleryImage } from "./lib/gallery";
import { useProducts } from "./hooks/use-products";
import type { Product } from "./lib/products";
import "./index.css";
import img1 from "./assets/img1.jpeg";
import img2 from "./assets/img2.jpeg";
import img3 from "./assets/img3.jpeg";
import img4 from "./assets/img4.jpeg";
import img5 from "./assets/img5.png";
import img6 from "./assets/img6.jpeg";
import img7 from "./assets/img7.jpeg";
import img8 from "./assets/img8.jpeg";
import img9 from "./assets/img9.jpeg";
import img10 from "./assets/img10.jpeg";

gsap.registerPlugin(ScrollTrigger);

type Service = {
  name: string;
  description: string;
  price: string;
  duration: string;
};
type Group = { name: string; items: Service[] };

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;
const markLoaded = (event: React.SyntheticEvent<HTMLImageElement>) =>
  event.currentTarget.classList.add("is-loaded");

const images = {
  hero: img5,
  colour: img7,
  cut: img1,
  extensions: img10,
  keratin: img6,
  detail: img2,
  tools: img3,
  interior: img8,
  product: img9,
  mirror: img4,
};

const groups: Group[] = [
  {
    name: "Cutting",
    items: [
      {
        name: "Signature Haircut",
        duration: "45 min",
        price: "₹ 1,200",
        description: "A considered cut, finished to move with you.",
      },
      {
        name: "Shampoo & Blow Dry",
        duration: "35 min",
        price: "₹ 800",
        description: "Polished volume and a soft, lasting finish.",
      },
      {
        name: "Fringe / Bang Trim",
        duration: "20 min",
        price: "₹ 400",
        description: "A small change with a precise point of view.",
      },
    ],
  },
  {
    name: "Colour",
    items: [
      {
        name: "Global Colour",
        duration: "2.5 hrs",
        price: "₹ 3,500",
        description: "A rich, seamless all-over colour tailored to your tone.",
      },
      {
        name: "Balayage / Highlights",
        duration: "3.5 hrs",
        price: "₹ 6,500",
        description:
          "Hand-painted dimension with a beautifully grown-in finish.",
      },
      {
        name: "Root Touch Up",
        duration: "90 min",
        price: "₹ 1,800",
        description: "Quietly precise colour maintenance.",
      },
    ],
  },
  {
    name: "Smoothing & Treatments",
    items: [
      {
        name: "G.K Keratin",
        duration: "3 hrs",
        price: "₹ 5,500",
        description: "Gloss, manageability and movement without the stiffness.",
      },
      {
        name: "Keratin Treatment",
        duration: "3 hrs",
        price: "₹ 4,500",
        description: "A smoothing ritual for softer, calmer texture.",
      },
      {
        name: "Deep Conditioning Ritual",
        duration: "45 min",
        price: "₹ 1,500",
        description: "A restorative treatment for thirsty, stressed strands.",
      },
    ],
  },
  {
    name: "Styling",
    items: [
      {
        name: "Classic Blowout",
        duration: "45 min",
        price: "₹ 1,000",
        description: "Shape, shine and a finish that holds its intention.",
      },
      {
        name: "Occasion Styling",
        duration: "75 min",
        price: "₹ 2,500",
        description: "A tailored look for the nights worth remembering.",
      },
    ],
  },
  {
    name: "Extensions",
    items: [
      {
        name: "Extension Consultation",
        duration: "30 min",
        price: "Complimentary",
        description: "A private conversation about length, tone and fit.",
      },
      {
        name: "Premium Hair Extensions",
        duration: "3 hrs",
        price: "₹ 12,000",
        description:
          "Seamlessly matched volume and length, installed with care.",
      },
    ],
  },
  {
    name: "Texture",
    items: [
      {
        name: "Soft Perm",
        duration: "2.5 hrs",
        price: "₹ 4,500",
        description: "A little more movement, a little less effort.",
      },
      {
        name: "Curl Definition Ritual",
        duration: "60 min",
        price: "₹ 1,600",
        description: "Shape and hydration for your natural texture.",
      },
    ],
  },
];

const featured = [
  {
    number: "01",
    title: "Global Colour & Balayage",
    copy: "Dimension, tone and a finish that feels entirely yours.",
    price: "From ₹ 3,500",
    image: images.colour,
  },
  {
    number: "02",
    title: "Haircut & Styling",
    copy: "The right shape changes how you carry a room.",
    price: "From ₹ 1,200",
    image: images.cut,
  },
  {
    number: "03",
    title: "Hair Extensions",
    copy: "Seamless length. Natural movement. No shortcuts.",
    price: "From ₹ 12,000",
    image: images.extensions,
  },
  {
    number: "04",
    title: "G.K Keratin",
    copy: "Gloss, ease and beautifully quiet texture.",
    price: "From ₹ 5,500",
    image: images.keratin,
  },
];

const reviews = [
  {
    quote:
      "The colour consultation was thoughtful and the result is the most natural balayage I have ever had. Every detail felt considered.",
    name: "Aarushi M.",
    source: "Google review",
  },
  {
    quote:
      "A beautiful salon with artists who genuinely listen. My haircut has grown out perfectly and still feels like me.",
    name: "Nandini R.",
    source: "Google review",
  },
  {
    quote:
      "From the first welcome to the final finish, the experience felt calm, personal and wonderfully precise.",
    name: "Rhea K.",
    source: "Justdial review",
  },
];

// Fallback gallery, shaped exactly like the Sanity result. Shown when the
// galleryImage query errors or returns empty, so the section never breaks.
// First 4 -> primary grid, next 4 -> expandable grid (both fixed at 4 so the
// .gallery-grid layout rules apply directly).
const fallbackGallery: GalleryImage[] = [
  { image: images.detail, caption: "Texture / light", alt: "Close detail of textured hair" },
  { image: images.interior, caption: "The studio", alt: "Warm salon interior detail" },
  { image: images.tools, caption: "The craft", alt: "Salon tools arranged on a work surface" },
  { image: images.product, caption: "The ritual", alt: "Haircare product flatlay" },
  { image: images.mirror, caption: "The mirror", alt: "" },
  { image: images.colour, caption: "Colour work", alt: "" },
  { image: images.cut, caption: "The cut", alt: "" },
  { image: images.keratin, caption: "Smoothing", alt: "" },
];

function scrollTo(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);
  return <>{children}</>;
}

function BookingModal({
  service,
  serviceGroups,
  onClose,
}: {
  service: string;
  serviceGroups: ServiceGroup[];
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [closing, setClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeModal = () => {
    if (closing) return;
    if (reducedMotion()) {
      onClose();
      return;
    }
    setClosing(true);
    gsap
      .timeline({ onComplete: onClose })
      .to(
        modalRef.current,
        { autoAlpha: 0, y: 18, scale: 0.98, duration: 0.45, ease: "power2.in" },
        0,
      )
      .to(
        backdropRef.current,
        { autoAlpha: 0, duration: 0.5, ease: "power2.in" },
        0.06,
      );
  };
  useLayoutEffect(() => {
    if (reducedMotion()) return;
    gsap
      .timeline()
      .fromTo(
        backdropRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
      )
      .fromTo(
        modalRef.current,
        { autoAlpha: 0, y: 24, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: "power3.out" },
        "-=0.18",
      );
  }, []);
  useEffect(() => {
    const handler = (event: KeyboardEvent) =>
      event.key === "Escape" && closeModal();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div
      ref={backdropRef}
      className={`modal-backdrop ${closing ? "is-closing" : ""}`}
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && closeModal()
      }
    >
      <div
        ref={modalRef}
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Book an appointment"
      >
        <button
          className="modal-close"
          onClick={closeModal}
          aria-label="Close booking form"
        >
          <X size={17} />
        </button>
        {!submitted ? (
          <>
            <span className="eyebrow">A private appointment</span>
            <h2 className="serif">Make it yours.</h2>
            <p className="modal-intro">
              Tell us a little about your visit. Our team will call to confirm
              your appointment shortly.
            </p>
            <form
              className="booking-form"
              onSubmit={async (event) => {
                event.preventDefault();
                if (submitting) return;
                const data = new FormData(event.currentTarget);
                setError(false);
                setSubmitting(true);
                try {
                  const response = await fetch("/api/book-appointment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: data.get("name"),
                      phone: data.get("phone"),
                      email: data.get("email"),
                      service: data.get("service"),
                      date: data.get("date"),
                      time: data.get("time"),
                      notes: data.get("notes"),
                    }),
                  });
                  if (!response.ok) throw new Error("Booking request failed");
                  setSubmitted(true);
                } catch {
                  setError(true);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" required placeholder="Your name" />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    placeholder="+91"
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-field">
                <label htmlFor="service">Service</label>
                <select
                  id="service"
                  name="service"
                  defaultValue={service || "Signature Haircut"}
                >
                  {[
                    ...new Set([
                      "Signature Haircut",
                      ...featured.map((item) => item.title),
                      ...serviceGroups.flatMap((group) =>
                        group.items.map((item) => item.name),
                      ),
                    ]),
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="date">Preferred date</label>
                  <input id="date" name="date" required type="date" />
                </div>
                <div className="form-field">
                  <label htmlFor="time">Preferred time</label>
                  <input id="time" name="time" required type="time" />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Anything we should know?"
                />
              </div>
              {error && (
                <p className="form-error" role="alert">
                  Something went wrong while sending your request. Please call
                  the studio directly at{" "}
                  <a href="tel:07503135104">075031 35104</a> to book.
                </p>
              )}
              <button className="button" type="submit" disabled={submitting}>
                {submitting ? (
                  "Sending…"
                ) : (
                  <>
                    Request appointment <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="confirmation">
            <div className="confirm-mark">
              <span>✓</span>
            </div>
            <h2 className="serif">
              Thank you — we'll confirm your appointment shortly
            </h2>
            <p>We look forward to welcoming you at The Hair Direction.</p>
            <button className="button text" onClick={closeModal}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Nav({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const navRef = useRef<HTMLElement>(null);
  const links = [
    ["Home", "home"],
    ["Services", "services"],
    ["Shop", "shop"],
    ["Gallery", "gallery"],
    ["About", "about"],
    ["Reviews", "reviews"],
    ["Contact", "contact"],
  ];
  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const triggers = links.map(([, id]) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: id === "home" ? "top top" : "top 45%",
        end: id === "home" ? "bottom 45%" : "bottom 45%",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      }),
    );
    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);
  useLayoutEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "90% top",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => trigger.kill();
  }, []);
  useEffect(() => {
    const activeLink = navRef.current?.querySelector(
      `.nav-link[data-section="${active}"]`,
    );
    if (!activeLink || reducedMotion()) return;
    gsap.fromTo(
      activeLink.querySelector(".nav-underline"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.55, ease: "power3.out", overwrite: true },
    );
  }, [active]);
  return (
    <nav ref={navRef} className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a className="wordmark" href="#home" onClick={() => setOpen(false)}>
        <span className="wordmark-mark" />
        THE HAIR DIRECTION
      </a>
      <div className={`nav-links ${open ? "open" : ""}`}>
        {links.map(([label, id]) => (
          <a
            className={`nav-link ${active === id ? "active" : ""}`}
            data-section={id}
            href={`#${id}`}
            key={id}
            onClick={() => {
              setOpen(false);
              setActive(id);
            }}
          >
            {label}
            <span className="nav-underline" />
          </a>
        ))}
      </div>
      <button className="button nav-book" onClick={onBook}>
        Book now <ArrowUpRight size={13} />
      </button>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
    </nav>
  );
}

function App() {
  const [booking, setBooking] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const siteRef = useRef<HTMLDivElement>(null);
  const galleryExpandRef = useRef<HTMLDivElement>(null);
  const shopTrackRef = useRef<HTMLDivElement>(null);

  // Full-menu services come from Sanity. On error or empty result we fall back
  // to the hardcoded `groups` so a visitor never sees a broken/empty section.
  const { data, isLoading, isError } = useServiceGroups();
  const serviceGroups = useMemo(
    () =>
      !isError && data && data.length > 0
        ? data
        : normalizeRawGroups(groups),
    [data, isError],
  );

  // Gallery images come from Sanity too. Same pattern: fall back to the curated
  // hardcoded set on error/empty. The fallback is real content, so we render it
  // immediately (no spinner) and upgrade in place when Sanity data arrives.
  const { data: galleryData } = useGalleryImages();
  const galleryImages = useMemo<GalleryImage[]>(
    () =>
      galleryData && galleryData.length > 0 ? galleryData : fallbackGallery,
    [galleryData],
  );
  const primaryGallery = galleryImages.slice(0, 4);
  const moreGallery = galleryImages.slice(4, 8);

  // Shop products from Sanity (same read-client/hook pattern as services/gallery).
  // No fallback content — until products are published in Studio, the section
  // shows a loading state then a tasteful empty state.
  const { data: productData, isLoading: productsLoading } = useProducts();
  const products = useMemo<Product[]>(() => productData ?? [], [productData]);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const context = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTimeline
        .from(".hero-kicker", { autoAlpha: 0, y: 20, duration: 0.6 })
        .from(
          ".hero-line",
          { autoAlpha: 0, y: 40, duration: 0.85, stagger: 0.08 },
          "-=0.25",
        )
        .from(
          ".hero-copy, .hero-actions",
          { autoAlpha: 0, y: 24, duration: 0.65, stagger: 0.1 },
          "-=0.35",
        );

      gsap.to(".hero-media img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils
        .toArray<HTMLElement>(
          ".intro-title, .section-heading h2, .gallery-intro h2, .contact-title",
        )
        .forEach((heading) => {
          gsap.fromTo(
            heading,
            { clipPath: "inset(0 0 100% 0)", y: 18 },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: heading, start: "top 80%", once: true },
            },
          );
        });

      gsap.fromTo(
        ".about-line",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".intro-copy",
            start: "top 78%",
            once: true,
          },
        },
      );

      if (window.innerWidth > 860) {
        ScrollTrigger.create({
          trigger: ".intro",
          start: "top top",
          end: "+=440",
          pin: ".intro-grid",
          scrub: true,
          pinSpacing: true,
        });
      }

      gsap.from(".feature-card", {
        autoAlpha: 0,
        y: 30,
        scale: 0.98,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".featured-grid",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".gallery-grid-primary .gallery-cell", {
        autoAlpha: 0,
        y: 30,
        scale: 0.98,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gallery-grid-primary",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".contact-item, .map-card", {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 80%",
          once: true,
        },
      });

      const reviewTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      reviewTimeline
        .to(".review-card", {
          autoAlpha: 0,
          y: -10,
          duration: 0.45,
          ease: "power2.in",
        })
        .call(() => setReviewIndex((index) => (index + 1) % reviews.length))
        .fromTo(
          ".review-card",
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out" },
        );
    }, siteRef);
    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const items =
      siteRef.current?.querySelectorAll<HTMLElement>(".service-items");
    if (!items) return;
    items.forEach((item, index) => {
      gsap.killTweensOf(item);
      const isOpen = index === activeGroup;
      gsap.to(item, {
        height: isOpen ? item.scrollHeight : 0,
        autoAlpha: isOpen ? 1 : 0,
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: true,
      });
    });
  }, [activeGroup, serviceGroups]);

  // The accordion sits behind a loading state at mount, so its entrance reveal
  // can't run in the mount-time timeline. Run it once the rows actually exist
  // (Sanity data or fallback), and refresh ScrollTrigger since the section grew
  // taller and other triggers' positions need recalculating.
  const groupsRevealed = useRef(false);
  useLayoutEffect(() => {
    if (reducedMotion() || isLoading || groupsRevealed.current) return;
    const groupEls =
      siteRef.current?.querySelectorAll(".service-group") ?? [];
    if (groupEls.length === 0) return;
    groupsRevealed.current = true;
    const context = gsap.context(() => {
      gsap.from(".service-group", {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".service-menu",
          start: "top 82%",
          once: true,
        },
      });
      ScrollTrigger.refresh();
    }, siteRef);
    return () => context.revert();
  }, [isLoading, serviceGroups]);

  // Expandable gallery. Reuses the services-accordion height technique for the
  // container and the gallery-cell reveal values (y:30 / scale:.98 / power3.out)
  // for the images, so it reads as a continuation of the site's motion language.
  useLayoutEffect(() => {
    const container = galleryExpandRef.current;
    if (!container) return;
    const cells = container.querySelectorAll<HTMLElement>(".gallery-cell");
    if (reducedMotion()) {
      gsap.set(container, { height: galleryOpen ? "auto" : 0 });
      gsap.set(cells, { autoAlpha: galleryOpen ? 1 : 0 });
      return;
    }
    gsap.killTweensOf(container);
    gsap.killTweensOf(cells);
    if (galleryOpen) {
      gsap.set(cells, { autoAlpha: 0, y: 30, scale: 0.98 });
      gsap.to(container, {
        height: container.scrollHeight,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
      gsap.to(cells, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1,
      });
    } else {
      gsap.to(cells, {
        autoAlpha: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(container, {
        height: 0,
        duration: 0.45,
        ease: "power2.inOut",
        delay: 0.05,
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  }, [galleryOpen]);

  // Shop carousel: entrance reveal (matching the feature/gallery card motion)
  // plus a slow auto-drift. The row is a native overflow-x scroll container, so
  // manual scroll/drag/touch is free; a gsap ticker nudges scrollLeft and
  // ping-pongs at the ends (reversing avoids the visible wrap-jump a native
  // scroll loop would cause). Pauses on hover and during manual interaction
  // (resumes after a short idle). reducedMotion disables the drift entirely,
  // leaving only manual scroll.
  useLayoutEffect(() => {
    const track = shopTrackRef.current;
    if (!track || products.length === 0) return;
    const reduce = reducedMotion();

    const context = gsap.context(() => {
      if (reduce) return;
      gsap.from(".product-card", {
        autoAlpha: 0,
        y: 30,
        scale: 0.98,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".shop-track", start: "top 85%", once: true },
      });
    }, siteRef);

    if (reduce) return () => context.revert();

    let direction = 1; // 1 = drift right, -1 = drift left
    let hovering = false;
    let interacting = false;
    let idleTimer: number | undefined;
    const SPEED = 0.4; // px per frame — a gentle drift

    const tick = () => {
      if (hovering || interacting) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 1) return;
      track.scrollLeft += SPEED * direction;
      if (track.scrollLeft >= max) direction = -1;
      else if (track.scrollLeft <= 0) direction = 1;
    };
    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const onInteract = () => {
      interacting = true;
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        interacting = false;
      }, 1500);
    };

    gsap.ticker.add(tick);
    track.addEventListener("pointerenter", onEnter);
    track.addEventListener("pointerleave", onLeave);
    track.addEventListener("wheel", onInteract, { passive: true });
    track.addEventListener("touchstart", onInteract, { passive: true });
    track.addEventListener("pointerdown", onInteract);

    return () => {
      gsap.ticker.remove(tick);
      if (idleTimer) window.clearTimeout(idleTimer);
      track.removeEventListener("pointerenter", onEnter);
      track.removeEventListener("pointerleave", onLeave);
      track.removeEventListener("wheel", onInteract);
      track.removeEventListener("touchstart", onInteract);
      track.removeEventListener("pointerdown", onInteract);
      context.revert();
    };
  }, [products]);

  return (
    <SmoothScroll>
      <div ref={siteRef} className="site-shell">
        <Nav onBook={() => setBooking("")} />
        <main>
          <section className="hero" id="home">
            <div className="hero-media">
              <img
                src={images.hero}
                onLoad={markLoaded}
                alt="Back view of long, glossy waves with hands in the hair"
              />
            </div>
            <div className="hero-content reveal">
              <div className="hero-kicker eyebrow">
                An atelier for hair · Kamla Nagar, Delhi
              </div>
              <h1 className="serif">
                <span className="hero-line">Experience</span>
                <span className="hero-line">
                  the <em>Art</em> of Hair
                </span>
              </h1>
              <p className="hero-copy">
                A considered salon experience for hair that feels like you —
                only more so. Come in for the craft, stay for the feeling.
              </p>
              <div className="hero-actions">
                <button className="button" onClick={() => setBooking("")}>
                  Book your visit <ArrowUpRight size={14} />
                </button>
                <a className="button ghost" href="#services">
                  Explore services
                </a>
              </div>
            </div>
            <div className="hero-meta">44UB · Jawahar Nagar · Delhi 110007</div>
            <a className="scroll-cue" href="#about">
              Scroll to discover
            </a>
          </section>

          <section className="section intro" id="about">
            <div className="section-inner intro-grid">
              <div>
                <span className="eyebrow">01 / The Direction</span>
                <h2 className="intro-title serif">
                  Good hair
                  <br />
                  <em>
                    has a point
                    <br />
                    of view.
                  </em>
                </h2>
              </div>
              <p className="intro-copy">
                <span className="about-line">
                  The Hair Direction is a salon in the heart of Kamla Nagar,
                  Delhi, where <em>technical expertise</em>
                </span>{" "}
                <span className="about-line">
                  meets a distinctly personal approach. We believe your hair
                  should not just look beautiful
                </span>{" "}
                <span className="about-line">
                  in the chair — it should live beautifully, too.
                </span>
              </p>
              <div className="intro-aside">
                <strong className="serif">
                  Since
                  <br />
                  2014
                </strong>
                We work with texture, tone and proportion to create hair that
                belongs to the person wearing it. No templates. No rush.
              </div>
            </div>
          </section>

          <section className="section dark-section" id="services">
            <div className="section-inner">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">02 / The edit</span>
                  <h2 className="serif">The signatures.</h2>
                </div>
                <p>
                  Our most requested rituals, shaped by the way Delhi lives and
                  the hair it brings with it.
                </p>
              </div>
              <div className="featured-grid">
                {featured.map((item) => (
                  <article className="feature-card" key={item.title}>
                    <img
                      src={item.image}
                      onLoad={markLoaded}
                      loading="lazy"
                      alt=""
                    />
                    <span className="feature-number">{item.number}</span>
                    <div className="feature-info">
                      <h3 className="serif">{item.title}</h3>
                      <p>{item.copy}</p>
                      <div className="feature-bottom">
                        <span className="price">{item.price}</span>
                        <button
                          className="mini-book"
                          onClick={() => setBooking(item.title)}
                        >
                          Book this
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section services-section">
            <div className="section-inner">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">03 / The full menu</span>
                  <h2 className="serif">Take your time.</h2>
                </div>
                <p>
                  A complete menu of cuts, colour, care and finishing. Every
                  service begins with a conversation.
                </p>
              </div>
              <div className="service-menu">
                {isLoading ? (
                  <div className="service-loading">Loading services…</div>
                ) : (
                  serviceGroups.map((group, index) => (
                    <div
                      className={`service-group ${activeGroup === index ? "open" : ""}`}
                      key={group.name}
                    >
                      <button
                        className="service-group-head"
                        onClick={() =>
                          setActiveGroup(activeGroup === index ? -1 : index)
                        }
                      >
                        <h3>{group.name}</h3>
                        <span>+</span>
                      </button>
                      <div className="service-items">
                        <div className="service-items-inner">
                          {group.items.map((item) => (
                            <div className="service-item" key={item.name}>
                              <div className="service-name">{item.name}</div>
                              <div className="service-meta">
                                {item.variants.length === 1
                                  ? item.variants[0].duration
                                  : ""}
                              </div>
                              <div className="service-price">
                                {item.priceLabel}
                              </div>
                              <div className="service-desc">
                                {item.description}
                              </div>
                              {item.variants.length > 1 && (
                                <ul className="service-variants">
                                  {item.variants.map((variant, vi) => (
                                    <li key={variant.label ?? vi}>
                                      <span className="variant-label">
                                        {variant.label ?? "Standard"}
                                      </span>
                                      <span className="variant-duration">
                                        {variant.duration}
                                      </span>
                                      <span className="variant-price">
                                        {variant.priceLabel}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <button
                                className="mini-book"
                                onClick={() => setBooking(item.name)}
                              >
                                Book
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="section shop-section" id="shop">
            <div className="section-inner">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">04 / The shop</span>
                  <h2 className="serif">Take it home.</h2>
                </div>
                <p>
                  Salon-grade products and tools, chosen to keep the result
                  looking its best between visits.
                </p>
              </div>
              {productsLoading ? (
                <div className="shop-loading">Loading products…</div>
              ) : products.length === 0 ? (
                <div className="shop-empty">
                  Our shop is being curated — products arriving soon.
                </div>
              ) : (
                <div className="shop-track" ref={shopTrackRef}>
                  {products.map((item) => (
                    <article className="product-card" key={item.slug ?? item.name}>
                      <div className="product-media">
                        {item.image && (
                          <img
                            src={item.image}
                            onLoad={markLoaded}
                            loading="lazy"
                            alt={item.name}
                          />
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{item.name}</h3>
                        <div className="product-bottom">
                          <span className="product-price">{item.priceLabel}</span>
                          <button className="mini-book add-to-cart" type="button">
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="section gallery-section" id="gallery">
            <div className="section-inner">
              <div className="gallery-intro">
                <div>
                  <span className="eyebrow">05 / In the studio</span>
                  <h2 className="serif">
                    Details
                    <br />
                    matter.
                  </h2>
                </div>
                <p>
                  Light on the mirror. The sound of scissors. A warm towel, a
                  good conversation, an unhurried finish. The small things are
                  the whole thing.
                </p>
              </div>
              <div className="gallery-grid gallery-grid-primary">
                {primaryGallery.map((cell, index) => (
                  <div className="gallery-cell" key={index}>
                    <img
                      src={cell.image}
                      onLoad={markLoaded}
                      loading="lazy"
                      alt={cell.alt}
                    />
                    <span className="gallery-caption">{cell.caption}</span>
                  </div>
                ))}
              </div>
              {moreGallery.length > 0 && (
                <>
                  <div className="gallery-more-cta">
                    <button
                      className={`button text gallery-toggle ${galleryOpen ? "open" : ""}`}
                      onClick={() => setGalleryOpen(!galleryOpen)}
                      aria-expanded={galleryOpen}
                      aria-controls="gallery-expand"
                    >
                      {galleryOpen ? "Hide gallery" : "See gallery"}
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                  <div
                    className="gallery-expand"
                    id="gallery-expand"
                    ref={galleryExpandRef}
                    aria-hidden={!galleryOpen}
                  >
                    <div className="gallery-grid gallery-grid-more">
                      {moreGallery.map((cell, index) => (
                        <div className="gallery-cell" key={index}>
                          <img
                            src={cell.image}
                            onLoad={markLoaded}
                            loading="lazy"
                            alt={cell.alt}
                          />
                          <span className="gallery-caption">
                            {cell.caption}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="section review-section" id="reviews">
            <div className="section-inner review-layout">
              <div className="rating-panel">
                <span className="eyebrow">06 / In their words</span>
                <h2 className="serif">
                  4.7<span style={{ fontSize: ".38em" }}>★</span>
                </h2>
                <div className="stars">★★★★★</div>
                <p className="rating-note">
                  From 2,451+ Google reviews
                  <br />
                  4.7 / 5 on Justdial
                </p>
                <button className="button text" onClick={() => setBooking("")}>
                  Join the conversation <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="review-list">
                <div className="review-card" key={reviews[reviewIndex].name}>
                  <div className="review-mark">“</div>
                  <blockquote>{reviews[reviewIndex].quote}</blockquote>
                  <div className="review-byline">
                    <span>{reviews[reviewIndex].name}</span>
                    <span>{reviews[reviewIndex].source}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  {reviews.map((review, index) => (
                    <button
                      key={review.name}
                      aria-label={`Show review ${index + 1}`}
                      onClick={() => setReviewIndex(index)}
                      style={{
                        width: 32,
                        height: 2,
                        border: 0,
                        padding: 0,
                        background:
                          index === reviewIndex
                            ? "var(--champagne)"
                            : "rgba(244,240,232,.25)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="section contact-section" id="contact">
            <div className="section-inner contact-grid">
              <div>
                <span className="eyebrow">07 / Come by</span>
                <h2 className="contact-title serif">
                  See you
                  <br />
                  <em>in the chair.</em>
                </h2>
                <button className="button" onClick={() => setBooking("")}>
                  Book an appointment <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="contact-list">
                <div className="contact-item">
                  <span>
                    <MapPin size={12} /> Find us
                  </span>
                  <p>
                    44UB, Chattori Lane,
                    <br />
                    Block UB, Jawahar Nagar,
                    <br />
                    Kamla Nagar, Delhi, 110007
                  </p>
                </div>
                <div className="contact-item">
                  <span>
                    <Phone size={12} /> Call the studio
                  </span>
                  <a href="tel:07503135104">075031 35104</a>
                </div>
                <div className="contact-item">
                  <span>
                    <Clock size={12} /> Opening hours
                  </span>
                  <p>Open daily · Closes 9 PM</p>
                </div>
              </div>
              <a
                className="map-card"
                href="https://maps.google.com/?q=The+Hair+Direction+Salon+Kamla+Nagar+Delhi"
                target="_blank"
                rel="noreferrer"
              >
                <div className="map-pin">
                  <span>H</span>
                </div>
                <div className="map-label">
                  Jawahar Nagar · Kamla Nagar · Open in maps{" "}
                  <ArrowUpRight size={11} />
                </div>
              </a>
            </div>
          </section>
        </main>
        <footer>
          <div className="footer-top">
            <div>
              <div className="wordmark footer-wordmark">
                <span className="wordmark-mark" />
                THE HAIR DIRECTION
              </div>
              <p className="footer-tagline">
                A little more direction for your hair.
              </p>
            </div>
            <div>
              <h3 className="footer-heading">Navigate</h3>
              <div className="footer-links">
                {[
                  ["Home", "home"],
                  ["Services", "services"],
                  ["Shop", "shop"],
                  ["Gallery", "gallery"],
                  ["About", "about"],
                  ["Reviews", "reviews"],
                  ["Contact", "contact"],
                ].map(([label, id]) => (
                  <a href={`#${id}`} key={id}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="footer-heading">Find us online</h3>
              <div className="footer-links">
                <a
                  href="https://instagram.com/thehairdirectionsalon"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram size={13} /> @thehairdirectionsalon
                </a>
                <a href="tel:07503135104">075031 35104</a>
                <span>
                  44UB, Chattori Lane
                  <br />
                  Kamla Nagar, Delhi 110007
                </span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} The Hair Direction Salon</span>
            <span>Designed for The Hair Direction Salon</span>
          </div>
        </footer>
        {booking !== null && (
          <BookingModal
            service={booking}
            serviceGroups={serviceGroups}
            onClose={() => setBooking(null)}
          />
        )}
      </div>
    </SmoothScroll>
  );
}

export default App;
