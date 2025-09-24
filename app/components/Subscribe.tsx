import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export function Subscribe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-violet-800 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-3xl mb-8 shadow-lg">
          <Mail className="w-10 h-10 text-white" />
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
          Stay Ahead of the Curve
        </h2>

        <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Get exclusive insights, market analysis, and strategic intelligence
          delivered directly to your inbox. Join thousands of decision-makers
          who trust Western Star.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm font-medium">Weekly Market Updates</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm font-medium">Exclusive Analysis</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm font-medium">No Spam, Ever</span>
          </div>
        </div>

        {/* Newsletter Embed */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-white mb-6">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">Western Star Newsletter</span>
          </div>

          {/* Beehiiv embed placeholder - replace with actual embed code */}
          <div className="bg-white rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Strategic Intelligence Weekly
              </h3>
              <p className="text-gray-600 mb-6">
                Join 10,000+ professionals getting the insights that matter
              </p>

              <a
                href="https://westernstar.beehiiv.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Mail className="w-5 h-5" />
                <span>Subscribe Now</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <p className="text-xs text-gray-500 mt-4">
                Free • No spam • Unsubscribe anytime
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-8 text-white/80">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10,000+</div>
            <div className="text-sm">Subscribers</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.9★</div>
            <div className="text-sm">Average Rating</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-sm">Open Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscribe;
