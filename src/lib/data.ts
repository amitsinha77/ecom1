import { Sparkles, Chrome as Home, Building2, KeyRound, ShieldCheck, Clock, HeartHandshake, Star, MapPin, Phone, Mail, Calendar } from "lucide-react";

export const SITE = {
  name: "PureMaids",
  domain: "puremaids.co.uk",
  phone: "0800 123 4567",
  phoneHref: "tel:08001234567",
  email: "hello@puremaids.co.uk",
  emailHref: "mailto:hello@puremaids.co.uk",
  address: "PureMaids HQ, 71-75 Shelton Street, London, WC2H 9JQ",
  rating: 4.9,
  reviewCount: 2148,
};

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: typeof Home;
  image: string;
  features: string[];
  priceFrom: number;
  duration: string;
};

export const SERVICES: Service[] = [
  {
    slug: "domestic-cleaning",
    title: "Domestic Cleaning",
    shortTitle: "Domestic",
    tagline: "A spotless home, every week",
    description:
      "Regular weekly or fortnightly cleaning tailored to your home. The same trusted cleaner, every visit, for a consistently pristine home.",
    icon: Home,
    image:
      "https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Same trusted cleaner each visit",
      "Eco-friendly products included",
      "Flexible weekly or fortnightly plans",
      "Fully insured & vetted",
    ],
    priceFrom: 28,
    duration: "2-4 hours",
  },
  {
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    shortTitle: "Deep Clean",
    tagline: "Top-to-bottom sparkle",
    description:
      "A thorough, detailed clean of every surface, corner, and appliance. Perfect for spring cleans, post-renovation, or when you need that brand-new feeling.",
    icon: Sparkles,
    image:
      "https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Every surface, inside & out",
      "Appliance descaling & degreasing",
      "Skirting, frames & light fittings",
      "Ideal for spring or post-build",
    ],
    priceFrom: 145,
    duration: "4-8 hours",
  },
  {
    slug: "end-of-tenancy-cleaning",
    title: "End of Tenancy Cleaning",
    shortTitle: "End of Tenancy",
    tagline: "Get your deposit back",
    description:
      "Guaranteed landlord-approved cleaning. We cover every inch so you can hand back the keys with confidence and secure your full deposit.",
    icon: KeyRound,
    image:
      "https://images.pexels.com/photos/4239026/pexels-photo-4239026.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Deposit-back guarantee",
      "Inventory checklist included",
      "Carpet & oven cleaning available",
      "72-hour re-clean promise",
    ],
    priceFrom: 199,
    duration: "4-10 hours",
  },
  {
    slug: "office-cleaning",
    title: "Office Cleaning",
    shortTitle: "Office",
    tagline: "A healthier workplace",
    description:
      "Reliable, discreet commercial cleaning for offices, clinics, and retail. Daily, weekly, or one-off contracts tailored to your business hours.",
    icon: Building2,
    image:
      "https://images.pexels.com/photos/3801469/pexels-photo-3801469.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Out-of-hours cleaning",
      "DBS-checked cleaning teams",
      "Sanitisation & disinfection",
      "Flexible business contracts",
    ],
    priceFrom: 35,
    duration: "Custom",
  },
];

export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    location: "Manchester",
    rating: 5,
    text: "PureMaids have transformed our home. Our cleaner Emma is lovely and always on time. The booking system is so easy and the results are genuinely spotless every single week.",
    service: "Domestic Cleaning",
    initials: "SM",
  },
  {
    name: "James O'Connor",
    location: "Leeds",
    rating: 5,
    text: "We used PureMaids for an end of tenancy clean and got our full deposit back within 48 hours. Professional, thorough, and worth every penny. Highly recommend.",
    service: "End of Tenancy",
    initials: "JO",
  },
  {
    name: "Priya Patel",
    location: "Birmingham",
    rating: 5,
    text: "The deep clean was incredible. They reached places I didn't even know existed. The team was respectful of our home and the eco products smell amazing.",
    service: "Deep Cleaning",
    initials: "PP",
  },
  {
    name: "David Thompson",
    location: "Bristol",
    rating: 5,
    text: "Our office has never looked better. Reliable, discreet, and the communication is excellent. The team genuinely care about doing a great job.",
    service: "Office Cleaning",
    initials: "DT",
  },
  {
    name: "Hannah Roberts",
    location: "London",
    rating: 5,
    text: "I was nervous about having someone in my home but the vetting process put me at ease. Our cleaner is now part of the family. Best decision I've made.",
    service: "Domestic Cleaning",
    initials: "HR",
  },
  {
    name: "Michael Brown",
    location: "Edinburgh",
    rating: 5,
    text: "Booked a deep clean before our baby arrived. The attention to detail was outstanding and they used baby-safe products. Couldn't be happier.",
    service: "Deep Cleaning",
    initials: "MB",
  },
];

export type GoogleReview = {
  name: string;
  initials: string;
  rating: number;
  text: string;
  time: string;
};

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: "Rebecca Lawson",
    initials: "RL",
    rating: 5,
    text: "Absolutely brilliant service. Punctual, friendly, and my house has never been cleaner. The online booking is so convenient.",
    time: "2 weeks ago",
  },
  {
    name: "Tom Wilson",
    initials: "TW",
    rating: 5,
    text: "Fantastic end of tenancy clean. Landlord was impressed and deposit returned in full. Would use again without hesitation.",
    time: "1 month ago",
  },
  {
    name: "Aisha Khan",
    initials: "AK",
    rating: 5,
    text: "Reliable, trustworthy and thorough. Our regular cleaner is wonderful with the kids and our dog. Highly recommend PureMaids.",
    time: "1 month ago",
  },
  {
    name: "Chris Evans",
    initials: "CE",
    rating: 5,
    text: "Great value for money. The quote was instant and accurate, no hidden charges. The clean itself was impeccable.",
    time: "2 months ago",
  },
];

export type FAQItem = { q: string; a: string };

export const FAQ_ITEMS: FAQItem[] = [
  {
    q: "Are your cleaners insured and vetted?",
    a: "Yes. Every PureMaids cleaner is fully DBS-checked, reference-verified, and covered by our £2 million public liability insurance. Your safety and peace of mind come first.",
  },
  {
    q: "Will I get the same cleaner every visit?",
    a: "For regular domestic cleaning, yes. We assign a dedicated cleaner to your home so they learn your preferences and you build trust. If they're ever unavailable, we'll send a vetted cover cleaner.",
  },
  {
    q: "Do I need to provide cleaning products or equipment?",
    a: "No. Our cleaners arrive with eco-friendly products and professional equipment. If you prefer we use your own supplies, just let us know — we're happy to accommodate.",
  },
  {
    q: "How do I get an instant quote?",
    a: "Use the quote calculator at the top of any page. Select your service, property size, and frequency to see your price instantly. No phone calls or waiting required.",
  },
  {
    q: "What is your cancellation policy?",
    a: "You can pause or cancel a regular cleaning plan anytime with 7 days' notice. One-off cleans can be rescheduled free of charge up to 48 hours before the appointment.",
  },
  {
    q: "Which areas do you cover?",
    a: "We operate across major UK cities including London, Manchester, Birmingham, Leeds, Bristol, Edinburgh, Glasgow, Liverpool, Sheffield, and Newcastle. Check our Areas We Cover page for full postcode coverage.",
  },
  {
    q: "How do I pay?",
    a: "We accept all major debit and credit cards via Stripe, our secure payment processor. Regular customers can set up hassle-free recurring payments.",
  },
  {
    q: "Do you offer a satisfaction guarantee?",
    a: "Absolutely. If you're not 100% happy with any clean, tell us within 48 hours and we'll return to put it right, free of charge. Your satisfaction is guaranteed.",
  },
];

export type Area = {
  name: string;
  postcodes: string[];
  image: string;
};

export const AREAS: Area[] = [
  {
    name: "London",
    postcodes: ["N", "E", "SE", "SW", "W", "NW", "EC", "WC"],
    image:
      "https://images.pexels.com/photos/1513907/pexels-photo-1513907.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Manchester",
    postcodes: ["M1-M40", "SK", "OL"],
    image:
      "https://images.pexels.com/photos/5693562/pexels-photo-5693562.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Birmingham",
    postcodes: ["B1-B75", "DY"],
    image:
      "https://images.pexels.com/photos/5693549/pexels-photo-5693549.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Leeds",
    postcodes: ["LS1-LS29", "WF"],
    image:
      "https://images.pexels.com/photos/5693552/pexels-photo-5693552.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Bristol",
    postcodes: ["BS1-BS35", "BA"],
    image:
      "https://images.pexels.com/photos/5693555/pexels-photo-5693555.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Edinburgh",
    postcodes: ["EH1-EH55"],
    image:
      "https://images.pexels.com/photos/5693558/pexels-photo-5693558.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export type GalleryImage = {
  before: string;
  after: string;
  label: string;
};

export const GALLERY: GalleryImage[] = [
  {
    before:
      "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800",
    after:
      "https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=800",
    label: "Kitchen Deep Clean",
  },
  {
    before:
      "https://images.pexels.com/photos/4108714/pexels-photo-4108714.jpeg?auto=compress&cs=tinysrgb&w=800",
    after:
      "https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=800",
    label: "Bathroom Restoration",
  },
  {
    before:
      "https://images.pexels.com/photos/4108718/pexels-photo-4108718.jpeg?auto=compress&cs=tinysrgb&w=800",
    after:
      "https://images.pexels.com/photos/4239026/pexels-photo-4239026.jpeg?auto=compress&cs=tinysrgb&w=800",
    label: "Living Room Refresh",
  },
];

export type Plan = {
  name: string;
  price: number;
  frequency: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Weekly Clean",
    price: 28,
    frequency: "per hour",
    description: "Our most popular plan for a consistently spotless home.",
    features: [
      "Dedicated regular cleaner",
      "Same visit day each week",
      "Eco-friendly products",
      "Online account management",
      "Pause or cancel anytime",
    ],
    popular: true,
  },
  {
    name: "Fortnightly Clean",
    price: 32,
    frequency: "per hour",
    description: "Great value cleaning every two weeks.",
    features: [
      "Dedicated regular cleaner",
      "Consistent visit schedule",
      "Eco-friendly products",
      "Online account management",
      "Pause or cancel anytime",
    ],
  },
  {
    name: "One-Off Clean",
    price: 145,
    frequency: "per clean",
    description: "A single deep clean for special occasions.",
    features: [
      "Full team of cleaners",
      "Top-to-bottom detail",
      "Appliance cleaning included",
      "Flexible scheduling",
      "48-hour satisfaction guarantee",
    ],
  },
];

export const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Fully Insured", sub: "£2m public liability" },
  { icon: HeartHandshake, label: "Vetted Cleaners", sub: "DBS-checked" },
  { icon: Star, label: "4.9/5 Rated", sub: "2,100+ reviews" },
  { icon: Clock, label: "Same Cleaner", sub: "Every visit" },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Get Your Instant Quote",
    description:
      "Tell us your home size and cleaning needs. Get a transparent price in seconds — no phone call required.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Book Your Cleaner",
    description:
      "Pick a date and time that suits you. We'll match you with a vetted, insured cleaner for your area.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "Relax & Enjoy",
    description:
      "Your cleaner arrives on time and gets to work. Come home to a spotless space, every time.",
    icon: Home,
  },
];

export const STATS = [
  { value: "50,000+", label: "Cleans Completed" },
  { value: "2,148", label: "5-Star Reviews" },
  { value: "180+", label: "Vetted Cleaners" },
  { value: "12", label: "UK Cities Covered" },
];

export const CONTACT_INFO = [
  { icon: Phone, label: "Call Us", value: SITE.phone, href: SITE.phoneHref },
  { icon: Mail, label: "Email Us", value: SITE.email, href: SITE.emailHref },
  {
    icon: MapPin,
    label: "Visit Us",
    value: SITE.address,
    href: "#",
  },
];
