import React from "react";
import { ArrowLeft, Construction, Calendar, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface WIPPageProps {
  title?: string;
  description?: string;
  progress?: number;
}

export function WIPPage({
  title = "Page Under Construction",
  description = "This section is currently being developed.",
  progress = 15,
}: WIPPageProps) {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-24">
          <div className="text-center">
            {/* Construction Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-8 shadow-lg">
              <Construction className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {description} We're working hard to bring you amazing content.
              Check back soon!
            </p>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold mb-8 shadow-lg">
              <Calendar className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>

              <a
                href="https://westernstar.beehiiv.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Subscribe for Updates
              </a>
            </div>

            {/* Progress Indicator */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default WIPPage;
