import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratorForm } from './components/GeneratorForm';
import { ListingResultView } from './components/ListingResultView';
import { SavedListingsView } from './components/SavedListingsView';
import { SettingsView } from './components/SettingsView';
import { SofaGenerationRequest, SofaListingData, ShopSettings } from './types';
import { DEFAULT_SHOP_SETTINGS } from './data/samples';
import { Sparkles, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, Sofa } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'saved' | 'settings'>('generator');
  
  // Settings state
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('sofa_shop_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_SHOP_SETTINGS;
  });

  // Images state
  const [images, setImages] = useState<string[]>([]);

  // Request parameters
  const [request, setRequest] = useState<SofaGenerationRequest>({
    imagesBase64: [],
    location: 'London, United Kingdom',
    condition: 'Brand New in Packaging',
    deliveryOption: 'Free Local & UK Delivery',
    tone: 'High-Converting Facebook Marketplace',
    shopName: settings.shopName,
    phone: settings.phone,
    whatsapp: settings.whatsapp
  });

  // Keep request in sync with shop settings
  useEffect(() => {
    setRequest(prev => ({
      ...prev,
      location: prev.location || 'London, United Kingdom',
      shopName: settings.shopName,
      phone: settings.phone,
      whatsapp: settings.whatsapp
    }));
  }, [settings]);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Active output results array
  const [activeListings, setActiveListings] = useState<SofaListingData[]>([]);

  // Saved listings state
  const [savedListings, setSavedListings] = useState<SofaListingData[]>([]);

  // Fetch initial saved listings from backend
  useEffect(() => {
    fetchSavedGenerations();
  }, []);

  const fetchSavedGenerations = async () => {
    try {
      const res = await fetch('/api/sofa/generations');
      if (res.ok) {
        const data = await res.json();
        setSavedListings(data);
      }
    } catch (err) {
      console.warn('Failed to fetch saved generations from backend', err);
    }
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      setErrorMsg('Please upload or select at least one sofa photo.');
      return;
    }

    setIsGenerating(false);
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const payload: SofaGenerationRequest = {
        ...request,
        imagesBase64: images,
        location: request.location || 'London, United Kingdom',
        shopName: settings.shopName,
        phone: settings.phone,
        whatsapp: settings.whatsapp
      };

      const response = await fetch('/api/sofa/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate listing');
      }

      const data = await response.json();
      const rawItems = (data.items && Array.isArray(data.items)) ? data.items : [data];

      const listingsList: SofaListingData[] = rawItems.map((item: any, idx: number) => {
        const primaryImg = images[item.imageIndex ?? idx] || images[idx] || images[0];
        return {
          id: `listing-${Date.now()}-${idx}`,
          createdAt: new Date().toISOString(),
          primaryImage: primaryImg,
          allImages: [primaryImg],
          facebookTitle: item.facebookTitle,
          price: item.price ?? 0,
          priceRange: item.priceRange || 'FREE / £0 Delivery Included',
          location: request.location || 'London, United Kingdom',
          seater: item.seater || 'Sofa',
          fabric: item.fabric || 'Fabric',
          color: item.color || '',
          condition: item.condition || 'Brand New in Packaging',
          dimensions: item.dimensions || { approxText: 'Dimensions upon request' },
          delivery: item.delivery || 'Free Local Delivery',
          description: item.description,
          hashtags: item.hashtags || [],
          seoKeywords: item.seoKeywords || [],
          shopName: settings.shopName,
          contactNumber: settings.phone
        };
      });

      setActiveListings(listingsList);
      
      // Auto scroll down to result cards smoothly
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveListing = async (listingToSave: SofaListingData) => {
    try {
      const response = await fetch('/api/sofa/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingToSave)
      });

      if (response.ok) {
        const result = await response.json();
        setSavedListings(prev => [result.item, ...prev.filter(i => i.id !== result.item.id)]);
      }
    } catch (err) {
      // Fallback local save if offline
      setSavedListings(prev => [listingToSave, ...prev.filter(i => i.id !== listingToSave.id)]);
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      await fetch(`/api/sofa/generations/${id}`, { method: 'DELETE' });
    } catch (err) {}
    setSavedListings(prev => prev.filter(item => item.id !== id));
    setActiveListings(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedListings.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB 1: GENERATOR */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-2xl space-y-3 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> High-Conversion Marketplace Listings
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                  Turn photos into copy-ready <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">Facebook Marketplace sofa listings</span> in seconds
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Upload sofa photos to instantly analyze fabric texture, seating size, and condition. AI automatically writes high-converting Facebook Marketplace headlines, complete specifications, delivery terms, and generates exportable poster graphics!
                </p>
              </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="text-xs text-rose-400 hover:underline font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Input Card Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
              <ImageUploader
                images={images}
                setImages={setImages}
              />

              <div className="border-t border-slate-800/80 pt-6">
                <GeneratorForm
                  request={request}
                  setRequest={setRequest}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  hasImages={images.length > 0}
                />
              </div>
            </div>

            {/* Active Output Result Section */}
            {activeListings.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80">
                <ListingResultView
                  listings={activeListings}
                  onSave={handleSaveListing}
                  savedIds={savedListings.map(s => s.id)}
                />
              </div>
            )}

          </div>
        )}

        {/* TAB 2: SAVED LISTINGS */}
        {activeTab === 'saved' && (
          <SavedListingsView
            savedListings={savedListings}
            onSelectListing={(listing) => {
              setActiveListings([listing]);
              setActiveTab('generator');
            }}
            onDeleteListing={handleDeleteListing}
          />
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Sofa Post Generator — UK Furniture Marketing AI Engine</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.6 Vision AI</span>
            <span>•</span>
            <span>Facebook Marketplace Copywriter</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
