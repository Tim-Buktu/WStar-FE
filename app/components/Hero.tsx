import React, { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, Globe, Users } from "lucide-react";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Static hero data
  const heroData = {
    title: "Strategic Insights for Modern Leaders",
    subtitle:
      "Empowering decision-makers with cutting-edge analysis and industry intelligence",
    description:
      "Get ahead of market shifts with our comprehensive analysis, expert insights, and strategic intelligence designed for leaders who shape the future.",
    buttonText: "Get Started",
    buttonUrl: "https://westernstar.beehiiv.com/",
    ctaText: "Explore Insights",
    ctaUrl: "/research",
  };

  const siteData = {
    name: "Western Star",
  };

  if (!mounted) {
    return null;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated background gradients */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200/50 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <TrendingUp className="w-4 h-4" />
            <span>
              {heroData.subtitle ||
                "Strategic Intelligence for Decision Makers"}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              {heroData.title || "Navigate Tomorrow's Markets Today"}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {heroData.description ||
              "Get ahead of market shifts with our comprehensive analysis, expert insights, and strategic intelligence designed for leaders who shape the future."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <a
              href={heroData.buttonUrl || "https://westernstar.beehiiv.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span>{heroData.buttonText || "Get Started"}</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <button className="inline-flex items-center gap-3 bg-white border-2 border-slate-200 text-slate-700 px-10 py-5 rounded-2xl text-lg font-bold hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <span>Learn More</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                10,000+
              </div>
              <div className="text-slate-600 font-medium">
                Trusted Professionals
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">95%</div>
              <div className="text-slate-600 font-medium">
                Prediction Accuracy
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">50+</div>
              <div className="text-slate-600 font-medium">Global Markets</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
