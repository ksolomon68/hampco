import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Heart,
  Info,
  Layers,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  Unlock,
  Upload,
  User,
  Users,
  X,
  Eye,
  BookMarked,
  HelpCircle,
  FileText,
  AlertTriangle,
  LogOut,
  Sliders,
  Handshake,
  Copy
} from 'lucide-react';

const supabase = createClient(
  'https://ftzjxryhothsrmpiadyw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0emp4cnlob3Roc3JtcGlhZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTUxOTAsImV4cCI6MjA5NjY5MTE5MH0.5HjZk2ZqkdSEPc-f0XoHftXvBAvLibeVNGaZ-xlsS5Y'
);

// --- SEED / DEFAULT DATA ---

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  return new Date(dateStr);
};

const DEFAULT_POPUP = {
  enabled: false,
  title: "2026 Scholarship Application Deadline",
  message: "Attention students and families! HAMPCO, Inc. is now accepting scholarship applications for 2026. Ten $1,500.00 scholarships will be awarded to high school seniors in Senate District 34. All completed packets must be submitted to the HAMPCO Office by March 31, 2026.",
  buttonText: "Download Application Guidelines",
  buttonLink: "#scholarships",
  bgColor: "red" // red, black, blue, slate
};

const DEFAULT_EVENTS = [
  {
    id: "e1",
    title: "Summer Youth Art Classes",
    date: "2026-06-15",
    endDate: "2026-07-20",
    time: "1:00 - 3:00 PM",
    location: "HAMPCO Office, Monroe, LA",
    description: "Nurturing the creative minds of youth ages 8-15 through immersive painting, sculpture, and sketching instruction. Materials and refreshments are fully provided.",
    category: "Arts & Culture"
  },
  {
    id: "e2",
    title: "5 Steps to a Healthier You",
    date: "2026-07-02",
    endDate: "2026-07-02",
    time: "Various Times",
    location: "Various locations - See schedule",
    description: "An interactive community wellness program detailing the 5 steps to a healthier you. Classes are held at various times and locations.",
    category: "Health & Nutrition"
  },
  {
    id: "e3",
    title: "Teen & Family Financial Literacy Seminar",
    date: "2026-07-18",
    endDate: "2026-07-18",
    time: "10:00 AM - 12:00 PM",
    location: "HAMPCO Office, 1116 Jackson Street",
    description: "Mastering life skills including balancing a checkbook, high-yield savings plans, budgeting basics, and smart debt avoidance for teens and parents.",
    category: "Education & Skills"
  },
  {
    id: "e4",
    title: "Diamonds in the Rough: Leadership Circle",
    date: "2026-08-05",
    endDate: "2026-08-05",
    time: "11:00 AM - 1:30 PM",
    location: "HAMPCO Headquarters, Monroe, LA",
    description: "An elegant mentorship module addressing social etiquette, business introductions, confident job interviews, table manners, and self-presentation.",
    category: "Leadership"
  },
  {
    id: "e5",
    title: "Academic Heritage Quiz Bowl XIV",
    date: "2026-01-31",
    endDate: "2026-01-31",
    time: "TBA",
    location: "Jefferson Elementary School, Monroe, LA",
    description: "HAMPCO's 14th Annual Academic Heritage Quiz Bowl — celebrating academic excellence and cultural heritage for District 34 students. Participants compete in knowledge challenges across multiple disciplines.",
    category: "Education & Skills"
  },
  {
    id: "e6",
    title: "Walk Around the Block for Autism",
    date: "2026-04-04",
    endDate: "2026-04-04",
    time: "All Day",
    location: "Monroe, LA",
    description: "Wanda's Abounding Grace presents the Walk Around the Block for Autism — a 5K fun run and community festival hosted in partnership with HAMPCO, Inc. Join us in raising awareness and support for the autism community.",
    category: "Health & Nutrition"
  },
  { 
    id: "fl_w1", 
    title: "Financial Literacy – Registration & Orientation / Week 1", 
    date: "2026-06-16", 
    endDate: "2026-06-16", 
    time: "5:30 PM", 
    location: "HAMPCO, INC., 1116 Jackson Street, Monroe, LA 71202", 
    description: "Orientation & Topics: Money Matters – Budgeting, Money Matter – budgeting Review (Bio Part 2). All classes held at HAMPCO, INC. Call 318 361-2050 and ask for Irma or Mary.", 
    category: "Education & Skills" 
  },
  { 
    id: "fl_w2", 
    title: "Financial Literacy – Week 2: Financial Goals Review", 
    date: "2026-06-23", 
    endDate: "2026-06-23", 
    time: "5:30 PM", 
    location: "HAMPCO, INC., 1116 Jackson Street, Monroe, LA 71202", 
    description: "Topics: Financial Goals Review – Scams – Prevent Financial Exploitation. All classes held at HAMPCO, INC. Call 318 361-2050 and ask for Irma or Mary.", 
    category: "Education & Skills" 
  },
  { 
    id: "fl_w3", 
    title: "Financial Literacy – Week 3: Owning Your Own Home", 
    date: "2026-06-30", 
    endDate: "2026-06-30", 
    time: "5:30 PM", 
    location: "HAMPCO, INC., 1116 Jackson Street, Monroe, LA 71202", 
    description: "Topics: Owning your own HOME – Grants, Escrow, Taxes & Insurance. Guest speakers: Brenda & Ellen Hill & Ginger McGrew. All classes held at HAMPCO, INC.", 
    category: "Education & Skills" 
  },
  { 
    id: "fl_w4", 
    title: "Financial Literacy – Week 4: Pay Yourself First", 
    date: "2026-07-07", 
    endDate: "2026-07-07", 
    time: "5:30 PM", 
    location: "HAMPCO, INC., 1116 Jackson Street, Monroe, LA 71202", 
    description: "Topics: Pay Yourself First – How & when to save – Investments. Guest speaker: Blake. All classes held at HAMPCO, INC.", 
    category: "Education & Skills" 
  },
  { 
    id: "fl_w5", 
    title: "Financial Literacy – Week 5: Understanding Credit & Personal Statements", 
    date: "2026-07-14", 
    endDate: "2026-07-14", 
    time: "5:30 PM", 
    location: "HAMPCO, INC. (Oliver Rd), 1116 Jackson Street, Monroe, LA 71202", 
    description: "Topics: Understanding your Credit Report – Preparing A Personal Financial Statement. Guest speakers: Bankers in Retail, Commercial & Business Banking of First Horizon – One on One with Students. All classes held at HAMPCO, INC.", 
    category: "Education & Skills" 
  },
  { 
    id: "fl_w6", 
    title: "Financial Literacy – Week 6: Bank On It", 
    date: "2026-07-21", 
    endDate: "2026-07-21", 
    time: "5:30 PM", 
    location: "HAMPCO, INC., 1116 Jackson Street, Monroe, LA 71202", 
    description: "Topics: Bank On It – How to Handle A checking Account. All classes held at HAMPCO, INC.", 
    category: "Education & Skills" 
  },
  { 
    id: "fl_w7", 
    title: "Financial Literacy – Week 7: Legal Terms & Matters in Banking", 
    date: "2026-07-28", 
    endDate: "2026-07-28", 
    time: "5:30 PM", 
    location: "HAMPCO, INC., 1116 Jackson Street, Monroe, LA 71202", 
    description: "Topics: Understanding Legal Terms/Matters in Banking – Questions on POA, POD on accounts, Disability-SSI, Wills, Estates, inherited real estate, adjudicated real estate, etc. Guest speakers: Brenda & Guest Attorney. All classes held at HAMPCO, INC.", 
    category: "Education & Skills" 
  },
  { 
    id: "fl_w8", 
    title: "Financial Literacy – Week 8: Review", 
    date: "2026-08-04", 
    endDate: "2026-08-04", 
    time: "5:30 PM", 
    location: "HAMPCO, INC., 1116 Jackson Street, Monroe, LA 71202", 
    description: "Topics: Review – Pick up invites & gowns. All classes held at HAMPCO, INC.", 
    category: "Education & Skills" 
  },
  {
    id: "fl_grad",
    title: "Financial Literacy Graduation Ceremony",
    date: "2026-08-15",
    endDate: "2026-08-15",
    time: "9:00 AM (Graduates arrive at 8:00 AM)",
    location: "Mt. Zion Family Life Center, Monroe, LA 71202",
    description: "After completion of the classes, a graduation ceremony will be held for the participants & their Guest. Place: Mt. Zion Family Life Center. Graduates arrive at 8:00 a.m. for photos - the ceremony begins at 9:00 a.m. (SHARP)",
    category: "Education & Skills"
  }
];

const DEFAULT_GALLERIES = [
  {
    id: "g1",
    title: "Community Events & Outreach",
    description: "Highlights from HAMPCO's ongoing community outreach, partnership events, and program activities across Monroe and District 34.",
    coverImage: "https://hampcoinc.org/assets/images/mbr-1-1145x763.jpeg",
    images: [
      { id: "img1", url: "https://hampcoinc.org/assets/images/mbr-1-1145x763.jpeg", title: "HAMPCO Community Program" },
      { id: "img2", url: "https://hampcoinc.org/assets/images/241098519663670581.jpg-1145x859.jpeg", title: "Community Outreach Event" },
      { id: "img3", url: "https://hampcoinc.org/assets/images/7847306721117133195.jpg-1151x863.jpeg", title: "Program Activity Session" },
      { id: "img4", url: "https://hampcoinc.org/assets/images/20230211-105618-1224x569.jpeg", title: "HAMPCO Community Gathering" }
    ]
  },
  {
    id: "g2",
    title: "Diamonds in the Rough",
    description: "Youth learning essential social etiquette, cooking skills, financial basics, handwriting, and leadership traits through the Diamonds in the Rough program.",
    coverImage: "https://hampcoinc.org/assets/images/diamonds-welcome.jpg-1151x863.jpeg",
    images: [
      { id: "img5", url: "https://hampcoinc.org/assets/images/diamonds-welcome.jpg-1151x863.jpeg", title: "Welcome & Orientation" },
      { id: "img6", url: "https://hampcoinc.org/assets/images/diamonds-cooking-1.jpg-1151x1535.jpeg", title: "Cooking Skills Workshop" },
      { id: "img7", url: "https://hampcoinc.org/assets/images/diamonds-cooking-activity.jpg-1151x1535.jpeg", title: "Hands-On Cooking Activity" }
    ]
  },
  {
    id: "g3",
    title: "2025 Scholarship Recipients",
    description: "Celebrating HAMPCO's 2025 scholarship award recipients and their remarkable academic achievements across Senate District 34.",
    coverImage: "https://hampcoinc.org/assets/images/2025-hampco-scholarship-recipients.png-1260x1890.png",
    images: [
      { id: "img8", url: "https://hampcoinc.org/assets/images/2025-hampco-scholarship-recipients.png-1260x1890.png", title: "2025 Scholarship Recipients" },
      { id: "img9", url: "https://hampcoinc.org/assets/images/3076924166095057197.jpg-1080x1440.jpeg", title: "Scholarship Ceremony" },
      { id: "img10", url: "https://hampcoinc.org/assets/images/3289226372557020078-1.jpg-1080x1440.jpeg", title: "Award Presentation" },
      { id: "img11", url: "https://hampcoinc.org/assets/images/6401712878863134708.jpg-1151x1535.jpeg", title: "Recipients Group Photo" },
      { id: "img12", url: "https://hampcoinc.org/assets/images/8830806826656549172.jpg-1080x1440.jpeg", title: "Scholarship Celebration" },
      { id: "img13", url: "https://hampcoinc.org/assets/images/2815443489463160275.jpg-1151x1535.jpeg", title: "Class of 2025 Honorees" }
    ]
  }
];

export default function App() {
  // --- STATE ---
  const [popup, setPopup] = useState(() => {
    const saved = localStorage.getItem('hampco_popup');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Safeguard: Convert old colors 'emerald' or 'amber' to brand-new 'red' color
      if (parsed.bgColor === 'emerald' || parsed.bgColor === 'amber') {
        parsed.bgColor = 'red';
      }
      // Force disable old scholarship announcement
      parsed.enabled = false;
      return parsed;
    }
    return { ...DEFAULT_POPUP, enabled: false };
  });
  
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('hampco_events');
    if (saved) {
      let parsed: any[] = JSON.parse(saved);
      // Migrate: filter out old events to force reload updated versions
      parsed = parsed.filter((e: any) => e.id !== 'e7' && e.id !== 'e1' && e.id !== 'e2' && !e.id.startsWith('fl_'));
      const savedIds = new Set(parsed.map((e: any) => e.id));
      const missing = DEFAULT_EVENTS.filter(e => !savedIds.has(e.id));
      return missing.length > 0 ? [...parsed, ...missing] : parsed;
    }
    return DEFAULT_EVENTS;
  });

  const [galleries, setGalleries] = useState(() => {
    const saved = localStorage.getItem('hampco_galleries');
    return saved ? JSON.parse(saved) : DEFAULT_GALLERIES;
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState("");
  
  // Navigation active state
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Gallery view controls
  const [selectedGalleryId, setSelectedGalleryId] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Admin states for adding/editing
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "", date: "", endDate: "", time: "", location: "", description: "", category: "General"
  });

  const [newGallery, setNewGallery] = useState({
    title: "", description: "", coverImage: ""
  });
  const [activeAdminGalleryId, setActiveAdminGalleryId] = useState("");
  const [newImage, setNewImage] = useState({ url: "", title: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editingImage, setEditingImage] = useState<{ galleryId: string; imageId: string; title: string; url: string } | null>(null);
  const [expandedGalleryId, setExpandedGalleryId] = useState<string>("");

  // Contact form submission feedback
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem('hampco_popup', JSON.stringify(popup));
  }, [popup]);

  useEffect(() => {
    localStorage.setItem('hampco_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('hampco_galleries', JSON.stringify(galleries));
  }, [galleries]);

  // Trigger popup modal on load if enabled
  useEffect(() => {
    if (popup.enabled) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [popup.enabled]);

  // Reveal admin panel only when URL hash is #admin
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminMode(true);
        setTimeout(() => {
          document.getElementById('admin-panel')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Scroll-reveal: add .visible to .reveal* elements when they enter the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll to section helper
  const scrollToSection = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- ADMIN ACTIONS ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin" || adminPassword === "hampco2026") {
      setAdminAuthenticated(true);
      setAdminError("");
    } else {
      setAdminError("Invalid authorization code. Use 'admin' to try the system.");
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAdminPassword("");
    setIsAdminMode(false);
    history.replaceState(null, '', window.location.pathname);
    scrollToSection('home');
  };

  // Popup configuration updates
  const updatePopupConfig = (field, value) => {
    setPopup(prev => ({ ...prev, [field]: value }));
  };

  // Event actions
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.description) {
      alert("Please enter title, date, and description.");
      return;
    }

    if (editingEventId) {
      setEvents(prev => prev.map(evt => evt.id === editingEventId ? { ...newEvent, id: editingEventId } : evt));
      setEditingEventId(null);
    } else {
      const added = { ...newEvent, id: "event_" + Date.now() };
      setEvents(prev => [added, ...prev]);
    }

    // Reset fields
    setNewEvent({ title: "", date: "", endDate: "", time: "", location: "", description: "", category: "General" });
  };

  const handleEditEventClick = (evt) => {
    setEditingEventId(evt.id);
    setNewEvent({ ...evt });
    scrollToSection("admin-panel");
  };

  const handleDeleteEvent = (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(evt => evt.id !== id));
    }
  };

  const handleDuplicateEvent = (evt) => {
    const copy = { ...evt, id: "event_" + Date.now(), title: evt.title + " (Copy)" };
    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === evt.id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  // Gallery actions
  const handleCreateGallery = (e) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.description) {
      alert("Please fill in the gallery title and description.");
      return;
    }
    const cover = newGallery.coverImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";
    const addedGallery = {
      id: "gal_" + Date.now(),
      title: newGallery.title,
      description: newGallery.description,
      coverImage: cover,
      images: []
    };
    setGalleries(prev => [...prev, addedGallery]);
    setActiveAdminGalleryId(addedGallery.id);
    setNewGallery({ title: "", description: "", coverImage: "" });
  };

  const handleDeleteGallery = (id) => {
    if (confirm("Are you sure you want to delete this entire gallery?")) {
      setGalleries(prev => prev.filter(g => g.id !== id));
      if (selectedGalleryId === id) setSelectedGalleryId("all");
      if (activeAdminGalleryId === id) setActiveAdminGalleryId("");
    }
  };

  const handleAddImageToGallery = (e) => {
    e.preventDefault();
    if (!activeAdminGalleryId) {
      alert("Please select a gallery to add photos to.");
      return;
    }
    if (!newImage.url || !newImage.title) {
      alert("Please enter photo URL and a caption.");
      return;
    }

    setGalleries(prev => prev.map(gal => {
      if (gal.id === activeAdminGalleryId) {
        return {
          ...gal,
          images: [...gal.images, { id: "img_" + Date.now(), url: newImage.url, title: newImage.title }]
        };
      }
      return gal;
    }));

    setNewImage({ url: "", title: "" });
  };

  const handleSaveImageEdit = () => {
    if (!editingImage) return;
    setGalleries(prev => prev.map(gal =>
      gal.id !== editingImage.galleryId ? gal : {
        ...gal,
        images: gal.images.map(img =>
          img.id !== editingImage.imageId ? img : { ...img, title: editingImage.title, url: editingImage.url }
        )
      }
    ));
    setEditingImage(null);
  };

  const handleDeleteImageFromGallery = (galleryId, imageId) => {
    if (confirm("Remove this image?")) {
      setGalleries(prev => prev.map(gal => {
        if (gal.id === galleryId) {
          return {
            ...gal,
            images: gal.images.filter(img => img.id !== imageId)
          };
        }
        return gal;
      }));
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `gallery/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    setUploadingImage(true);
    setUploadError("");

    try {
      const { data, error } = await supabase.storage
        .from('gallery-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (error) {
        setUploadError(
          error.message.toLowerCase().includes('bucket')
            ? 'Storage not configured. Create a public bucket named "gallery-images" in your Supabase dashboard, then enable public uploads under Storage > Policies.'
            : `Upload failed: ${error.message}`
        );
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch {
      setUploadError("Upload failed. Please check your internet connection and Supabase storage setup.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper to determine popup colors reflecting brand redesign
  const getPopupColorClasses = (color) => {
    switch (color) {
      case 'red':
      case 'emerald':
      case 'rose':
        return {
          bg: 'bg-red-600',
          btn: 'bg-red-600 hover:bg-red-700 text-white',
          badge: 'bg-red-100 text-red-800'
        };
      case 'blue':
        return {
          bg: 'bg-blue-700',
          btn: 'bg-blue-700 hover:bg-blue-800 text-white',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'slate':
        return {
          bg: 'bg-slate-800',
          btn: 'bg-slate-800 hover:bg-slate-900 text-white',
          badge: 'bg-slate-100 text-slate-800'
        };
      case 'black':
      case 'amber':
      default:
        return {
          bg: 'bg-neutral-950',
          btn: 'bg-neutral-900 hover:bg-black text-white border border-neutral-700',
          badge: 'bg-neutral-100 text-neutral-900'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* --- TOP ANNOUNCEMENT BAR --- */}
      <div className="bg-neutral-950 text-slate-200 text-xs py-2.5 px-4 flex justify-between items-center z-40 border-b border-neutral-800">
        <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Alert</span>
          <span className="truncate text-slate-300">
            {popup.enabled ? `${popup.title}: ${popup.message.substring(0, 80)}...` : "Welcome to the new official portal of HAMPCO, Inc."}
          </span>
        </div>
        <div className="flex items-center space-x-4 ml-4 shrink-0">
          {popup.enabled && (
            <button 
              onClick={() => setShowPopup(true)} 
              className="underline text-red-400 hover:text-red-300 font-semibold whitespace-nowrap"
            >
              View Full Announcement
            </button>
          )}
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-250 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand using uploaded asset with styled CSS fallback */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection("home")}>
            <div className="relative group">
              <img 
                src="hampco-logo-128x38.png" 
                alt="HAMPCO, Inc. Logo" 
                className="h-12 sm:h-14 md:h-16 object-contain transition-transform group-hover:scale-102"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallbackEl = document.getElementById('brand-fallback');
                  if (fallbackEl) fallbackEl.style.display = 'flex';
                }}
              />
              {/* Fallback component rendering when logo image is missing/not loaded */}
              <div id="brand-fallback" style={{ display: 'none' }} className="items-center space-x-3">
                <div className="w-11 h-11 bg-neutral-950 rounded-xl flex items-center justify-center text-white border-b-4 border-red-600">
                  <span className="font-extrabold text-lg text-white">H</span>
                </div>
                <div>
                  <h1 className="text-xl font-black text-neutral-950 tracking-tight leading-none">
                    HAMPCO <span className="text-red-600">Inc.</span>
                  </h1>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                    Building Stronger Communities
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-1">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "programs", label: "Programs" },
              { id: "partners", label: "Partners" },
              { id: "events", label: "Events" },
              { id: "gallery", label: "Galleries" },
              { id: "contact", label: "Contact Us" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-extrabold tracking-wide transition-all ${
                  activeTab === tab.id 
                    ? "bg-red-50 text-red-700 border-b-2 border-red-600 rounded-b-none" 
                    : "text-neutral-700 hover:text-red-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <button 
              onClick={() => scrollToSection("scholarships")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm transition-all transform hover:-translate-y-0.5 border-b-2 border-red-800"
            >
              2026 Scholarships
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-neutral-950 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl px-4 py-6 space-y-2 absolute w-full left-0 animate-fadeIn">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About HAMPCO" },
              { id: "programs", label: "Our Programs" },
              { id: "partners", label: "Partners & Sponsors" },
              { id: "events", label: "Upcoming Events" },
              { id: "gallery", label: "Community Galleries" },
              { id: "contact", label: "Contact & Address" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-bold ${
                  activeTab === tab.id 
                    ? "bg-red-600 text-white" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-200 flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection("scholarships")}
                className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wider"
              >
                Apply for 2026 Scholarship
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white overflow-hidden py-16 sm:py-24">
        {/* Animated dot-grid */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px]"></div>

        {/* Large animated orbs */}
        <div className="animate-orb-a absolute right-0 bottom-0 w-[520px] h-[520px] bg-red-600 rounded-full blur-[100px] opacity-[0.18] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        <div className="animate-orb-b absolute left-0 top-1/4 w-[420px] h-[420px] bg-slate-700 rounded-full blur-[90px] opacity-[0.22] -translate-x-1/3 pointer-events-none"></div>
        <div className="animate-orb-c absolute left-1/2 top-0 w-[300px] h-[300px] bg-red-900 rounded-full blur-[80px] opacity-[0.14] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* Slow-spinning decorative ring */}
        <div className="animate-spin-slow absolute right-12 top-12 w-48 h-48 border border-red-500/10 rounded-full pointer-events-none"></div>
        <div className="animate-spin-slow absolute right-12 top-12 w-72 h-72 border border-red-500/5 rounded-full pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>

        {/* Rising particles */}
        {[
          { size: 3, left: '8%',  delay: '0s',   dur: '9s',  px: '12px'  },
          { size: 2, left: '18%', delay: '1.5s', dur: '11s', px: '-8px'  },
          { size: 4, left: '32%', delay: '3s',   dur: '8s',  px: '20px'  },
          { size: 2, left: '50%', delay: '0.8s', dur: '13s', px: '-15px' },
          { size: 3, left: '65%', delay: '2.2s', dur: '10s', px: '10px'  },
          { size: 2, left: '78%', delay: '4s',   dur: '12s', px: '-20px' },
          { size: 4, left: '88%', delay: '1s',   dur: '7s',  px: '5px'   },
          { size: 2, left: '42%', delay: '5s',   dur: '14s', px: '18px'  },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute bottom-0 rounded-full bg-red-500/40 pointer-events-none"
            style={{
              width: p.size, height: p.size,
              left: p.left,
              ['--px' as any]: p.px,
              animation: `particle-rise ${p.dur} linear ${p.delay} infinite`,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="hero-fade-1 inline-flex items-center space-x-2 bg-neutral-900/80 border border-red-500/30 px-4 py-2 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Est. 1992 | Monroe, Northeast Louisiana</span>
            </div>

            <h2 className="hero-fade-2 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Empowering Families. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-white">
                Building Stronger Communities.
              </span>
            </h2>

            <p className="hero-fade-3 text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              HAMPCO, Inc. is dedicated to acts of socioeconomic elevation, teen mentorship, art nourishment, healthcare outreach, and financial literacy. We serve as a pillar of assistance for high-potential, underserved citizens across our region.
            </p>

            <div className="hero-fade-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={() => scrollToSection("programs")}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-red-600/10 hover:shadow-red-600/20 hover:scale-[1.03] transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Our Programs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="bg-white/5 hover:bg-white/15 text-white border border-white/20 font-bold px-8 py-4 rounded-xl hover:scale-[1.03] transition-all flex items-center justify-center"
              >
                Learn Our History
              </button>
            </div>

            {/* Quick Metrics Badge aligned with official colorways */}
            <div className="hero-fade-5 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-neutral-800">
              <div>
                <h4 className="text-3xl font-black text-red-500">400K+</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Citizens Served</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-red-500">30+</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Years of Service</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-red-500">35+</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Programs Run</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-red-500">60+</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Careers Created</p>
              </div>
            </div>
          </div>

          {/* Right Hero Card Panel utilizing heart favicon */}
          <div className="hero-right lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-gradient-to-tr from-red-600 to-neutral-900 rounded-3xl opacity-20 blur-lg"></div>
              
              <div className="relative bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden p-6 shadow-2xl space-y-6">
                
                <div className="relative h-48 rounded-xl overflow-hidden bg-neutral-900 flex items-center justify-center">
                  <img 
                    src="favicon.png" 
                    alt="HAMPCO Favicon Heart Icon"
                    className="w-28 h-28 object-contain opacity-90 filter drop-shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                    Our Motto
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Heart className="animate-heartbeat w-5 h-5 text-red-500 mr-2 shrink-0 fill-red-500" />
                    Building Stronger Communities
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    HAMPCO channels vital resources and customized curriculum directly to the grassroots level, focusing on anti-poverty support, life-readiness tools, and complete socio-economic independence.
                  </p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Latest Alert</p>
                      <p className="text-xs text-white font-bold truncate max-w-[150px] sm:max-w-[200px]">
                        {popup.title}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPopup(true)}
                    className="text-red-400 text-xs font-bold hover:underline shrink-0"
                  >
                    Details &rarr;
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- ABOUT HAMPCO & HISTORY --- */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            <div className="reveal-left lg:col-span-5 space-y-6">
              <div className="text-red-600 font-extrabold text-sm uppercase tracking-wider flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Who We Are
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-neutral-950 leading-tight">
                An Anti-Poverty Force in Monroe, Louisiana
              </h3>
              
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Helping Assist Multi-Purpose Community Organizations (**HAMPCO, Inc.**) was established in **1992** and officially incorporated as a 501(c)(3) non-profit organization in **1997**. 
              </p>
              
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Our creation was driven by the collaborative vision of **Representative Willie Hunter, Jr.**, who sought a dedicated fiscal agent to manage and monitor state general fund allocations targeting social services and poverty reduction in House Representative District 17.
              </p>

              <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-red-600 space-y-3">
                <h4 className="text-neutral-900 font-extrabold text-base">District & State Coordination</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Initially focusing as an anti-poverty entity for the indigent, destitute, illiterate, and underemployed, HAMPCO now works side-by-side with local and state governments to champion long-term civic excellence.
                </p>
              </div>
            </div>

            <div className="reveal-right lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div className="reveal-scale delay-100 bg-slate-50 p-6 rounded-2xl space-y-3 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Education Focus</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Providing back-to-school supplies, cursive writing skill tutoring, homework assistance, and essential time-management skills for youth.
                  </p>
                </div>

                <div className="reveal-scale delay-200 bg-slate-50 p-6 rounded-2xl space-y-3 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-neutral-900 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Teen Mentorship</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Addressing peer pressure, social etiquette, grooming, physical health, and self-esteem through direct, supportive interaction.
                  </p>
                </div>

                <div className="reveal-scale delay-200 bg-slate-50 p-6 rounded-2xl space-y-3 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Financial Literacy</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instructing high school sophomores and parents on budgeting, checkbook balancing, and reducing systemic cycles of poverty.
                  </p>
                </div>

                <div className="reveal-scale delay-300 bg-slate-50 p-6 rounded-2xl space-y-3 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-neutral-900 flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Health Support</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sponsoring regional nutritional instruction, community wellness walks, and youth-focused clinical guidelines.
                  </p>
                </div>

              </div>

              {/* Board and Staff Panel redesigned with red/black gradients */}
              <div className="bg-gradient-to-r from-neutral-900 to-black text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-neutral-800">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                  <div>
                    <h4 className="text-xl font-extrabold tracking-tight">Our Leadership & Counsel</h4>
                    <p className="text-xs text-slate-400 italic">Building Stronger Communities since 1992</p>
                  </div>
                  <div className="mt-2 md:mt-0 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                    Executive Board
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-red-500 font-bold uppercase tracking-widest text-[10px] mb-1.5">Board of Directors</p>
                    <ul className="space-y-1 text-slate-300">
                      <li><strong>Willie Hunter, Jr.</strong> – President</li>
                      <li><strong>Larry Wilson</strong> – Vice President</li>
                      <li><strong>Stacy Newbill</strong> – Secretary</li>
                      <li><strong>Gary Hicks</strong> – Treasurer</li>
                      <li><strong>Constance Collins</strong> – Board Member</li>
                      <li><strong>Mona H. Gibbs</strong> – Board Member</li>
                    </ul>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <p className="text-red-500 font-bold uppercase tracking-widest text-[10px] mb-1.5">Administrative Staff</p>
                    <ul className="space-y-1 text-slate-300">
                      <li><strong>Carrie Simon</strong> – Executive Director</li>
                      <li><strong>Irma Allen</strong> – Assistant Executive Director</li>
                      <li><strong>Brenda Johnson</strong> – Financial Consultant</li>
                    </ul>
                    <p className="text-red-500 font-bold uppercase tracking-widest text-[10px] mt-3 mb-1">Key Community Partners</p>
                    <p className="text-slate-300 text-[11px]">S.C.O.R.E. Senior Center & BK Mentoring Boxing Academy</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* --- PROGRAMS DEEP DIVE SECTION --- */}
      <section id="programs" className="py-20 bg-slate-100 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="reveal text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-100/80 px-3.5 py-1.5 rounded-full inline-block">
              Empowerment Programs
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Actionable Initiatives Built For Sustained Impact
            </h3>
            <p className="text-slate-600 text-sm sm:text-base font-light italic">
              "Building Stronger Communities" through educational opportunity, wellness outreach, and youth nourishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Program 1 */}
            <div className="reveal-scale delay-100 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              <div className="h-48 relative overflow-hidden bg-neutral-900">
                <img 
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600" 
                  alt="Summer Youth Art Classes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
                  Arts & Youth
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-950">Summer Youth Art Classes</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nurturing the creative minds of young adults and teenagers across Monroe. We believe self-expression boosts clinical and psychological self-esteem, provides stress outlets, and expands occupational horizons in the creative economy.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Annual Program</span>
                  <span className="font-semibold text-red-600">Ages 8-15</span>
                </div>
              </div>
            </div>

            {/* Program 2 */}
            <div className="reveal-scale delay-200 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              <div className="h-48 relative overflow-hidden bg-neutral-900">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600" 
                  alt="Nutrition & Cooking"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-neutral-950 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-neutral-700">
                  Health & Nutrition
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-950">5 Steps to a Healthier You</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Various times and locations - See schedule
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Ongoing</span>
                  <span className="font-semibold text-neutral-900">All Ages Welcome</span>
                </div>
              </div>
            </div>

            {/* Program 3 */}
            <div className="reveal-scale delay-300 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              <div className="h-48 relative overflow-hidden bg-neutral-900">
                <img
                  src="https://hampcoinc.org/assets/images/diamonds-cooking-1.jpg-1151x1535.jpeg"
                  alt="Diamonds in the Rough program participants"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
                  Social Etiquette
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-950">Diamonds in the Rough</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mentoring boys & girls on social grace. Curriculum covers classic table etiquette, confident speaking, money math, basic cooking, writing skills, and overcoming school-yard bullying. Made possible by Senator Katrina Jackson-Andrews.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Cohorts</span>
                  <span className="font-semibold text-red-600">Youth & Teens</span>
                </div>
              </div>
            </div>

            {/* Program 4 */}
            <div className="reveal-scale delay-400 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              <div className="h-48 relative overflow-hidden bg-neutral-900">
                <img 
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600" 
                  alt="Financial literacy teaching"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-neutral-950 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-neutral-700">
                  Financial Literacy
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-950">Adult & Teen Finances</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We demystify modern personal banking. Students are taught exactly how to construct and monitor a monthly spending budget, calculate compound interests, balance real checkbooks, and understand local tax obligations.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Workshops</span>
                  <span className="font-semibold text-neutral-800">Free Materials</span>
                </div>
              </div>
            </div>

            {/* Program 5 - Scholarships */}
            <div id="scholarships" className="reveal-scale delay-500 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                <div className="h-48 md:h-auto md:col-span-5 relative bg-neutral-950">
                  <img
                    src="https://hampcoinc.org/assets/images/3076924166095057197.jpg-1080x1440.jpeg"
                    alt="HAMPCO Scholarship Ceremony"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-neutral-950 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded border border-red-500/40">
                    Annual Funding
                  </div>
                </div>
                <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest">Senate District 34</span>
                    <h4 className="text-2xl font-black text-slate-950 leading-tight">HAMPCO Scholarship Program</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every year, Hampco does scholarships to selected deserving high school seniors accepted into a qualified college, university, or technical institution. Applications are vetted by local community volunteers based on academic progress, civic service, and financial necessity.
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg text-xs border border-slate-150">
                      <p className="font-semibold text-slate-800">Requirements & Details:</p>
                      <ul className="list-disc list-inside text-slate-500 mt-1 space-y-0.5">
                        <li>Senior student residing within District 34</li>
                        <li>Official transcript & proof of college acceptance required</li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="text-xs text-slate-500">
                      <strong>Office Hours:</strong> Tue-Thu, 10:00 AM - 2:00 PM
                    </div>
                    <button 
                      onClick={() => scrollToSection("contact")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded tracking-wider text-center"
                    >
                      Inquire / Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- COMMUNITY PARTNERS & SPONSORS --- */}
      <section id="partners" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="reveal text-center mb-10 space-y-3">
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Handshake className="w-4 h-4" />
              Community Partners
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Organizations We Serve & Support
            </h3>
            <p className="text-slate-500 text-sm font-light max-w-2xl mx-auto">
              HAMPCO proudly collaborates with these organizations to deliver community impact across Northeast Louisiana.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { name: "Academic Heritage Quiz Bowl", desc: "Annual academic competition for District 34 schools celebrating heritage and scholarship excellence.", category: "Education" },
              { name: "NELA Sickle Cell Anemia Foundation", desc: "Northeast Louisiana chapter supporting sickle cell disease awareness and patient resources.", category: "Health" },
              { name: "Wanda's Abounding Grace", desc: "Walk Around the Block for Autism — 5K fun run and community festival held each spring.", category: "Community" },
              { name: "Town of Richwood Juneteenth Celebration", desc: "Annual Juneteenth event honoring freedom and Black culture across the region.", category: "Culture" },
              { name: "Renaissance Movement Committee", desc: "Hosts the annual Black History Parade honoring legacy and achievements of the Black community.", category: "Culture" },
              { name: "United Minds of Joint Action Association", desc: "Juneteenth coalition bringing together community organizations for shared celebration and action.", category: "Community" },
            ].map((partner, i) => (
              <div key={i} className={`reveal-scale bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-red-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 delay-${Math.min(i * 100, 500)}`}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Handshake className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">{partner.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{partner.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{partner.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Donate CTA */}
          <div className="bg-gradient-to-r from-neutral-900 to-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-neutral-800">
            <div className="text-center sm:text-left">
              <h4 className="text-white font-bold text-lg">Support HAMPCO's Community Work</h4>
              <p className="text-slate-400 text-xs mt-1">Your donation directly funds scholarships, youth programs, and vital outreach initiatives.</p>
            </div>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=263KFG6V9F8HC"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm uppercase tracking-wider transition-all shrink-0 flex items-center space-x-2 shadow-lg"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate via PayPal</span>
            </a>
          </div>

        </div>
      </section>

      {/* --- UPCOMING EVENTS DYNAMIC SECTION --- */}
      <section id="events" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-red-600 font-extrabold text-sm uppercase tracking-wider flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                Community Calendar
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1">
                Upcoming Community Events
              </h3>
            </div>
            <p className="text-slate-500 text-sm max-w-md mt-2 md:mt-0 italic">
              "Building Stronger Communities" through real-world opportunities and transparent state outreach events.
            </p>
          </div>

          <div className="space-y-6">
            {events.filter((evt: any) => parseLocalDate(evt.endDate || evt.date).setHours(23,59,59,999) >= Date.now()).length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-700">No Scheduled Events</h4>
                <p className="text-xs text-slate-500 mt-1">Check back later or log in as admin to add fresh programmatic classes!</p>
              </div>
            ) : (
              [...events]
                .filter((evt: any) => parseLocalDate(evt.endDate || evt.date).setHours(23,59,59,999) >= Date.now())
                .sort((a: any, b: any) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime())
                .map((evt: any, idx: number) => (
                <div
                  key={evt.id}
                  className={`reveal bg-slate-50 hover:bg-red-50/10 border border-slate-200 hover:border-red-200 rounded-2xl p-6 sm:p-8 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 delay-${Math.min(idx * 100, 500)}`}
                >
                  <div className="flex items-start space-x-5 lg:col-span-8">
                    {/* Date badge matching branding */}
                    <div className="w-16 h-16 bg-neutral-950 text-white rounded-xl flex flex-col items-center justify-center text-center shrink-0 shadow-sm border-b-4 border-red-600">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-red-500 leading-none">
                        {parseLocalDate(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-black leading-tight mt-0.5">
                        {parseLocalDate(evt.date).toLocaleDateString('en-US', { day: 'numeric' })}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                          {evt.category || "General"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center font-medium">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {evt.time}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">{evt.title}</h4>
                      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">{evt.description}</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-red-600" />
                          {evt.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/80">
                    <button 
                      onClick={() => scrollToSection("contact")}
                      className="flex-1 lg:flex-none text-center bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded transition-all"
                    >
                      Register / Contact
                    </button>
                    {adminAuthenticated && (
                      <div className="flex space-x-1 shrink-0">
                        <button 
                          onClick={() => handleEditEventClick(evt)}
                          title="Edit Event"
                          className="p-2.5 bg-neutral-900 hover:bg-slate-800 text-amber-500 rounded border border-neutral-700 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(evt.id)}
                          title="Delete Event"
                          className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* --- MULTIPLE GALLERIES INTERACTIVE SECTION --- */}
      <section id="gallery" className="py-20 bg-slate-100 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="reveal text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-red-600 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center">
              <Camera className="w-4 h-4 mr-1.5" />
              Community Portfolios
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Our Shared Journey In Pictures
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm italic">
              Explore multiple active program galleries. Proof of the programs we organize in Northeast Louisiana.
            </p>
          </div>

          {/* Gallery Switcher / Filter Tabs conforming to Black & Red Theme */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button 
              onClick={() => setSelectedGalleryId("all")}
              className={`px-5 py-2.5 rounded text-xs font-bold transition-all border ${
                selectedGalleryId === "all" 
                  ? "bg-neutral-950 text-white border-neutral-950 shadow-md" 
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              All Galleries ({galleries.length})
            </button>
            {galleries.map((gal) => (
              <button
                key={gal.id}
                onClick={() => setSelectedGalleryId(gal.id)}
                className={`px-5 py-2.5 rounded text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                  selectedGalleryId === gal.id 
                    ? "bg-red-600 text-white border-red-600 shadow-md" 
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                }`}
              >
                <span>{gal.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedGalleryId === gal.id ? 'bg-red-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {gal.images?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Rendered Galleries */}
          <div className="space-y-16">
            {galleries
              .filter(gal => selectedGalleryId === "all" || selectedGalleryId === gal.id)
              .map((gal) => (
                <div key={gal.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-250 space-y-6 animate-fadeIn">
                  
                  {/* Gallery Info Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-150">
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Layers className="w-5 h-5 mr-2 text-red-600" />
                        {gal.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl">{gal.description}</p>
                    </div>
                    {adminAuthenticated && (
                      <button 
                        onClick={() => handleDeleteGallery(gal.id)}
                        className="self-start sm:self-center bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Gallery Folder</span>
                      </button>
                    )}
                  </div>

                  {/* Image Grid with modern lightbox interaction */}
                  {(!gal.images || gal.images.length === 0) ? (
                    <div className="text-center py-10 bg-slate-50 rounded border border-dashed border-slate-250">
                      <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No photos in this gallery yet.</p>
                      {adminAuthenticated && (
                        <p className="text-[11px] text-red-600 mt-1">Use the Content Customizer below to add photos!</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gal.images.map((img, imgIdx: number) => (
                        <div
                          key={img.id}
                          className="gallery-img-enter relative group rounded-xl overflow-hidden bg-slate-100 aspect-square shadow-sm border border-slate-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                          style={{ animationDelay: `${Math.min(imgIdx * 60, 400)}ms` }}
                        >
                          <img 
                            src={img.url} 
                            alt={img.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            onClick={() => setLightboxImage({ url: img.url, title: img.title })}
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/90 via-slate-950/40 to-transparent p-3 text-white flex justify-between items-end">
                            <span className="text-[10px] font-medium truncate max-w-[80%]">{img.title}</span>
                            <button 
                              onClick={() => setLightboxImage({ url: img.url, title: img.title })}
                              title="Zoom"
                              className="bg-white/20 hover:bg-white/40 p-1.5 rounded-full text-white transition-all shrink-0 ml-1"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>
                          {adminAuthenticated && (
                            <button 
                              onClick={() => handleDeleteImageFromGallery(gal.id, img.id)}
                              title="Delete Photo"
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded shadow transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
          </div>

        </div>
      </section>

      {/* --- CONTACT & HOURS SECTION --- */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Info Column */}
            <div className="reveal-left lg:col-span-5 space-y-8">
              <div className="space-y-2">
                <span className="text-red-600 font-extrabold text-sm uppercase tracking-wider block">Get In Touch</span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">HAMPCO Head Office</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  We look forward to collaborating with you. If you are a parent seeking tutoring, a high school senior picking up scholarship guidelines, or a regional organization seeking coordination:
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Official Office Hours</h4>
                    <p className="text-xs text-slate-500 mt-0.5">10:00 AM to 2:00 PM</p>
                    <p className="text-[11px] text-red-600 font-bold uppercase tracking-wider mt-0.5">Tuesday, Wednesday, and Thursday</p>
                  </div>
                </div>

                {/* Physical Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Our Physical HQ Address</h4>
                    <p className="text-xs text-slate-500 mt-0.5">1116 Jackson Street</p>
                    <p className="text-xs text-slate-500">Monroe, LA 71202</p>
                  </div>
                </div>

                {/* Mailing Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Mailing Address</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Post Office Box 4481</p>
                    <p className="text-xs text-slate-500">Monroe, LA 71211-4481</p>
                  </div>
                </div>

                {/* Phone Contact */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Phone Assistance</h4>
                    <p className="text-xs text-slate-700 font-extrabold mt-0.5">(318) 361-2025</p>
                    <p className="text-xs text-slate-500">Alt Contacts: (318) 237-0855 / (318) 361-2050</p>
                  </div>
                </div>

              </div>

              {/* Decorative map representation */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Northeast Louisiana Region</span>
                <p className="text-xs text-slate-700 font-medium">Located conveniently near downtown Monroe, LA in District 17 / Ouachita Parish.</p>
              </div>

            </div>

            {/* Form Column */}
            <div className="reveal-right lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h4 className="text-xl font-bold text-slate-900 mb-2">Send HAMPCO An Email Inquiry</h4>
              <p className="text-xs text-slate-500 mb-6">Fill in details below to directly email our administration team regarding sponsorships, student art entry, or scholarships.</p>
              
              {contactSuccess ? (
                <div className="bg-red-50 text-red-900 p-6 rounded-xl border border-red-200 flex items-start space-x-3 animate-fadeIn">
                  <Check className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">Message Successfully Submitted!</h5>
                    <p className="text-xs text-red-800 mt-1">Thank you for contacting HAMPCO, Inc. Our executive director will review your query and reply during official working hours (Tue-Thu).</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded border border-slate-300 bg-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="johndoe@example.com"
                        className="w-full px-3.5 py-2.5 rounded border border-slate-300 bg-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Telephone Number</label>
                    <input 
                      type="tel" 
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(318) 555-0199"
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 bg-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">How can HAMPCO assist you?</label>
                    <textarea 
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Type details here: pickup a scholarship kit, register a student for cooking class, sponsorship questions, etc."
                      className="w-full px-3.5 py-2.5 rounded border border-slate-300 bg-white focus:outline-none focus:border-red-600"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded transition-all text-xs uppercase tracking-widest shadow-md"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* --- ADMIN PANEL CONTROLLER SECTION (only rendered when isAdminMode=true via #admin URL) --- */}
      {isAdminMode &&
      <section id="admin-panel" className="py-20 bg-neutral-900 text-slate-100 border-t-8 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-8 mb-10 gap-4">
            <div>
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest flex items-center">
                <Sliders className="w-4 h-4 mr-1.5" />
                Live Hampco Website Content Management System
              </span>
              <h3 className="text-3xl font-black text-white tracking-tight mt-1">
                Admin Customizer Panel
              </h3>
            </div>
            
            {adminAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="bg-neutral-800 hover:bg-neutral-700 text-slate-300 border border-neutral-700 px-4 py-2 rounded text-xs font-bold flex items-center space-x-1.5 transition-all"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Exit Admin Customizer</span>
              </button>
            ) : (
              <span className="bg-neutral-950 text-slate-400 text-xs px-3 py-1 rounded border border-neutral-800">
                Secure Live Edits Mode
              </span>
            )}
          </div>

          {!adminAuthenticated ? (
            /* Admin Password screen styled with official brand colors */
            <div className="max-w-md mx-auto bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Unlock Admin System Customizer</h4>
                <p className="text-xs text-slate-400">Manage galleries, add/edit community programs, and update alert popups live.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-350 font-semibold mb-1.5">Administrative Password</label>
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter key (use 'admin' to test)"
                    className="w-full px-3.5 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500 text-center text-sm font-semibold tracking-widest"
                  />
                </div>

                {adminError && (
                  <p className="text-red-400 text-center font-bold">{adminError}</p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded text-xs uppercase tracking-wider transition-all"
                >
                  Enter Live Admin Portal
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-12 text-xs sm:text-sm">
              
              {/* Row 1: Popup customizer */}
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2.5 animate-pulse"></span>
                    Custom Alert Popup Controller
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Configure the announcement banner/popup shown to all home page visitors instantly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left toggles */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-3">
                      <label className="flex items-center space-x-2 cursor-pointer font-bold text-white">
                        <input 
                          type="checkbox"
                          checked={popup.enabled}
                          onChange={(e) => updatePopupConfig('enabled', e.target.checked)}
                          className="rounded text-red-600 bg-neutral-950 border-neutral-700 w-4 h-4 focus:ring-0"
                        />
                        <span>Enable Popup Alert</span>
                      </label>
                      <p className="text-[11px] text-slate-400">If checked, a premium dialog popup will immediately trigger upon user visit.</p>
                    </div>

                    <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
                      <label className="block text-slate-300 font-bold mb-1">Color Theme</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['red', 'black', 'blue', 'slate'].map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => updatePopupConfig('bgColor', col)}
                            className={`py-1.5 rounded uppercase text-[9px] font-black tracking-widest transition-all ${
                              popup.bgColor === col 
                                ? 'bg-red-600 text-white' 
                                : 'bg-neutral-850 text-slate-400 hover:text-white'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right text inputs */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Popup Banner Title</label>
                        <input 
                          type="text"
                          value={popup.title}
                          onChange={(e) => updatePopupConfig('title', e.target.value)}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Button Call-to-Action Link</label>
                        <input 
                          type="text"
                          value={popup.buttonLink}
                          onChange={(e) => updatePopupConfig('buttonLink', e.target.value)}
                          placeholder="#scholarships"
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Popup Banner Button Text</label>
                      <input 
                        type="text"
                        value={popup.buttonText}
                        onChange={(e) => updatePopupConfig('buttonText', e.target.value)}
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Main Announcement Body Content Text</label>
                      <textarea
                        rows={3}
                        value={popup.message}
                        onChange={(e) => updatePopupConfig('message', e.target.value)}
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                      ></textarea>
                    </div>
                  </div>

                </div>
              </div>

              {/* Row 2: Manage / Delete Existing Events */}
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-red-500" />
                    Manage Existing Events
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Edit or remove events from the community calendar.</p>
                </div>
                {events.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No events on the calendar yet.</p>
                ) : (
                  <div className="space-y-2">
                    {events.map((evt: { id: string; title: string; date: string; location?: string }) => (
                      <div key={evt.id} className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 gap-3">
                        <div className="min-w-0">
                          <p className="text-white text-xs font-bold truncate">{evt.title}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {parseLocalDate(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {evt.location ? ` · ${evt.location}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDuplicateEvent(evt)}
                            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-sky-400 rounded border border-neutral-700 transition-all"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditEventClick(evt)}
                            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded border border-neutral-700 transition-all"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 3: Add / Edit Event Panel */}
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-red-500" />
                    {editingEventId ? "Update / Edit Existing Event" : "Create & Publish Brand New Event"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Fill the form to append classes, fundraisers, and board meetings immediately to the community feed.</p>
                </div>

                <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Event Name / Title</label>
                      <input 
                        type="text"
                        required
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Summer Cooking 101"
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Calendar Start Date</label>
                      <input 
                        type="date"
                        required
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Time Range</label>
                      <input 
                        type="text"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="10:00 AM - 1:00 PM"
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Location Address</label>
                      <input 
                        type="text"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="1116 Jackson Street, Monroe, LA"
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Category Badge Label</label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="General">General</option>
                        <option value="Arts & Culture">Arts & Culture</option>
                        <option value="Health & Nutrition">Health & Nutrition</option>
                        <option value="Education & Skills">Education & Skills</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Scholarship">Scholarship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Brief Description of the Event</label>
                    <textarea 
                      rows={3}
                      required
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter what participants will learn, guest speaker names, and what items to bring."
                      className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    {editingEventId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingEventId(null);
                          setNewEvent({ title: "", date: "", endDate: "", time: "", location: "", description: "", category: "General" });
                        }}
                        className="bg-neutral-800 hover:bg-neutral-700 text-slate-300 px-5 py-2.5 rounded font-bold"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded uppercase tracking-wider"
                    >
                      {editingEventId ? "Save Changes" : "Publish to Calendar Feed"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Row 3: Manage Multiple Galleries */}
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-8">

                {/* Storage setup notice */}
                <div className="bg-neutral-900 border border-yellow-600/30 rounded-xl p-4 text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-yellow-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Storage Setup Required for Photo Uploads
                  </p>
                  <p>To enable direct photo uploads, go to your <strong className="text-white">Supabase dashboard → Storage → New bucket</strong>. Name it <code className="bg-neutral-800 px-1 rounded text-red-400">gallery-images</code>, set it to <strong className="text-white">Public</strong>, and add an Insert policy for the <code className="bg-neutral-800 px-1 rounded">anon</code> role.</p>
                </div>
                
                {/* Reset to official defaults */}
                <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-white text-xs font-bold">Reset Galleries to Official HAMPCO Photos</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Replaces current galleries with the real photos from hampcoinc.org.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("This will replace ALL current gallery content with the official HAMPCO photos. Continue?")) {
                        setGalleries(DEFAULT_GALLERIES);
                      }
                    }}
                    className="shrink-0 ml-4 bg-neutral-800 hover:bg-red-600 text-slate-300 hover:text-white border border-neutral-700 px-4 py-2 rounded text-xs font-bold transition-all"
                  >
                    Reset Now
                  </button>
                </div>

                {/* 1. Manage existing gallery images */}
                <div className="border-t border-neutral-800 pt-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-red-500" />
                      Manage Gallery Photos
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Select a gallery to view, edit captions, replace photos, or remove images.</p>
                  </div>

                  {/* Gallery selector tabs */}
                  <div className="flex flex-wrap gap-2">
                    {galleries.map(gal => (
                      <button
                        key={gal.id}
                        type="button"
                        onClick={() => setExpandedGalleryId(expandedGalleryId === gal.id ? "" : gal.id)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                          expandedGalleryId === gal.id
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-neutral-900 text-slate-300 border-neutral-700 hover:border-red-500"
                        }`}
                      >
                        {gal.title} ({gal.images?.length ?? 0})
                      </button>
                    ))}
                  </div>

                  {/* Image list for selected gallery */}
                  {expandedGalleryId && (() => {
                    const gal = galleries.find(g => g.id === expandedGalleryId);
                    if (!gal) return null;
                    return (
                      <div className="space-y-2">
                        {(!gal.images || gal.images.length === 0) ? (
                          <p className="text-slate-500 text-xs italic">No photos in this gallery yet.</p>
                        ) : gal.images.map(img => (
                          <div key={img.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
                            {editingImage?.imageId === img.id && editingImage ? (
                              /* Inline edit form */
                              <div className="space-y-3">
                                <div className="flex gap-3 items-start">
                                  <img src={editingImage.url} alt={editingImage.title} className="w-16 h-16 object-cover rounded shrink-0 border border-neutral-700" />
                                  <div className="flex-1 space-y-2">
                                    <div>
                                      <label className="block text-slate-400 text-[11px] font-bold mb-1">Caption</label>
                                      <input
                                        type="text"
                                        value={editingImage.title}
                                        onChange={e => setEditingImage(prev => prev ? { ...prev, title: e.target.value } : prev)}
                                        className="w-full px-3 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-red-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-slate-400 text-[11px] font-bold mb-1">Replace Photo</label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async e => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          const url = await handleFileUpload(file);
                                          if (url) setEditingImage(prev => prev ? { ...prev, url } : prev);
                                        }}
                                        className="w-full px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button type="button" onClick={() => setEditingImage(null)} className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-slate-300 rounded text-xs font-bold">Cancel</button>
                                  <button type="button" onClick={handleSaveImageEdit} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold">Save Changes</button>
                                </div>
                              </div>
                            ) : (
                              /* Normal row */
                              <div className="flex items-center gap-3">
                                <img src={img.url} alt={img.title} className="w-14 h-14 object-cover rounded shrink-0 border border-neutral-700" />
                                <p className="flex-1 text-slate-200 text-xs font-medium truncate">{img.title}</p>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setEditingImage({ galleryId: gal.id, imageId: img.id, title: img.title, url: img.url })}
                                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded border border-neutral-700 transition-all"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteImageFromGallery(gal.id, img.id)}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* 2. Create Gallery */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-red-500" />
                      Create New Image Gallery Segment
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Need to display a new project or community outreach? Add a gallery folder instantly.</p>
                  </div>

                  <form onSubmit={handleCreateGallery} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Gallery Title</label>
                        <input 
                          type="text"
                          required
                          value={newGallery.title}
                          onChange={(e) => setNewGallery(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., 5K Walk for Autism"
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Intro Description / Objective</label>
                        <input 
                          type="text"
                          required
                          value={newGallery.description}
                          onChange={(e) => setNewGallery(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Summarize the pictures..."
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Cover Image (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await handleFileUpload(file);
                            if (url) setNewGallery(prev => ({ ...prev, coverImage: url }));
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white cursor-pointer"
                        />
                        {newGallery.coverImage && !uploadingImage && (
                          <p className="text-green-400 text-[11px] mt-1">✓ Cover image set</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded"
                      >
                        Create Gallery Folder
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Add Photos to Existing Galleries */}
                <div className="border-t border-neutral-800 pt-8 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-red-500" />
                      Add Photos to Existing HAMPCO Gallery Folder
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Select an active folder and paste an image URL to publish a photo.</p>
                  </div>

                  <form onSubmit={handleAddImageToGallery} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Select Target Gallery</label>
                        <select
                          value={activeAdminGalleryId}
                          required
                          onChange={(e) => setActiveAdminGalleryId(e.target.value)}
                          className="w-full px-3 py-2.5 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500 text-sm"
                        >
                          <option value="">-- Choose Gallery Folder --</option>
                          {galleries.map(g => (
                            <option key={g.id} value={g.id}>{g.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Upload Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await handleFileUpload(file);
                            if (url) setNewImage(prev => ({ ...prev, url }));
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white cursor-pointer"
                        />
                        {uploadingImage && (
                          <p className="text-yellow-400 text-[11px] mt-1">Uploading image, please wait...</p>
                        )}
                        {uploadError && (
                          <p className="text-red-400 text-[11px] mt-1 leading-relaxed">{uploadError}</p>
                        )}
                        {newImage.url && !uploadingImage && !uploadError && (
                          <p className="text-green-400 text-[11px] mt-1">✓ Photo ready to publish</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Short Caption / Tagline</label>
                        <input 
                          type="text"
                          required
                          value={newImage.title}
                          onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Teens exploring cooking methods"
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded animate-fadeIn"
                      >
                        Publish Photo Now
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>
          )}

        </div>
      </section>
      }

      {/* --- FOOTER --- */}
      <footer className="bg-neutral-950 text-slate-400 text-xs sm:text-sm mt-auto border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="ico-128x119.png" 
                alt="Favicon Heart" 
                className="w-8 h-8 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <span className="text-white text-base font-black tracking-wider block">HAMPCO, INC.</span>
                <span className="text-[10px] text-slate-500 italic block">Building Stronger Communities</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-light">
              Helping Assist Multi-Purpose Community Organizations. Established 1992 in Northeast Louisiana. Actively educating, mentoring, and enhancing health skills.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://www.facebook.com/hampcoinc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-[11px] text-slate-400 hover:text-white border border-neutral-800 hover:border-neutral-600 bg-neutral-900 px-3 py-1.5 rounded transition-all"
              >
                <span className="font-bold">f</span>
                <span>@hampcoinc</span>
              </a>
              <a
                href="https://www.paypal.com/donate/?hosted_button_id=263KFG6V9F8HC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-red-400 hover:text-red-300 border border-neutral-800 hover:border-red-800 bg-neutral-900 px-3 py-1.5 rounded transition-all font-bold"
              >
                Donate
              </a>
            </div>
            <p className="text-slate-600 text-[11px]">
              &copy; 2026 HAMPCO INC. All Rights Reserved.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="text-white font-extrabold uppercase tracking-widest text-[11px] text-red-500">Quick Portal Map</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => scrollToSection("home")} className="hover:text-white hover:underline">HAMPCO Home</button></li>
              <li><button onClick={() => scrollToSection("about")} className="hover:text-white hover:underline">About & History</button></li>
              <li><button onClick={() => scrollToSection("programs")} className="hover:text-white hover:underline">Community Initiatives</button></li>
              <li><button onClick={() => scrollToSection("events")} className="hover:text-white hover:underline">Events Calendar</button></li>
              <li><button onClick={() => scrollToSection("gallery")} className="hover:text-white hover:underline">Multiple Galleries</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="text-white font-extrabold uppercase tracking-widest text-[11px] text-red-500">Helpful Links</h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={() => scrollToSection("scholarships")} className="hover:text-white hover:underline">2026 Scholarship Guidelines</button></li>
              <li><button onClick={() => scrollToSection("contact")} className="hover:text-white hover:underline">Pick Up Application Packets</button></li>
              <li><span className="text-slate-600 font-medium">State Senate District 34</span></li>
              <li><span className="text-slate-600 font-medium">House District 17 Representative</span></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h5 className="text-white font-extrabold uppercase tracking-widest text-[11px] text-red-500">Connect</h5>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=263KFG6V9F8HC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold uppercase tracking-wider text-[10px] flex items-center justify-center space-x-1.5 transition-all"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Donate via PayPal</span>
            </a>
            <a
              href="https://www.facebook.com/hampcoinc"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-neutral-900 hover:bg-neutral-800 text-slate-300 border border-neutral-800 py-2 rounded font-bold uppercase tracking-wider text-[10px] flex items-center justify-center space-x-1.5 transition-all"
            >
              <span>Follow on Facebook</span>
            </a>
          </div>

        </div>
      </footer>

      {/* --- POPUP NOTIFICATION MODAL (Redesigned with official color fallback options) --- */}
      {showPopup && popup.enabled && (() => {
        const popupColors = getPopupColorClasses(popup.bgColor);
        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-slate-200 transform transition-all animate-scaleIn">
              
              {/* Header background corresponding to colors */}
              <div className={`p-6 text-white relative ${popupColors.bg}`}>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-2 bg-white/15 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider w-fit mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-white" />
                  <span>Official Announcement</span>
                </div>

                <h3 className="text-2xl font-black tracking-tight mt-1">{popup.title}</h3>
              </div>

              <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
                <p className="text-slate-600 leading-relaxed font-medium">
                  {popup.message}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold flex items-center uppercase tracking-wider">
                    <Calendar className="w-4 h-4 mr-1 text-red-600" />
                    Target Deadline
                  </span>
                  <span className="bg-red-50 text-red-700 font-extrabold px-3.5 py-1 rounded text-xs border border-red-200/50">
                    March 31, 2026
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {popup.buttonLink && (
                    <a 
                      href={popup.buttonLink}
                      onClick={() => { setShowPopup(false); scrollToSection("scholarships"); }}
                      className={`flex-1 text-center font-black uppercase tracking-wider text-xs py-3.5 rounded transition-all shadow ${popupColors.btn}`}
                    >
                      {popup.buttonText}
                    </a>
                  )}
                  <button 
                    onClick={() => setShowPopup(false)}
                    className="flex-1 sm:flex-none text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 font-bold uppercase tracking-wider text-xs py-3.5 rounded text-center"
                  >
                    Dismiss Announcement
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* --- LIGHTBOX PHOTO VIEW CAROUSEL --- */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl w-full max-h-[80vh] flex items-center justify-center relative p-2">
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-slate-800"
            />
          </div>

          <div className="mt-4 text-center space-y-1 max-w-xl px-4">
            <h4 className="text-white font-bold text-base">{lightboxImage.title}</h4>
            <p className="text-xs text-red-500 font-medium tracking-wide">HAMPCO Community Archive</p>
          </div>
        </div>
      )}

    </div>
  );
}