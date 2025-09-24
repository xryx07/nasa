import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { DataUpload } from './components/DataUpload';
import { LightCurveAnalysis } from './components/LightCurveAnalysis';
import { SpectralAnalysis } from './components/SpectralAnalysis';
import { AIResults } from './components/AIResults';
import { OrbitSimulation } from './components/OrbitSimulation';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Toaster } from './components/ui/sonner';
import { ArrowRight, Search, Telescope, Globe, Zap, Database } from 'lucide-react';

export interface ExoplanetData {
  id: string;
  name: string;
  confidence: number;
  planetType: string;
  radius: number;
  orbitalPeriod: number;
  temperature: number;
  habitableZone: boolean;
  detectionMethod: string;
  stellarMagnitude: number;
}

export default function App() {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<ExoplanetData[]>([]);
  const [selectedExoplanet, setSelectedExoplanet] = useState<ExoplanetData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <Telescope className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">ExoDiscover</h1>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <button 
                  onClick={() => scrollToSection('overview')}
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Overview
                </button>
                <button 
                  onClick={() => scrollToSection('discovery')}
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Discovery
                </button>
                <button 
                  onClick={() => scrollToSection('analysis')}
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Analysis
                </button>
                <button 
                  onClick={() => scrollToSection('exploration')}
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Exploration
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1711995364023-d8b985bc50cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMG5lYnVsYSUyMHN0YXJzJTIwZGVlcCUyMGZpZWxkfGVufDF8fHx8MTc1ODUzNzEzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Deep space background"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
          
          <div className="container mx-auto px-6 relative">
            <div className="max-w-2xl">
              <div className="mb-6">
                <p className="text-sm text-blue-400 mb-2">AI-POWERED SPACE EXPLORATION</p>
                <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  Let's change the{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    universe
                  </span>{' '}
                  together.
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Discover new worlds beyond our solar system using cutting-edge AI technology. 
                  Analyze telescope data, detect planetary transits, and explore the cosmos like never before.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => scrollToSection('discovery')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full flex items-center gap-2"
                >
                  Start Discovery <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => scrollToSection('analysis')}
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full"
                >
                  View Analysis Tools
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Learn by Exploring Section */}
        <section id="overview" className="py-24 bg-gradient-to-b from-transparent to-gray-900/30">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-4xl font-bold mb-6">
                  Learn by{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Exploring.
                  </span>
                </h3>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Experience the thrill of astronomical discovery through our AI-powered platform. 
                  From analyzing light curves to detecting atmospheric compositions, every tool 
                  brings you closer to understanding distant worlds.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-gray-300">Real telescope data analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-gray-300">AI-powered planet detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-gray-300">3D orbital simulations</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden">
                  <ImageWithFallback
                    src='https://unsplash.com/photos/a-close-up-of-a-planet-with-stars-in-the-background-sQdaoBlGwxY'
                    alt="Planet surface"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Tools Section */}
        <section id="discovery" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-6">Discovery Tools.</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Powerful instruments for exoplanet detection and analysis, designed for both researchers and enthusiasts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white/5 border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">Data Upload</h4>
                <p className="text-gray-300 mb-6">
                  Import telescope data from TESS, JWST, and Kepler missions. Support for FITS and CSV formats.
                </p>
                <DataUpload 
                  onDataUploaded={setUploadedData}
                  onAnalysisComplete={setAnalysisResults}
                />
              </Card>

              <Card className="bg-white/5 border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">Light Curve Analysis</h4>
                <p className="text-gray-300 mb-6">
                  Detect planetary transits and analyze stellar brightness variations with AI precision.
                </p>
                <Button 
                  onClick={() => scrollToSection('analysis')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Analyze Data
                </Button>
              </Card>

              <Card className="bg-white/5 border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">Spectral Analysis</h4>
                <p className="text-gray-300 mb-6">
                  Study atmospheric composition and identify potential biosignatures in exoplanet atmospheres.
                </p>
                <Button 
                  onClick={() => scrollToSection('analysis')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Start Analysis
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Analysis Section */}
        <section id="analysis" className="py-24 bg-gradient-to-b from-gray-900/30 to-transparent">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-6">Scientific Analysis.</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Advanced tools for deep space exploration and exoplanet characterization.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <Card className="bg-white/5 border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h4 className="text-2xl font-bold mb-6 text-white">Light Curve Analysis</h4>
                <LightCurveAnalysis 
                  data={uploadedData}
                  results={analysisResults}
                />
              </Card>

              <Card className="bg-white/5 border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h4 className="text-2xl font-bold mb-6 text-white">Spectral Analysis</h4>
                <SpectralAnalysis 
                  data={uploadedData}
                  results={analysisResults}
                />
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10 p-8 rounded-2xl backdrop-blur-sm">
              <h4 className="text-2xl font-bold mb-6 text-white">AI Detection Results</h4>
              <AIResults 
                results={analysisResults}
                onSelectExoplanet={setSelectedExoplanet}
              />
            </Card>
          </div>
        </section>

        {/* Exploration Section */}
        <section id="exploration" className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1707653057726-a2814aaf582e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXBsZXIlMjA0NTJiJTIwZXhvcGxhbmV0fGVufDF8fHx8MTc1ODY0NDA5NHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Kepler-452b exoplanet"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-6">
                  3D Orbital{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Simulations.
                  </span>
                </h3>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Visualize exoplanet systems in stunning 3D detail. Watch planets orbit their host stars, 
                  understand orbital mechanics, and explore the dynamics of distant solar systems.
                </p>
                <div className="mb-8">
                  <OrbitSimulation exoplanet={selectedExoplanet} />
                </div>
                <p className="text-sm text-gray-400">
                  Select an exoplanet from the analysis results to begin 3D exploration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Overview */}
        <section className="py-24 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-6">Mission Dashboard.</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Monitor your discoveries and track the progress of your exoplanet research.
              </p>
            </div>
            <Dashboard 
              analysisResults={analysisResults}
              onSelectExoplanet={setSelectedExoplanet}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-16 bg-black/80">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <Telescope className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold">ExoDiscover</h3>
              </div>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Advancing the frontiers of exoplanet discovery through artificial intelligence and space exploration.
              </p>
              <div className="flex justify-center gap-8 text-sm text-gray-400">
                <span>© 2025 ExoDiscover</span>
                <span>•</span>
                <span>AI-Powered Space Exploration</span>
                <span>•</span>
                <span>NASA Data Partnership</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}