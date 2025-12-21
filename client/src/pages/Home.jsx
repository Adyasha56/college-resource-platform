import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Users, Award, TrendingUp, Download, User, Mail, HelpCircle, ArrowRight } from 'lucide-react';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [email, setEmail] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        alert(`Thank you! We'll notify you at ${email} when personalized recommendations are ready.`);
        setEmail('');
        setShowNotifyModal(false);
        // Note: localStorage not available in Claude artifacts
        // localStorage.setItem('notifyEmail', email);
      } catch (error) {
        alert('Something went wrong. Please try again.',error);
      }
    }
  };

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Question Papers",
      description: "Access previous year question papers from top colleges. Download and practice to ace your exams.",
      color: "from-[#547792] to-[#213448]"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Placement Records",
      description: "Explore placement statistics and success stories from your seniors to guide your career path.",
      color: "from-[#94B4C1] to-[#547792]"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Connect with fellow students, share resources, and build your academic network.",
      color: "from-[#547792] to-[#94B4C1]"
    }
  ];

  const workingFeatures = [
    {
      icon: <Download className="w-6 h-6" />,
      title: "Question Paper Downloads",
      description: "Access and download previous year question papers from universities.",
      highlight: "Available Now"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Placement Analytics",
      description: "Get insights into placement trends, company visits, and salary packages.",
      highlight: "Live Data"
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Profile Management",
      description: "Create your academic profile and track your progress over time.",
      highlight: "Personalized Dashboard"
    }
  ];

  const developmentFeatures = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Forum",
      description: "Working on that to bring you peer connections and resource sharing.",
      highlight: "Coming Soon"
    }
  ];

  const faqs = [
    {
      question: "What is EduHub?",
      answer: "EduHub is your academic success platform that provides question papers, placement records, and will soon offer community features and personalized recommendations."
    },
    {
      question: "How do I access question papers?",
      answer: "Simply register/login and navigate to the Question Papers section. You can browse by college, year, and subject, then download the papers you need."
    },
    {
      question: "Is EduHub free to use?",
      answer: "Yes! EduHub is completely free for all students. Our mission is to make academic resources accessible to everyone."
    },
    {
      question: "When will the community features be available?",
      answer: "We're actively working on community features and personalized recommendations. Sign up for notifications to be the first to know when they're ready!"
    }
  ];

  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #E8F4F8 0%, #B8D4E3 25%, #547792 75%, #213448 100%)' }}>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-[#547792] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          ></div>
          <div 
            className="absolute top-40 right-10 w-96 h-96 bg-[#94B4C1] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ 
              transform: `translateY(${scrollY * 0.3}px)`,
              animationDelay: '2s'
            }}
          ></div>
          <div 
            className="absolute -bottom-32 left-1/2 w-80 h-80 bg-[#ECEFCA] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ 
              transform: `translateX(-50%) translateY(${scrollY * 0.2}px)`,
              animationDelay: '4s'
            }}
          ></div>
        </div>

        {/* Floating Icons - Now throughout entire page */}
        <div className="absolute inset-0 pointer-events-none" style={{ height: '200vh' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-[#ECEFCA] opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 200}%`,
                animationDelay: `${i * 0.5}s`,
                fontSize: '2rem',
                animationDuration: '6s'
              }}
            >
              {i % 4 === 0 ? '📚' : i % 4 === 1 ? '🎓' : i % 4 === 2 ? '💡' : '📝'}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="transform transition-all duration-1000">
            <div className="flex items-center justify-center mb-6">
              {/* Enhanced EduHub Title with better mobile visibility */}
              <div className="relative">
                {/* Main title with deep blue colors for better contrast against light background */}
                <h1 className="relative text-5xl sm:text-6xl md:text-8xl font-black leading-tight tracking-wide">
                  <span className="text-[#213448] drop-shadow-lg">
                    Edu
                  </span>
                  <span className="text-[#547792] drop-shadow-lg">
                    Hub
                  </span>
                </h1>
                {/* Subtle shadow for depth */}
                <div className="absolute inset-0 text-5xl sm:text-6xl md:text-8xl font-black text-[#94B4C1] opacity-20 transform translate-x-1 translate-y-1 blur-[1px]">
                  EduHub
                </div>
              </div>
              <div className="ml-4 text-3xl sm:text-4xl md:text-5xl animate-bounce">🎓</div>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-4 text-[#213448] font-bold">
              Your Academic Success Platform
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-[#547792] max-w-3xl mx-auto leading-relaxed font-medium">
              Instantly match with top college resources and simplify your academic journey. 
              Whether you're stuck with placement prep, notes, or projects—we've got your back.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-r from-[#213448] to-[#547792] hover:from-[#547792] hover:to-[#213448] text-white font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                <span className="group-hover:animate-bounce inline-block">Explore Resources</span> 
                <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-[#547792] opacity-80" />
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ECEFCA] to-[#94B4C1] bg-clip-text text-transparent">
              Features
            </h2>
            <p className="text-xl text-[#547792] max-w-2xl mx-auto">
              Everything you need to excel in your academic journey, all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-[#547792]/20 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.2}s`,
                  opacity: 0
                }}
              >
                {index === 2 && (
                  <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    Under Development
                  </div>
                )}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#94B4C1] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#ECEFCA] leading-relaxed opacity-80">
                  {feature.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#547792]/0 to-[#94B4C1]/0 group-hover:from-[#547792]/5 group-hover:to-[#94B4C1]/5 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20" style={{ background: 'linear-gradient(90deg, rgba(84, 119, 146, 0.2) 0%, rgba(148, 180, 193, 0.2) 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What We Offer
            </h2>
          </div>

          {/* Working Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#94B4C1] mb-6 text-center">Available Now</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {workingFeatures.map((item, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-[#547792]/20 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#547792] to-[#94B4C1] flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <span className="text-xs text-[#94B4C1] font-semibold">{item.highlight}</span>
                    </div>
                  </div>
                  <p className="text-[#ECEFCA] opacity-80 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Development Features */}
          <div>
            <h3 className="text-2xl font-bold text-[#94B4C1] mb-6 text-center">Under Development</h3>
            <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
              {developmentFeatures.map((item, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-orange-300/40 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <span className="text-xs text-orange-300 font-semibold">{item.highlight}</span>
                    </div>
                  </div>
                  <p className="text-[#ECEFCA] opacity-80 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(33, 52, 72, 0.3) 0%, rgba(84, 119, 146, 0.3) 100%)' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-6">
              <span className="text-orange-300 font-semibold">🚀 Coming Soon</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#ECEFCA] via-[#94B4C1] to-[#ECEFCA] bg-clip-text text-transparent">
              Personalized Recommendations
            </h2>
            
            <p className="text-xl text-[#ECEFCA] mb-8 leading-relaxed opacity-90">
              Get AI-powered recommendations tailored to your academic profile, 
              career goals, and learning patterns. Our intelligent system will suggest 
              the most relevant resources, study materials, and opportunities just for you.
            </p>

            <div className="bg-white/5 backdrop-blur-sm border rounded-2xl p-8 mb-8" style={{ borderColor: 'rgba(84, 119, 146, 0.2)' }}>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#547792] to-[#94B4C1] flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Under Development</h3>
              <p className="text-[#ECEFCA] opacity-80">
                Working on that to bring you the most advanced recommendation 
                system for academic resources. Stay tuned for updates!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowNotifyModal(true)}
                className="bg-gradient-to-r from-[#547792] to-[#94B4C1] text-[#213448] font-semibold py-3 px-8 rounded-full hover:from-[#94B4C1] hover:to-[#547792] transition-all duration-300"
              >
                <Mail className="inline mr-2 w-4 h-4" />
                Notify Me When Ready
              </button>
              <button 
                onClick={() => setShowFAQ(true)}
                className="border-2 border-[#94B4C1]/30 text-[#94B4C1] font-semibold py-3 px-8 rounded-full hover:bg-[#94B4C1]/10 transition-all duration-300"
              >
                <HelpCircle className="inline mr-2 w-4 h-4" />
                FAQs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notify Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#ECEFCA] rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-[#213448] mb-4">Get Notified</h3>
            <p className="text-[#547792] mb-6">
              Enter your email to get notified when personalized recommendations are ready!
            </p>
            <form onSubmit={handleNotifySubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border-2 border-[#94B4C1] rounded-lg mb-4 focus:border-[#547792] outline-none bg-white text-[#213448] placeholder-[#547792]"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#547792] to-[#213448] text-white py-3 rounded-lg hover:from-[#213448] hover:to-[#547792] transition-all"
                >
                  Notify Me
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotifyModal(false)}
                  className="flex-1 border-2 border-[#94B4C1] text-[#547792] py-3 rounded-lg hover:bg-[#94B4C1] hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-black/50"
            onClick={() => setShowFAQ(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-[#ECEFCA] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden transform transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#547792] to-[#213448] p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h3>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="text-white hover:text-[#94B4C1] text-3xl font-bold transition-colors hover:scale-110 transform duration-200"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* FAQ Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="border-b border-[#94B4C1]/30 pb-6 last:border-b-0"
                  >
                    <h4 className="text-lg font-bold text-[#213448] mb-3 flex items-center">
                      <span className="w-6 h-6 bg-gradient-to-r from-[#547792] to-[#94B4C1] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      {faq.question}
                    </h4>
                    <p className="text-[#547792] leading-relaxed pl-9">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gradient-to-r from-[#94B4C1]/10 to-[#547792]/10 p-4 text-center">
              <p className="text-[#547792] text-sm">Still have questions? Feel free to contact us!</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Home;