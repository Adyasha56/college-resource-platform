import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  FileText,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Play,
  Star,
  ChevronUp,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsNavOpen(false);
  };

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Question Papers",
      description: "Access previous year question papers from top universities. Download, practice, and ace your exams with our comprehensive collection.",
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      delay: 0
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Placement Records",
      description: "Explore detailed placement statistics, interview questions, and success stories from your seniors to guide your career path.",
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      delay: 0.1
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Dashboard",
      description: "Track your progress, save resources, and get personalized recommendations based on your interests and goals.",
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      delay: 0.2
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Connect with fellow students, share resources, ask questions, and build your academic network.",
      color: "bg-gradient-to-br from-cyan-500 to-blue-600",
      badge: "Coming Soon",
      delay: 0.3
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Recommendations",
      description: "Get AI-powered suggestions for study materials, career paths, and opportunities tailored just for you.",
      color: "bg-gradient-to-br from-yellow-500 to-orange-600",
      badge: "Coming Soon",
      delay: 0.4
    }
  ];

  const stats = [
    { number: "1000+", label: "Question Papers", icon: <FileText className="w-6 h-6" /> },
    { number: "50+", label: "Companies", icon: <Award className="w-6 h-6" /> },
    { number: "500+", label: "Students", icon: <Users className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const faqs = [
    {
      question: "What is EduHub?",
      answer: "EduHub is a comprehensive academic success platform designed for college students. We provide access to previous year question papers, detailed placement records with interview questions, career insights, and personalized recommendations to help you excel in your academic journey."
    },
    {
      question: "How do I access question papers?",
      answer: "Simply create a free account or login, then navigate to the Question Papers section. You can browse papers by college, branch, semester, and subject. Download any paper instantly in PDF format for offline studying."
    },
    {
      question: "What placement information is available?",
      answer: "Our placement section includes company-wise records showing CTC packages, number of students placed, eligibility criteria, required skills, and most importantly - actual interview questions asked during placement drives, similar to Glassdoor reviews."
    },
    {
      question: "Is EduHub free to use?",
      answer: "Yes! EduHub is completely free for all students. Our mission is to make quality academic resources accessible to everyone. Create your account today and start exploring."
    },
    {
      question: "How can I contribute to the platform?",
      answer: "We welcome contributions! If you have question papers, placement experiences, or interview questions to share, you can submit them through our platform. Your contributions help fellow students succeed."
    },
    {
      question: "What features are coming soon?",
      answer: "We're actively developing a community forum for peer discussions, AI-powered personalized recommendations, study groups, and mentorship programs. Sign up to get notified when these features launch!"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CSE Student, 2024",
      content: "EduHub's question papers helped me prepare thoroughly for my exams. The placement records gave me insights into what companies expect!",
      avatar: "PS"
    },
    {
      name: "Rahul Kumar",
      role: "IT Student, 2024",
      content: "The interview questions section is a goldmine! I knew exactly what to expect in my TCS interview. Got placed with 7 LPA!",
      avatar: "RK"
    },
    {
      name: "Ananya Patel",
      role: "ECE Student, 2023",
      content: "Best platform for placement preparation. The company-wise records and success rates helped me target the right companies.",
      avatar: "AP"
    }
  ];

  return (
    <div className="min-h-screen bg-[#ECEFCA] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#547792] to-[#213448] rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#213448]">
                Edu<span className="text-[#547792]">Hub</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <span 
                onClick={() => scrollToSection('features')} 
                className="text-[#213448] hover:text-[#547792] font-medium cursor-pointer"
              >
                Features
              </span>
              <span 
                onClick={() => scrollToSection('about')} 
                className="text-[#213448] hover:text-[#547792] font-medium cursor-pointer"
              >
                About
              </span>
              <span 
                onClick={() => scrollToSection('testimonials')} 
                className="text-[#213448] hover:text-[#547792] font-medium cursor-pointer"
              >
                Testimonials
              </span>
              <span 
                onClick={() => scrollToSection('faq')} 
                className="text-[#213448] hover:text-[#547792] font-medium cursor-pointer"
              >
                FAQs
              </span>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="bg-[#94B4C1] text-[#213448] px-6 py-2.5 rounded-full font-semibold hover:bg-[#7da3b3] transition-all duration-300 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="md:hidden p-2 text-[#213448]"
            >
              {isNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isNavOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left py-2 text-[#213448] hover:text-[#547792] font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="block w-full text-left py-2 text-[#213448] hover:text-[#547792] font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="block w-full text-left py-2 text-[#213448] hover:text-[#547792] font-medium"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="block w-full text-left py-2 text-[#213448] hover:text-[#547792] font-medium"
              >
                FAQs
              </button>
              <Link
                to="/login"
                className="block w-full bg-[#94B4C1] text-[#213448] px-6 py-3 rounded-full font-semibold text-center mt-4 hover:bg-[#7da3b3]"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background Elements - Simplified for performance */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ECEFCA] via-[#94B4C1]/20 to-[#547792]/10"></div>
          
          {/* Decorative Circles - Reduced blur for better performance */}
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#94B4C1]/15 rounded-full"></div>
          <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-[#547792]/10 rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#ECEFCA]/50 rounded-full"></div>
          
          {/* Static Floating Elements - No animation for performance */}
          <div className="absolute top-32 right-20 text-6xl hidden lg:block opacity-80">📚</div>
          <div className="absolute top-60 left-20 text-5xl hidden lg:block opacity-80">🎓</div>
          <div className="absolute bottom-40 right-40 text-4xl hidden lg:block opacity-80">💡</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#547792]" />
                <span className="text-sm font-medium text-[#213448]">Your Academic Success Partner</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-[#213448]">Fun and </span>
                <span className="text-[#547792] italic">resourceful</span>
                <br />
                <span className="text-[#213448]">platform designed to </span>
                <br />
                <span className="bg-gradient-to-r from-[#547792] to-[#213448] bg-clip-text text-transparent italic">
                  spark success
                </span>
              </h1>

              <p className="text-lg text-[#547792] mb-8 max-w-xl leading-relaxed">
                Access question papers, explore placement records with real interview questions, 
                and get personalized guidance for your academic journey. Everything you need to 
                excel in college, all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group bg-[#eef3f5] text-[#213448] px-8 py-4 rounded-full font-semibold hover:bg-[#7da3b3] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Resources
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="group border-2 border-[#547792] text-[#547792] px-8 py-4 rounded-full font-semibold hover:bg-[#547792] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Learn More
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-[#94B4C1]/30">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-[#547792]/10 rounded-lg flex items-center justify-center text-[#547792]">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#213448]">{stat.number}</p>
                      <p className="text-sm text-[#547792]">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image/Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-[#547792] to-[#213448] rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">EduHub</h3>
                        <p className="text-[#94B4C1]">Academic Excellence</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span>Question Papers Ready</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span>Placement Records Updated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span>Interview Questions Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#ECEFCA] rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-[#213448]">📄</p>
                      <p className="text-sm font-medium text-[#547792] mt-1">Papers</p>
                    </div>
                    <div className="bg-[#ECEFCA] rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-[#213448]">🎯</p>
                      <p className="text-sm font-medium text-[#547792] mt-1">Placements</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#213448]">Learn With Us!</p>
                    <p className="text-sm text-[#547792]">Join 500+ students</p>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-br from-[#547792] to-[#213448] rounded-2xl shadow-xl p-4 text-white">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    <span className="font-bold">95% Success</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={() => scrollToSection('features')}
            className="flex flex-col items-center text-[#547792] hover:text-[#213448]"
          >
            <span className="text-sm font-medium mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#547792]/10 text-[#547792] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#213448] mb-4">
              Everything You Need to <span className="text-[#547792]">Succeed</span>
            </h2>
            <p className="text-lg text-[#547792] max-w-2xl mx-auto">
              From question papers to placement guidance, we've got all the resources 
              to help you excel in your academic journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-[#94B4C1]">
                {feature.badge && (
                  <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {feature.badge}
                  </span>
                )}
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#213448] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#547792] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-[#2f465f] to-[#547792] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white/10 text-[#94B4C1] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ABOUT EDUHUB
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ">
                Empowering Students to Achieve <span className="text-[#eef4f7]">Their Dreams</span>
              </h2>
              <p className="text-lg text-[#e3e8ea] mb-6 leading-relaxed">
                EduHub was created with a simple mission: to make quality academic resources 
                accessible to every student. We understand the challenges of college life – 
                finding the right study materials, preparing for placements, and navigating 
                your career path.
              </p>
              <p className="text-lg text-[#f1f5f7] mb-8 leading-relaxed">
                Our platform brings together previous year question papers, comprehensive 
                placement records with real interview questions (like Glassdoor for campus 
                placements), and personalized recommendations – all in one place.
              </p>

              <div className="space-y-4">
                {[
                  "Free access to all resources",
                  "Real placement data and interview questions",
                  "Regular updates with new content",
                  "Student-friendly interface"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-[#e4eaed] text-[#213448] px-8 py-4 rounded-full font-semibold mt-8 hover:bg-[#7da3b3] transition-all duration-300"
              >
                Join EduHub Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <BookOpen className="w-10 h-10 text-[#94B4C1] mb-4" />
                    <h4 className="text-xl font-bold mb-2">Study Smart</h4>
                    <p className="text-[#94B4C1] text-sm">Access curated question papers to practice effectively</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <Target className="w-10 h-10 text-[#94B4C1] mb-4" />
                    <h4 className="text-xl font-bold mb-2">Get Placed</h4>
                    <p className="text-[#94B4C1] text-sm">Learn from real interview experiences</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <TrendingUp className="w-10 h-10 text-[#94B4C1] mb-4" />
                    <h4 className="text-xl font-bold mb-2">Track Progress</h4>
                    <p className="text-[#94B4C1] text-sm">Monitor your academic growth</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <Users className="w-10 h-10 text-[#94B4C1] mb-4" />
                    <h4 className="text-xl font-bold mb-2">Connect</h4>
                    <p className="text-[#94B4C1] text-sm">Build your academic network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#ECEFCA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#547792]/10 text-[#547792] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#213448] mb-4">
              What Students <span className="text-[#547792]">Say About Us</span>
            </h2>
            <p className="text-lg text-[#547792] max-w-2xl mx-auto">
              Hear from students who've transformed their academic journey with EduHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-[#547792] mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#547792] to-[#213448] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#213448]">{testimonial.name}</p>
                    <p className="text-sm text-[#547792]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#547792]/10 text-[#547792] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#213448] mb-4">
              Frequently Asked <span className="text-[#547792]">Questions</span>
            </h2>
            <p className="text-lg text-[#547792]">
              Got questions? We've got answers!
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  <span className="font-semibold text-[#e0e7ed] pr-4">{faq.question}</span>
                  <span className={`flex-shrink-0 w-8 h-8 bg-[#94B4C1]/20 rounded-full flex items-center justify-center ${
                    activeAccordion === index ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className="w-5 h-5 text-[#547792]" />
                  </span>
                </button>
                {activeAccordion === index && (
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[#547792] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#213448] text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#547792] to-[#94B4C1] rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  Edu<span className="text-[#94B4C1]">Hub</span>
                </span>
              </Link>
              <p className="text-[#94B4C1] leading-relaxed mb-6 max-w-sm">
                Your comprehensive platform for academic success. Access question papers, 
                placement records, interview questions, and career guidance all in one place.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#547792]/30 rounded-lg flex items-center justify-center text-[#94B4C1] hover:bg-[#547792] hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#547792]/30 rounded-lg flex items-center justify-center text-[#94B4C1] hover:bg-[#0077b5] hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#547792]/30 rounded-lg flex items-center justify-center text-[#94B4C1] hover:bg-[#1da1f2] hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3 text-[#94B4C1]">
                <li>
                  <span onClick={() => scrollToSection('features')} className="hover:text-white cursor-pointer">Features</span>
                </li>
                <li>
                  <span onClick={() => scrollToSection('about')} className="hover:text-white cursor-pointer">About Us</span>
                </li>
                <li>
                  <span onClick={() => scrollToSection('testimonials')} className="hover:text-white cursor-pointer">Testimonials</span>
                </li>
                <li>
                  <span onClick={() => scrollToSection('faq')} className="hover:text-white cursor-pointer">FAQs</span>
                </li>
              </ul>
            </div>



            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-[#94B4C1]">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@eduhub.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 xxxxx</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>Bhubaneswar, Odisha, India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#547792]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#94B4C1] text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} EduHub. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-[#94B4C1]">
                <Link to="/" className="hover:text-white">Privacy Policy</Link>
                <Link to="/" className="hover:text-white">Terms of Service</Link>
                <Link to="/" className="hover:text-white">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-[#547792] to-[#213448] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Home;