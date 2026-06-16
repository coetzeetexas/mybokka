import { useState, useEffect, useRef, FormEvent } from 'react';
import { TermsPage, PrivacyPage, CookiePage } from './LegalPages';
import { ClaudeCoursesPage } from './ClaudeCoursesPage';
import { TrainingApplicationPage } from './TrainingApplicationPage';
import { AdminDashboard } from './AdminDashboard';
import {
  Brain,
  Users,
  MessageSquare,
  Sparkles,
  Zap,
  Target,
  BookOpen,
  Settings,
  BarChart3,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,

  Workflow,
  Lightbulb,
  Rocket,
  GraduationCap,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  HeartHandshake,
  Building2,
  Globe,
  Send,
  Star,
  Quote,
  Search,
  Wrench,
  Bot,
  Share2,
  PenTool,
  CalendarDays,
  UsersRound,
  PieChart,
} from 'lucide-react';

type Page = 'home' | 'terms' | 'privacy' | 'cookies' | 'courses' | 'training' | 'admin';

// Animation Hook for intersection observer
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000, startCounting: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
};

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#process', label: 'Process' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <a href="#" className="flex items-center group">
            <div className="rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105">
              <img
                src="/WhatsApp_Image_2026-06-15_at_06.33.37.jpeg"
                alt="KORIX LLC"
                className="h-28 sm:h-36 lg:h-48 w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium text-navy-700 hover:text-accent-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="px-6 py-2.5 bg-accent-700 hover:bg-accent-800 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-accent-700/25 transform hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-navy-900" />
            ) : (
              <Menu className="w-6 h-6 text-navy-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-navy-900 font-medium py-2 hover:text-accent-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="block w-full text-center px-6 py-3 bg-accent-700 hover:bg-accent-800 text-white font-semibold rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-700/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent-700/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Dallas Skyline Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20">
          <svg viewBox="0 0 1440 200" className="w-full h-full" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.1)" d="M0,200 L0,120 L50,120 L50,80 L80,80 L80,60 L100,60 L100,120 L150,120 L150,90 L180,90 L180,60 L200,40 L220,60 L220,100 L260,100 L260,80 L300,80 L300,50 L320,20 L340,50 L340,120 L380,120 L380,90 L420,90 L420,70 L450,70 L450,50 L480,30 L500,50 L500,100 L540,100 L540,80 L580,80 L580,60 L620,40 L640,60 L640,100 L680,100 L680,120 L720,120 L720,80 L760,80 L760,60 L800,40 L840,60 L840,100 L880,100 L880,80 L920,80 L920,100 L960,100 L960,70 L1000,70 L1000,90 L1040,90 L1040,120 L1080,120 L1080,80 L1120,80 L1120,60 L1160,40 L1200,60 L1200,100 L1240,100 L1240,80 L1280,80 L1280,60 L1320,30 L1340,60 L1340,120 L1380,120 L1380,140 L1440,140 L1440,200 Z" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 lg:pt-56">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-fade-in-down">
            <MapPin className="w-4 h-4 text-accent-500" />
            <span>Fort Worth, Dallas, Texas</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span>AI & Digital Innovation</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Empowering Businesses with
            <span className="block mt-2 pb-2 bg-gradient-to-r from-white via-blue-100 to-accent-400 bg-clip-text text-transparent">
              AI & Digital Growth
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-white/80 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            KORIX LLC helps organizations leverage Artificial Intelligence, automate workflows,
            train teams, and grow their online presence through strategic social media management.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a
              href="#contact"
              className="group px-8 py-4 bg-accent-700 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-accent-700/30 transform hover:-translate-y-1 flex items-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all backdrop-blur-sm border border-white/20 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule AI Assessment
            </a>
          </div>

          {/* Brand Video */}
          <div className="mt-14 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/8185_KZx7NQ?rel=0&modestbranding=1"
                  title="KORIX - Focus ° Execute ° Win"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-10 border-t border-white/10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-white/60 text-sm mb-6">Trusted by forward-thinking organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/40">
              {['Startups', 'Nonprofits', 'Small Businesses', 'Enterprises'].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent-600" />
                  <span className="text-white/70">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <a href="#about" aria-label="Scroll to about section">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </a>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const { ref, isInView } = useInView(0.2);

  const stats = [
    { value: 50, suffix: '+', label: 'Clients Served' },
    { value: 100, suffix: '+', label: 'AI Training Sessions' },
    { value: 95, suffix: '%', label: 'Client Satisfaction' },
    { value: 3, suffix: '+', label: 'Years Experience' },
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-50 to-transparent rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-50 to-transparent rounded-full blur-3xl opacity-50" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full text-navy-700 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              About Us
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
              About KORIX LLC
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              KORIX LLC is a Dallas-based technology consulting agency specializing in AI training,
              AI implementation, business automation, and social media growth strategies. We help
              startups, nonprofits, and established businesses unlock efficiency, improve
              decision-making, and accelerate growth through practical AI solutions.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-navy-50 to-white rounded-xl border border-navy-100">
                <h3 className="font-semibold text-navy-900 flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-accent-700" />
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To democratize AI and digital innovation for businesses of all sizes,
                  making advanced technology accessible, practical, and results-driven.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-accent-50 to-white rounded-xl border border-accent-100">
                <h3 className="font-semibold text-navy-900 flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-accent-700" />
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  A future where every organization harnesses AI strategically to create
                  meaningful impact, sustainable growth, and lasting competitive advantage.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
                <h3 className="font-semibold text-navy-900 flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-accent-700" />
                  Why Choose Us
                </h3>
                <p className="text-gray-600">
                  We combine deep AI expertise with real-world business acumen, delivering
                  solutions that are practical, scalable, and aligned with your goals.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 gap-6 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Stat Card Component
const StatCard = ({ stat, index, isInView }: { stat: { value: number; suffix: string; label: string }; index: number; isInView: boolean }) => {
  const count = useCountUp(stat.value, 2000 + index * 200, isInView);

  return (
    <div className="relative p-8 bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent-700/10 rounded-full blur-2xl group-hover:bg-accent-700/20 transition-colors" />
      <div className="relative z-10">
        <div className="text-5xl font-bold text-white mb-2">
          {count}{stat.suffix}
        </div>
        <div className="text-white/70 font-medium">{stat.label}</div>
      </div>
    </div>
  );
};

// Services Section
const ServicesSection = ({ onNavigateToCourses, onNavigateToTraining }: { onNavigateToCourses: () => void; onNavigateToTraining: () => void }) => {
  const { ref, isInView } = useInView(0.1);

  const services = [
    {
      title: 'AI Training',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      items: [
        { icon: BookOpen, text: 'AI Fundamentals' },
        { icon: Users, text: 'Employee AI Workshops' },
        { icon: Bot, text: 'ChatGPT & Generative AI Training' },
        { icon: Sparkles, text: 'Prompt Engineering' },
        { icon: Zap, text: 'AI Productivity Systems' },
      ],
    },
    {
      title: 'AI Consulting',
      icon: Settings,
      color: 'from-accent-600 to-accent-700',
      items: [
        { icon: Search, text: 'AI Readiness Assessments' },
        { icon: Workflow, text: 'Business Process Automation' },
        { icon: Settings, text: 'Workflow Optimization' },
        { icon: Target, text: 'AI Strategy Development' },
        { icon: Wrench, text: 'AI Tool Selection & Implementation' },
      ],
    },
    {
      title: 'Social Media Management',
      icon: Share2,
      color: 'from-emerald-500 to-emerald-600',
      items: [
        { icon: PenTool, text: 'Content Strategy' },
        { icon: Sparkles, text: 'Content Creation' },
        { icon: CalendarDays, text: 'Social Media Scheduling' },
        { icon: UsersRound, text: 'Community Management' },
        { icon: PieChart, text: 'Analytics & Reporting' },
        { icon: Rocket, text: 'Brand Growth Campaigns' },
      ],
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full text-navy-700 text-sm font-medium mb-6">
            <Settings className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Comprehensive Solutions for Your Growth
          </h2>
          <p className="text-lg text-gray-600">
            We offer end-to-end AI and digital marketing services designed to transform
            your business operations and accelerate growth.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Header */}
              <div className={`p-6 rounded-t-2xl bg-gradient-to-r ${service.color}`}>
                <service.icon className="w-10 h-10 text-white mb-4" />
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
              </div>

              {/* Items */}
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-gray-700 group-hover:text-navy-900 transition-colors">
                      <item.icon className="w-5 h-5 text-accent-700 flex-shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Claude Courses callout — AI Training card only */}
                {service.title === 'AI Training' && (
                  <div className="mt-5 rounded-xl bg-navy-50 border border-navy-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-navy-700 flex-shrink-0" />
                      <span className="text-xs font-bold text-navy-700 uppercase tracking-widest">Anthropic Academy</span>
                    </div>
                    <p className="text-sm text-navy-600 leading-snug">
                      13 free, self-paced Claude courses — from AI basics to advanced API development.
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                {service.title === 'AI Training' ? (
                  <button
                    onClick={onNavigateToCourses}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Explore Claude Courses
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href="#contact"
                    className="group/link inline-flex items-center gap-2 text-accent-700 font-medium hover:text-accent-600 transition-colors"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Training Application Banner */}
        <div className="mt-16 mx-auto max-w-4xl px-4">
          <div className="rounded-2xl bg-gradient-to-r from-navy-900 to-navy-700 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-accent-400" />
                <span className="text-xs font-bold text-accent-400 uppercase tracking-widest">Free Workforce Training</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Are You Currently Unemployed?</h3>
              <p className="text-white/60 text-sm max-w-md">Apply for KORIX LLC's free training program. We help unemployed individuals build AI and digital skills for today's job market.</p>
            </div>
            <button
              onClick={onNavigateToTraining}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm whitespace-nowrap"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
const IndustriesSection = () => {
  const { ref, isInView } = useInView(0.2);

  const industries = [
    { icon: Building2, name: 'Small Businesses', desc: 'Scaling operations efficiently' },
    { icon: Rocket, name: 'Startups', desc: 'Building competitive advantages' },
    { icon: HeartHandshake, name: 'Nonprofits', desc: 'Maximizing impact with limited resources' },
    { icon: GraduationCap, name: 'Educational Organizations', desc: 'Modernizing learning experiences' },
    { icon: Globe, name: 'Government Contractors', desc: 'Meeting compliance with innovation' },
    { icon: BarChart3, name: 'Professional Services', desc: 'Enhancing client delivery' },
  ];

  return (
    <section className="py-20 lg:py-32 bg-navy-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Who We Serve
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-white/70">
            Our solutions adapt to the unique challenges and opportunities across various sectors.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <div
              key={industry.name}
              className={`group p-6 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <industry.icon className="w-8 h-8 text-accent-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-1">{industry.name}</h3>
              <p className="text-white/60">{industry.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Process Section
const ProcessSection = () => {
  const { ref, isInView } = useInView(0.15);

  const steps = [
    { num: '01', title: 'Discover', icon: Search, desc: 'We analyze your current operations, identify challenges, and uncover opportunities for AI and digital transformation.' },
    { num: '02', title: 'Strategize', icon: Target, desc: 'We develop a customized roadmap aligned with your business goals, timeline, and budget constraints.' },
    { num: '03', title: 'Implement', icon: Settings, desc: 'Our team deploys AI solutions and digital strategies with minimal disruption to your operations.' },
    { num: '04', title: 'Train', icon: GraduationCap, desc: 'We empower your team with comprehensive training to maximize the value of new tools and processes.' },
    { num: '05', title: 'Scale', icon: TrendingUp, desc: 'We continuously optimize and expand solutions to drive sustained growth and competitive advantage.' },
  ];

  return (
    <section id="process" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full text-navy-700 text-sm font-medium mb-6">
            <Workflow className="w-4 h-4" />
            Our Approach
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Our Proven Process
          </h2>
          <p className="text-lg text-gray-600">
            A structured methodology that ensures successful AI and digital transformation.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-navy-200 via-accent-500 to-navy-200 transform -translate-y-1/2" />

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`relative group transition-all duration-700 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Card */}
                <div className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 h-full">
                  {/* Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {step.num}
                    </div>
                    <step.icon className="w-6 h-6 text-accent-700" />
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-navy-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Why AI Section
const WhyAISection = () => {
  const { ref, isInView } = useInView(0.2);

  const benefits = [
    { icon: Zap, title: 'Increased Productivity', stat: '40', suffix: '%', desc: 'Average productivity boost with AI automation' },
    { icon: DollarSign, title: 'Reduced Costs', stat: '30', suffix: '%', desc: 'Operational cost savings for clients' },
    { icon: HeartHandshake, title: 'Better Customer Service', stat: '60', suffix: '%', desc: 'Faster response times with AI tools' },
    { icon: Clock, title: 'Faster Decision Making', stat: '5', suffix: 'x', desc: 'Speed improvement in data analysis' },
    { icon: Shield, title: 'Competitive Advantage', stat: '90', suffix: '%', desc: 'Of leading businesses use AI' },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The AI Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why AI Matters for Your Business
          </h2>
          <p className="text-lg text-white/70">
            AI isn't just technology—it's a strategic advantage that transforms how you work and grow.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`group p-8 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <benefit.icon className="w-10 h-10 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>

              {/* Stat */}
              <div className="mb-4">
                <AnimatedNumber value={benefit.stat} suffix={benefit.suffix} startCounting={isInView} />
              </div>

              <p className="text-white/60">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Animated Number Component
const AnimatedNumber = ({ value, suffix, startCounting }: { value: string; suffix: string; startCounting: boolean }) => {
  const count = useCountUp(parseInt(value), 2000, startCounting);

  return (
    <span className="text-4xl font-bold text-white">
      {count}{suffix}
    </span>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const { ref, isInView } = useInView(0.2);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: "KORIX LLC transformed how we approach content creation. Their AI training helped our team cut production time by 60% while improving quality.",
      author: "Sarah Johnson",
      role: "Small Business Owner",
      company: "Johnson Marketing Solutions",
      avatar: "SJ",
    },
    {
      quote: "The AI strategy session was game-changing. We identified automation opportunities we never knew existed and are now saving 20+ hours per week.",
      author: "Michael Chen",
      role: "Nonprofit Director",
      company: "Community First Foundation",
      avatar: "MC",
    },
    {
      quote: "From AI training to social media management, KORIX has been an invaluable partner. Their team truly understands how to make AI practical for startups.",
      author: "Alexandra Rivera",
      role: "Startup Founder",
      company: "TechForward Inc.",
      avatar: "AR",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full text-navy-700 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Client Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
            Real results from real businesses we've helped transform.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className={`transition-all duration-500 ${
                  index === activeIndex
                    ? 'opacity-100 transform scale-100'
                    : 'opacity-0 transform scale-95 absolute inset-0 pointer-events-none'
                }`}
                style={{ display: index === activeIndex ? 'block' : 'none' }}
              >
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg relative">
                  <Quote className="absolute top-8 left-8 w-12 h-12 text-navy-100" />

                  <div className="relative">
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-navy-700 to-navy-900 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-navy-900">{testimonial.author}</div>
                        <div className="text-gray-500">{testimonial.role}</div>
                        <div className="text-accent-700 text-sm font-medium">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-accent-700 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const { ref, isInView } = useInView(0.3);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-accent-700 via-accent-800 to-accent-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Let's discuss how AI and strategic digital marketing can help your
            organization achieve measurable growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="group px-8 py-4 bg-white hover:bg-gray-100 text-accent-800 font-semibold rounded-xl transition-all hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all backdrop-blur-sm border border-white/30 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const { ref, isInView } = useInView(0.15);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 rounded-full text-navy-700 text-sm font-medium mb-6">
            <Phone className="w-4 h-4" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Start Your AI Journey Today
          </h2>
          <p className="text-lg text-gray-600">
            Ready to see what AI and strategic digital marketing can do for your business?
            Let's talk.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-gray-50 rounded-2xl p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-navy-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-6">We've received your message and will be in touch within 24 hours.</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-accent-700 font-medium hover:text-accent-600"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-accent-700 focus:border-transparent outline-none transition-all`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-accent-700 focus:border-transparent outline-none transition-all`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent-700 focus:border-transparent outline-none transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent-700 focus:border-transparent outline-none transition-all"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      } focus:ring-2 focus:ring-accent-700 focus:border-transparent outline-none transition-all resize-none`}
                      placeholder="Tell us about your project or goals..."
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-accent-700 hover:bg-accent-800 disabled:bg-accent-400 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className={`space-y-8 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900">Location</h3>
                  <p className="text-gray-600">Fort Worth, Dallas, Texas, USA</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900">Email</h3>
                  <p className="text-gray-600">korixllc@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM CST</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-64 lg:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214556.64200855075!2d-96.86827964179689!3d32.8205874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e993d0ed5e9f1%3A0xb4c8a7e4e3e3e3e3!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KORIX LLC Location - Fort Worth, Dallas, Texas"
              />
            </div>

            {/* Social Links */}
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  return (
    <footer className="bg-navy-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="inline-block bg-white rounded-lg overflow-hidden">
                <img
                  src="/WhatsApp_Image_2026-06-15_at_06.33.37.jpeg"
                  alt="KORIX LLC"
                  className="h-28 w-auto object-contain px-3 py-2"
                />
              </div>
            </div>
            <p className="text-2xl font-bold text-white/90 mb-4">
              Focus <span className="text-accent-500">o</span> Execute <span className="text-accent-500">o</span> Win
            </p>
            <p className="text-white/60 max-w-md">
              Empowering businesses in Dallas and beyond with AI training, consulting,
              and strategic digital growth solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '#about', label: 'About Us' },
                { href: '#services', label: 'Services' },
                { href: '#process', label: 'Our Process' },
                { href: '#testimonials', label: 'Testimonials' },
                { href: '#contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Claude Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('training')}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Training Application
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {[
                'AI Training',
                'AI Consulting',
                'Social Media Management',
                'Business Automation',
                'Content Strategy',
              ].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-white/60 hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          <p className="text-white/30 text-xs text-center tracking-wide">
            KORIX LLC &ndash; Texas Limited Liability Company &nbsp;&bull;&nbsp; EIN: 42-2983677 &nbsp;&bull;&nbsp; UEI: FERJZSV2LC45 &nbsp;&bull;&nbsp; Registered in the State of Texas
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            Copyright &copy; {new Date().getFullYear()} KORIX LLC. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <button onClick={() => onNavigate('terms')} className="text-white/60 hover:text-white transition-colors">
              Terms &amp; Conditions
            </button>
            <button onClick={() => onNavigate('privacy')} className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('cookies')} className="text-white/60 hover:text-white transition-colors">
              Cookie Policy
            </button>
            <button onClick={() => onNavigate('admin')} className="text-white/20 hover:text-white/50 transition-colors text-xs">
              Admin
            </button>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function App() {
  const [page, setPage] = useState<Page>('home');

  const navigate = (target: Page) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (page === 'terms') return <TermsPage onBack={() => navigate('home')} />;
  if (page === 'privacy') return <PrivacyPage onBack={() => navigate('home')} />;
  if (page === 'cookies') return <CookiePage onBack={() => navigate('home')} />;
  if (page === 'courses') return <ClaudeCoursesPage onBack={() => navigate('home')} />;
  if (page === 'training') return <TrainingApplicationPage onBack={() => navigate('home')} />;
  if (page === 'admin') return <AdminDashboard onBack={() => navigate('home')} />;

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection onNavigateToCourses={() => navigate('courses')} onNavigateToTraining={() => navigate('training')} />
        <IndustriesSection />
        <ProcessSection />
        <WhyAISection />
        <TestimonialsSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
