import React from "react";
import { Mail, Twitter, Linkedin, Rss, Heart, Zap } from "lucide-react";

// Western Star logo
const logo = "/western-star-logo.png";

export function Footer() {
  // Static data for footer
  const siteData = {
    name: "Western Star",
    description: "Leading insights and analysis for strategic decision-making.",
  };

  const footerData = {
    contact: {
      email: "info@westernstar.com",
      phone: "+1 (555) 123-4567",
    },
  };

  return (
    <footer className="bg-brand-navy border-t border-brand-teal/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal via-brand-orange to-brand-coral"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-gradient-to-br from-brand-teal/10 to-brand-coral/10 rounded-full blur-2xl"></div>
        <div className="absolute top-10 left-20 w-24 h-24 bg-gradient-to-br from-brand-orange/10 to-brand-coral/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="Western Star logo"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-teal/30 group-hover:ring-brand-coral/50 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-teal/20 to-brand-coral/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="font-black text-2xl text-white group-hover:text-brand-teal transition-colors duration-300">
                {siteData?.name || "Western Star"}
              </span>
            </div>
            <p className="text-brand-gray/80 leading-relaxed mb-8 max-w-md text-lg font-medium">
              {siteData.description}
            </p>

            {/* Enhanced Social Links */}
            <div className="flex items-center gap-4">
              {[
                {
                  icon: Mail,
                  href: "mailto:hello@westernstar.news",
                  color: "brand-coral",
                },
                {
                  icon: Twitter,
                  href: "https://twitter.com/westernstar",
                  color: "brand-teal",
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com/company/westernstar",
                  color: "brand-orange",
                },
                { icon: Rss, href: "/rss", color: "brand-coral" },
              ].map(({ icon: Icon, href, color }, index) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm text-brand-gray hover:text-white hover:bg-brand-teal hover:scale-110 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-5 h-5 group-hover:animate-pulse" />
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-brand-teal to-brand-coral rounded-full"></div>
              Navigate
            </h3>
            <ul className="space-y-4">
              {[
                { href: "#preview", label: "Latest News" },
                { href: "#topics", label: "Topics" },
                { href: "#archive", label: "Newsletter Archive" },
                {
                  href: "https://westernstar.beehiiv.com/",
                  label: "Subscribe",
                  external: true,
                },
              ].map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="text-brand-gray hover:text-brand-teal transition-all duration-300 font-medium hover:translate-x-2 inline-block group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="group-hover:animate-pulse">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Legal Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-brand-orange to-brand-coral rounded-full"></div>
              Legal
            </h3>
            <ul className="space-y-4">
              {[
                { href: "#privacy", label: "Privacy Policy" },
                { href: "#terms", label: "Terms of Service" },
                { href: "#contact", label: "Contact Us" },
              ].map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-brand-gray hover:text-brand-orange transition-all duration-300 font-medium hover:translate-x-2 inline-block group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="group-hover:animate-pulse">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-brand-teal/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-brand-gray/80 font-medium">
            © {new Date().getFullYear()} Western Star. All rights reserved.
          </div>
          <div className="flex items-center gap-8 text-brand-gray/80 font-medium">
            <div className="flex items-center gap-2 group">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-brand-coral animate-pulse group-hover:scale-125 transition-transform duration-300" />
              <span>for professionals</span>
            </div>
            <div className="flex items-center gap-2 group">
              <Zap className="w-4 h-4 text-brand-teal animate-pulse group-hover:rotate-12 transition-transform duration-300" />
              <span className="group-hover:text-brand-teal transition-colors duration-300">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
