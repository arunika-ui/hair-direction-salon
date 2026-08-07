import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, Instagram, Phone, MapPin, Clock } from 'lucide-react';
import './index.css';

type Service = { name: string; description: string; price: string; duration: string };
type Group = { name: string; items: Service[] };

const images = {
  hero: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=85',
  colour: 'https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?auto=compress&cs=tinysrgb&w=900',
  cut: 'https://images.pexels.com/photos/3993301/pexels-photo-3993301.jpeg?auto=compress&cs=tinysrgb&w=900',
  extensions: 'https://images.pexels.com/photos/3993448/pexels-photo-3993448.jpeg?auto=compress&cs=tinysrgb&w=900',
  keratin: 'https://images.pexels.com/photos/3993464/pexels-photo-3993464.jpeg?auto=compress&cs=tinysrgb&w=900',
  detail: 'https://images.pexels.com/photos/3993300/pexels-photo-3993300.jpeg?auto=compress&cs=tinysrgb&w=1000',
  tools: 'https://images.pexels.com/photos/8534277/pexels-photo-8534277.jpeg?auto=compress&cs=tinysrgb&w=1000',
  interior: 'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=1000',
  product: 'https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=1000',
  mirror: 'https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=1000',
};

const groups: Group[] = [
  { name: 'Hair Cutting', items: [
    { name: 'Signature Haircut', duration: '45 min', price: '₹ 1,200', description: 'A considered cut, finished to move with you.' },
    { name: 'Shampoo & Blow Dry', duration: '35 min', price: '₹ 800', description: 'Polished volume and a soft, lasting finish.' },
    { name: 'Fringe / Bang Trim', duration: '20 min', price: '₹ 400', description: 'A small change with a precise point of view.' },
  ]},
  { name: 'Colour', items: [
    { name: 'Global Colour', duration: '2.5 hrs', price: '₹ 3,500', description: 'A rich, seamless all-over colour tailored to your tone.' },
    { name: 'Balayage / Highlights', duration: '3.5 hrs', price: '₹ 6,500', description: 'Hand-painted dimension with a beautifully grown-in finish.' },
    { name: 'Root Touch Up', duration: '90 min', price: '₹ 1,800', description: 'Quietly precise colour maintenance.' },
  ]},
  { name: 'Smoothing & Treatments', items: [
    { name: 'G.K Keratin', duration: '3 hrs', price: '₹ 5,500', description: 'Gloss, manageability and movement without the stiffness.' },
    { name: 'Keratin Treatment', duration: '3 hrs', price: '₹ 4,500', description: 'A smoothing ritual for softer, calmer texture.' },
    { name: 'Deep Conditioning Ritual', duration: '45 min', price: '₹ 1,500', description: 'A restorative treatment for thirsty, stressed strands.' },
  ]},
  { name: 'Styling', items: [
    { name: 'Classic Blowout', duration: '45 min', price: '₹ 1,000', description: 'Shape, shine and a finish that holds its intention.' },
    { name: 'Occasion Styling', duration: '75 min', price: '₹ 2,500', description: 'A tailored look for the nights worth remembering.' },
  ]},
  { name: 'Extensions', items: [
    { name: 'Extension Consultation', duration: '30 min', price: 'Complimentary', description: 'A private conversation about length, tone and fit.' },
    { name: 'Premium Hair Extensions', duration: '3 hrs', price: '₹ 12,000', description: 'Seamlessly matched volume and length, installed with care.' },
  ]},
  { name: 'Texture', items: [
    { name: 'Soft Perm', duration: '2.5 hrs', price: '₹ 4,500', description: 'A little more movement, a little less effort.' },
    { name: 'Curl Definition Ritual', duration: '60 min', price: '₹ 1,600', description: 'Shape and hydration for your natural texture.' },
  ]},
];

const featured = [
  { number: '01', title: 'Global Colour & Balayage', copy: 'Dimension, tone and a finish that feels entirely yours.', price: 'From ₹ 3,500', image: images.colour },
  { number: '02', title: 'Haircut & Styling', copy: 'The right shape changes how you carry a room.', price: 'From ₹ 1,200', image: images.cut },
  { number: '03', title: 'Hair Extensions', copy: 'Seamless length. Natural movement. No shortcuts.', price: 'From ₹ 12,000', image: images.extensions },
  { number: '04', title: 'G.K Keratin', copy: 'Gloss, ease and beautifully quiet texture.', price: 'From ₹ 5,500', image: images.keratin },
];

const reviews = [
  { quote: 'The colour consultation was thoughtful and the result is the most natural balayage I have ever had. Every detail felt considered.', name: 'Aarushi M.', source: 'Google review' },
  { quote: 'A beautiful salon with artists who genuinely listen. My haircut has grown out perfectly and still feels like me.', name: 'Nandini R.', source: 'Google review' },
  { quote: 'From the first welcome to the final finish, the experience felt calm, personal and wonderfully precise.', name: 'Rhea K.', source: 'Justdial review' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function BookingModal({ service, onClose }: { service: string; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="booking-modal" role="dialog" aria-modal="true" aria-label="Book an appointment">
        <button className="modal-close" onClick={onClose} aria-label="Close booking form"><X size={17} /></button>
        {!submitted ? <>
          <span className="eyebrow">A private appointment</span>
          <h2 className="serif">Make it yours.</h2>
          <p className="modal-intro">Tell us a little about your visit. Our team will call to confirm your appointment shortly.</p>
          <form className="booking-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <div className="form-row">
              <div className="form-field"><label htmlFor="name">Name</label><input id="name" required placeholder="Your name" /></div>
              <div className="form-field"><label htmlFor="phone">Phone</label><input id="phone" required type="tel" placeholder="+91" /></div>
            </div>
            <div className="form-field"><label htmlFor="service">Service</label><select id="service" defaultValue={service || 'Signature Haircut'}>{[...new Set(['Signature Haircut', ...featured.map((item) => item.title), ...groups.flatMap((group) => group.items.map((item) => item.name))])].map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="form-row">
              <div className="form-field"><label htmlFor="date">Preferred date</label><input id="date" required type="date" /></div>
              <div className="form-field"><label htmlFor="time">Preferred time</label><input id="time" required type="time" /></div>
            </div>
            <div className="form-field"><label htmlFor="notes">Notes</label><textarea id="notes" placeholder="Anything we should know?" /></div>
            <button className="button" type="submit">Request appointment <ArrowUpRight size={14} /></button>
          </form>
        </> : <div className="confirmation">
          <div className="confirm-mark"><span>✓</span></div>
          <h2 className="serif">Thank you — we'll confirm your appointment shortly</h2>
          <p>We look forward to welcoming you at The Hair Direction.</p>
          <button className="button text" onClick={onClose}>Close</button>
        </div>}
      </div>
    </div>
  );
}

function Nav({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 30); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const links = [['Home', 'home'], ['Services', 'services'], ['Gallery', 'gallery'], ['About', 'about'], ['Reviews', 'reviews'], ['Contact', 'contact']];
  return <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
    <a className="wordmark" href="#home" onClick={() => setOpen(false)}><span className="wordmark-mark" />THE HAIR DIRECTION</a>
    <div className={`nav-links ${open ? 'open' : ''}`}>{links.map(([label, id]) => <a className="nav-link" href={`#${id}`} key={id} onClick={() => setOpen(false)}>{label}</a>)}</div>
    <button className="button nav-book" onClick={onBook}>Book now <ArrowUpRight size={13} /></button>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
  </nav>;
}

function App() {
  const [booking, setBooking] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setReviewIndex((index) => (index + 1) % reviews.length), 6500); return () => window.clearInterval(timer); }, []);
  return <div className="site-shell">
    <Nav onBook={() => setBooking('')} />
    <main>
      <section className="hero" id="home">
        <div className="hero-media"><img src={images.hero} alt="Close crop of glossy waves in a salon light" /></div>
        <div className="hero-content reveal">
          <div className="hero-kicker eyebrow">An atelier for hair · Kamla Nagar, Delhi</div>
          <h1 className="serif">Experience<br />the <em>Art</em> of Hair</h1>
          <p className="hero-copy">A considered salon experience for hair that feels like you — only more so. Come in for the craft, stay for the feeling.</p>
          <div className="hero-actions"><button className="button" onClick={() => setBooking('')}>Book your visit <ArrowUpRight size={14} /></button><a className="button ghost" href="#services">Explore services</a></div>
        </div>
        <div className="hero-meta">44UB · Jawahar Nagar · Delhi 110007</div><a className="scroll-cue" href="#about">Scroll to discover</a>
      </section>

      <section className="section intro" id="about"><div className="section-inner intro-grid">
        <div><span className="eyebrow">01 / The Direction</span><h2 className="intro-title serif">Good hair<br /><em>has a point<br />of view.</em></h2></div>
        <p className="intro-copy">The Hair Direction is a salon in the heart of Kamla Nagar, Delhi, where <em>technical expertise</em> meets a distinctly personal approach. We believe your hair should not just look beautiful in the chair — it should live beautifully, too.</p>
        <div className="intro-aside"><strong className="serif">Since<br />2014</strong>We work with texture, tone and proportion to create hair that belongs to the person wearing it. No templates. No rush.</div>
      </div></section>

      <section className="section dark-section" id="services"><div className="section-inner">
        <div className="section-heading"><div><span className="eyebrow">02 / The edit</span><h2 className="serif">The signatures.</h2></div><p>Our most requested rituals, shaped by the way Delhi lives and the hair it brings with it.</p></div>
        <div className="featured-grid">{featured.map((item) => <article className="feature-card" key={item.title}><img src={item.image} loading="lazy" alt="" /><span className="feature-number">{item.number}</span><div className="feature-info"><h3 className="serif">{item.title}</h3><p>{item.copy}</p><div className="feature-bottom"><span className="price">{item.price}</span><button className="mini-book" onClick={() => setBooking(item.title)}>Book this</button></div></div></article>)}</div>
      </div></section>

      <section className="section services-section"><div className="section-inner">
        <div className="section-heading"><div><span className="eyebrow">03 / The full menu</span><h2 className="serif">Take your time.</h2></div><p>A complete menu of cuts, colour, care and finishing. Every service begins with a conversation.</p></div>
        <div className="service-menu">{groups.map((group, index) => <div className={`service-group ${activeGroup === index ? 'open' : ''}`} key={group.name}><button className="service-group-head" onClick={() => setActiveGroup(activeGroup === index ? -1 : index)}><h3>{group.name}</h3><span>+</span></button><div className="service-items"><div className="service-items-inner">{group.items.map((item) => <div className="service-item" key={item.name}><div className="service-name">{item.name}</div><div className="service-meta">{item.duration}</div><div className="service-price">{item.price}</div><div className="service-desc">{item.description}</div><button className="mini-book" onClick={() => setBooking(item.name)}>Book</button></div>)}</div></div></div>)}</div>
      </div></section>

      <section className="section gallery-section" id="gallery"><div className="section-inner">
        <div className="gallery-intro"><div><span className="eyebrow">04 / In the studio</span><h2 className="serif">Details<br />matter.</h2></div><p>Light on the mirror. The sound of scissors. A warm towel, a good conversation, an unhurried finish. The small things are the whole thing.</p></div>
        <div className="gallery-grid">
          <div className="gallery-cell"><img src={images.detail} loading="lazy" alt="Close detail of textured hair" /><span className="gallery-caption">Texture / light</span></div>
          <div className="gallery-cell"><img src={images.interior} loading="lazy" alt="Warm salon interior detail" /><span className="gallery-caption">The studio</span></div>
          <div className="gallery-cell"><img src={images.tools} loading="lazy" alt="Salon tools arranged on a work surface" /><span className="gallery-caption">The craft</span></div>
          <div className="gallery-cell"><img src={images.product} loading="lazy" alt="Haircare product flatlay" /><span className="gallery-caption">The ritual</span></div>
        </div>
      </div></section>

      <section className="section review-section" id="reviews"><div className="section-inner review-layout">
        <div className="rating-panel"><span className="eyebrow">05 / In their words</span><h2 className="serif">4.7<span style={{ fontSize: '.38em' }}>★</span></h2><div className="stars">★★★★★</div><p className="rating-note">From 2,451+ Google reviews<br />4.7 / 5 on Justdial</p><button className="button text" onClick={() => setBooking('')}>Join the conversation <ArrowUpRight size={13} /></button></div>
        <div className="review-list"><div className="review-card" key={reviews[reviewIndex].name}><div className="review-mark">“</div><blockquote>{reviews[reviewIndex].quote}</blockquote><div className="review-byline"><span>{reviews[reviewIndex].name}</span><span>{reviews[reviewIndex].source}</span></div></div><div style={{ display: 'flex', gap: 8, marginTop: 18 }}>{reviews.map((review, index) => <button key={review.name} aria-label={`Show review ${index + 1}`} onClick={() => setReviewIndex(index)} style={{ width: 32, height: 2, border: 0, padding: 0, background: index === reviewIndex ? 'var(--champagne)' : 'rgba(244,240,232,.25)' }} />)}</div></div>
      </div></section>

      <section className="section contact-section" id="contact"><div className="section-inner contact-grid">
        <div><span className="eyebrow">06 / Come by</span><h2 className="contact-title serif">See you<br /><em>in the chair.</em></h2><button className="button" onClick={() => setBooking('')}>Book an appointment <ArrowUpRight size={14} /></button></div>
        <div className="contact-list"><div className="contact-item"><span><MapPin size={12} /> Find us</span><p>44UB, Chattori Lane,<br />Block UB, Jawahar Nagar,<br />Kamla Nagar, Delhi, 110007</p></div><div className="contact-item"><span><Phone size={12} /> Call the studio</span><a href="tel:07503135104">075031 35104</a></div><div className="contact-item"><span><Clock size={12} /> Opening hours</span><p>Open daily · Closes 9 PM</p></div></div>
        <a className="map-card" href="https://maps.google.com/?q=The+Hair+Direction+Salon+Kamla+Nagar+Delhi" target="_blank" rel="noreferrer"><div className="map-pin"><span>H</span></div><div className="map-label">Jawahar Nagar · Kamla Nagar · Open in maps <ArrowUpRight size={11} /></div></a>
      </div></section>
    </main>
    <footer><div className="footer-top"><div><div className="wordmark footer-wordmark"><span className="wordmark-mark" />THE HAIR DIRECTION</div><p className="footer-tagline">A little more direction for your hair.</p></div><div><h3 className="footer-heading">Navigate</h3><div className="footer-links">{[['Home','home'],['Services','services'],['Gallery','gallery'],['About','about'],['Reviews','reviews'],['Contact','contact']].map(([label,id]) => <a href={`#${id}`} key={id}>{label}</a>)}</div></div><div><h3 className="footer-heading">Find us online</h3><div className="footer-links"><a href="https://instagram.com/thehairdirectionsalon" target="_blank" rel="noreferrer"><Instagram size={13} /> @thehairdirectionsalon</a><a href="tel:07503135104">075031 35104</a><span>44UB, Chattori Lane<br />Kamla Nagar, Delhi 110007</span></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} The Hair Direction Salon</span><span>Designed for The Hair Direction Salon</span></div></footer>
    {booking !== null && <BookingModal service={booking} onClose={() => setBooking(null)} />}
  </div>;
}

export default App;