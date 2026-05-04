"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaChurch,
  FaBook,
  FaNewspaper,
  FaChevronUp,
  FaExternalLinkAlt,
  FaLink,
  FaInfoCircle,
  FaUserFriends,
  FaHandsHelping,
  FaBookOpen,
  FaCross,
  FaBible,
} from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [showYoutubeOptions, setShowYoutubeOptions] = useState(false);
  const [hoveredSite, setHoveredSite] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "About Us", href: "/about", icon: FaUserFriends },
    { name: "Fundamental Principles", href: "/doctrine/fundermental-principle", icon: FaCross },
    { name: "Baptismal Vows", href: "/doctrine/baptisimal-vows", icon: FaHandsHelping },
    { name: "Blog", href: "/blog", icon: FaBookOpen },
  ];

  const services = [
    { name: "Publications", href: "/library", icon: FaBook },
    { name: "Bible Studies", href: "/library", icon: FaBible },
  ];

  const otherSites = [
    { 
      name: "1889 HSDA USA", 
      href: "https://www.1889hsda-usa.org/", 
      icon: FaGlobe,
      description: "A virtual platform offering Bible study, prayer, and fellowship for SDA believers worldwide.",
      color: "from-blue-600 to-blue-800",
      previewColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    { 
      name: "Smyrna Church", 
      href: "https://smyrna.org/", 
      icon: FaGlobe,
      description: "Provides local and online fellowship, teaching, and community rooted in historic SDA principles.",
      color: "from-purple-600 to-purple-800",
      previewColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    { 
      name: "Revelation With Daniel", 
      href: "https://www.revelationwithdaniel.com/", 
      icon: FaGlobe,
      description: "Offers verse-by-verse Bible studies on Daniel and Revelation to share God's truths before Christ's return.",
      color: "from-amber-600 to-amber-800",
      previewColor: "bg-amber-50 dark:bg-amber-900/20"
    },
    { 
      name: "As It Reads", 
      href: "https://asitreads.com/", 
      icon: FaGlobe,
      description: "Focuses on understanding the Bible plainly, in harmony with Scripture and Ellen G. White's writings.",
      color: "from-emerald-600 to-emerald-800",
      previewColor: "bg-emerald-50 dark:bg-emerald-900/20"
    },
  ];

  const youtubeChannels = [
    { 
      name: "Gospel Sounders", 
      href: "https://youtube.com/@gospelsounders?si=2UOqYmMWmr_gFN3a",
      subscribers: "Main Channel",
      icon: FaYoutube,
      color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    },
    { 
      name: "GS Publications", 
      href: "https://youtube.com/@gspublications?si=zLuVyiS--BF1NXJW",
      subscribers: "Publications Channel",
      icon: FaYoutube,
      color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    },
  ];

  const socialMedia = [
    { 
      icon: FaFacebookF, 
      href: "https://facebook.com/groups/435293693285693", 
      label: "Facebook Group",
      color: "hover:bg-blue-500 dark:hover:bg-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      tooltip: "Join our Facebook Community"
    },
    { 
      icon: FaWhatsapp, 
      href: "https://wa.me/254722878683", 
      label: "WhatsApp",
      color: "hover:bg-green-500 dark:hover:bg-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      tooltip: "Chat with us on WhatsApp"
    },
    { 
      icon: FaYoutube, 
      href: "#youtube-channels", 
      label: "YouTube",
      color: "hover:bg-red-500 dark:hover:bg-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      tooltip: "Visit our YouTube Channels",
      onClick: () => setShowYoutubeOptions(!showYoutubeOptions)
    },
    { 
      icon: FaEnvelope, 
      href: "mailto:Gspublicationsmissions@gmail.com", 
      label: "Email",
      color: "hover:bg-purple-500 dark:hover:bg-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      tooltip: "Send us an email"
    },
  ];

  const handleSiteHover = (index: number) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredSite(index);
  };

  const handleSiteLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredSite(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  // Close YouTube dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setShowYoutubeOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative bg-white dark:bg-gray-900 border-t border-blue-200/30 dark:border-blue-900/30"
    >
      {/* Decorative Elements - Blue themed */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #2563EB 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl space-y-10">
        {/* Useful Sites Cards with Hover Preview */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Useful Sites
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Explore these selected websites for further study and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherSites.map((site, i) => (
            <div key={i} className="relative">
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-200 dark:border-blue-900/50 block"
                onMouseEnter={() => handleSiteHover(i)}
                onMouseLeave={handleSiteLeave}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${site.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${site.color} text-white`}>
                    <site.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {site.name}
                      </span>
                      <FaExternalLinkAlt className="w-3 h-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all group-hover:scale-110 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {site.description}
                    </p>
                  </div>
                </div>
              </a>

              {/* Hover Preview Card */}
              {hoveredSite === i && (
                <div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-64"
                  onMouseEnter={() => handleSiteHover(i)}
                  onMouseLeave={handleSiteLeave}
                >
                  <div className={`rounded-lg shadow-2xl border ${site.previewColor} border-gray-200 dark:border-gray-700 p-4 animate-fadeIn`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${site.color}`}>
                        <site.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{site.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{site.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FaInfoCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Click to visit website</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaLink className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span className="truncate text-gray-600 dark:text-gray-400">{site.href.replace('https://', '')}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <a
                        href={site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Visit Site
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-200 dark:border-t-gray-700"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="h-full rounded-2xl p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm border border-blue-200/50 dark:border-blue-900/30 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                    <FaGlobe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Gospel Sounders
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed italic border-l-4 border-blue-600 pl-4">
                  "Revealing the Father and the Son through sound doctrine and missionary work."
                </p>
              </div>
              
              {/* Social Media Icons - Compact */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Connect With Us
                </h4>
                <div className="flex flex-wrap gap-2">
                  {socialMedia.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target={social.href.startsWith('#') ? '_self' : '_blank'}
                      rel={social.href.startsWith('#') ? '' : 'noopener noreferrer'}
                      onClick={social.onClick}
                      className={`relative p-2.5 rounded-lg ${social.bgColor} ${social.color} transition-all hover:scale-110 group`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" />
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {social.tooltip}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="h-full rounded-2xl p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm border border-blue-200/50 dark:border-blue-900/30 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-blue-200 dark:border-blue-900/30">
                <span className="flex items-center gap-2">
                  <FaBookOpen className="text-blue-600 dark:text-blue-400" />
                  Quick Links
                </span>
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all group"
                    >
                      <link.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="h-full rounded-2xl p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm border border-blue-200/50 dark:border-blue-900/30 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-2 border-b border-blue-200 dark:border-blue-900/30">
                <span className="flex items-center gap-2">
                  <FaHandsHelping className="text-blue-600 dark:text-blue-400" />
                  Our Services
                </span>
              </h4>
              <ul className="space-y-2">
                {services.map((service, i) => (
                  <li key={i}>
                    <a
                      href={service.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all group"
                    >
                      <service.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform">
                        {service.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact + YouTube */}
          <div>
            <div className="h-full rounded-2xl p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm border border-blue-200/50 dark:border-blue-900/30 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-blue-200 dark:border-blue-900/30 mb-6">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                  Contact & YouTube
                </span>
              </h4>

              {/* Contact Info - Fixed Layout */}
              <div className="space-y-4 mb-6">
                {[
                  { 
                    icon: FaMapMarkerAlt, 
                    text: "Kenya – Africa", 
                    color: "text-blue-500",
                    bgColor: "bg-blue-100 dark:bg-blue-900/30"
                  },
                  { 
                    icon: FaEnvelope, 
                    text: "Gspublicationsmissions@gmail.com", 
                    href: "mailto:Gspublicationsmissions@gmail.com", 
                    color: "text-purple-500",
                    bgColor: "bg-purple-100 dark:bg-purple-900/30"
                  },
                  { 
                    icon: FaPhoneAlt, 
                    text: "+254 722 878683", 
                    href: "tel:+254722878683", 
                    color: "text-green-500",
                    bgColor: "bg-green-100 dark:bg-green-900/30"
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className={`p-2 rounded-lg ${item.color} ${item.bgColor} flex-shrink-0 mt-0.5`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.href ? (
                      <a 
                        href={item.href} 
                        className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group-hover:underline break-words"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* YouTube Channels - Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowYoutubeOptions(!showYoutubeOptions)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl group"
                >
                  <FaYoutube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Visit Our YouTube Channels</span>
                  <FaChevronUp className={`w-4 h-4 transition-transform ${showYoutubeOptions ? 'rotate-180' : ''}`} />
                </button>
                
                {showYoutubeOptions && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
                    <div className="space-y-2 p-3 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-2xl backdrop-blur-sm border border-red-200 dark:border-red-900/30 animate-fadeIn">
                      {youtubeChannels.map((yt, i) => (
                        <a
                          key={i}
                          href={yt.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                        >
                          <div className={`p-2 rounded-lg ${yt.color}`}>
                            <yt.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 truncate">
                              {yt.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {yt.subscribers}
                            </div>
                          </div>
                          <FaExternalLinkAlt className="w-3 h-3 text-gray-400 group-hover:text-red-500 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-200 dark:border-blue-900/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <p className="text-gray-700 dark:text-gray-300">
                © {year} Gospel Sounders Publications & Missions. All rights reserved.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Revealing the Father and the Son.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors px-2"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors px-2"
              >
                Terms of Use
              </Link>

              <Link
                href="/cookies"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors px-2"
              >
                Cookies
              </Link>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all hover:scale-105 shadow-lg"
            >
              <FaChevronUp className="w-4 h-4" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </footer>
  );
}