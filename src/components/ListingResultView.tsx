import React, { useState } from 'react';
import { Copy, Check, MapPin, Camera, BookmarkCheck, Sparkles, CheckCircle2, Tag, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { SofaListingData } from '../types';

interface ListingResultViewProps {
  listings: SofaListingData[];
  onSave: (listing: SofaListingData) => void;
  savedIds?: string[];
}

export const ListingResultView: React.FC<ListingResultViewProps> = ({
  listings,
  onSave,
  savedIds = []
}) => {
  const [copiedPhotoId, setCopiedPhotoId] = useState<string | null>(null);
  const [copiedFullId, setCopiedFullId] = useState<string | null>(null);
  const [copiedLocId, setCopiedLocId] = useState<string | null>(null);

  const handleCopyPhoto = async (imageUrl: string, itemId: string) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      let pngBlob = blob;

      if (blob.type !== 'image/png') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        pngBlob = await new Promise((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
      }

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [pngBlob.type]: pngBlob })
        ]);
      } else {
        throw new Error('ClipboardItem API not supported');
      }
      setCopiedPhotoId(itemId);
      setTimeout(() => setCopiedPhotoId(null), 2000);
    } catch (err) {
      // Fallback download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `sofa_photo_${itemId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCopiedPhotoId(itemId);
      setTimeout(() => setCopiedPhotoId(null), 2000);
    }
  };

  const handleCopyFullPost = (item: SofaListingData) => {
    const fullText = `TITLE:
${item.facebookTitle}

PRICE: £${item.price} (FREE DELIVERY)

LOCATION: ${item.location}

DESCRIPTION:
${item.description}`;

    navigator.clipboard.writeText(fullText);
    setCopiedFullId(item.id);
    setTimeout(() => setCopiedFullId(null), 2000);
  };

  const handleCopyLocation = (locationStr: string, itemId: string) => {
    navigator.clipboard.writeText(locationStr);
    setCopiedLocId(itemId);
    setTimeout(() => setCopiedLocId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shadow-emerald-950/20">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Generated UK Marketplace Cards ({listings.length} {listings.length === 1 ? 'Listing' : 'Listings'})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click photo to copy image • Click "Copy Full Post" for instant title & description copy
          </p>
        </div>
      </div>

      {/* Stacked Cards Line-by-Line */}
      <div className="space-y-8">
        {listings.map((item, index) => {
          const isSaved = savedIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-slate-900/95 border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
            >
              {/* Green Light Status Header Bar */}
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-5 sm:px-6 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Photo {index + 1} — Listing Ready ✓</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    Target City: {item.location.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Card Main Body */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Column: Photo & Auto Specs (Filling Height Perfectly) */}
                <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-between gap-3">
                  
                  {/* Photo Container */}
                  <div
                    onClick={() => handleCopyPhoto(item.primaryImage, item.id)}
                    className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[280px] sm:min-h-[320px] flex-1 cursor-pointer shadow-inner shadow-black/60"
                    title="Click to Copy Photo"
                  >
                    <img
                      src={item.primaryImage}
                      alt={item.facebookTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

                    {/* Photo Copy Badge */}
                    <div className="absolute bottom-3 left-3 bg-slate-950/90 hover:bg-slate-900/95 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5 shadow-lg transition-all">
                      {copiedPhotoId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Photo Copied!</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-amber-400" />
                          <span>Click to Copy Photo</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Auto Specs Footer Pills beneath photo */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <div className="truncate">
                        <div className="text-[10px] text-slate-400 font-mono">STYLE</div>
                        <div className="font-bold text-slate-200 truncate">{item.seater}</div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <div className="truncate">
                        <div className="text-[10px] text-slate-400 font-mono">FABRIC</div>
                        <div className="font-bold text-slate-200 truncate">{item.fabric}</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Title, Full Description & Action Buttons */}
                <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-4">
                    {/* TITLE */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1">
                        <span>FB MARKETPLACE TITLE</span>
                      </label>
                      <div className="text-sm sm:text-base font-bold text-white bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 leading-snug shadow-inner">
                        {item.facebookTitle}
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center justify-between">
                        <span>DESCRIPTION & DETAILED SPECS</span>
                        <span className="text-[10px] text-slate-400 normal-case font-normal">Copy-Ready</span>
                      </label>
                      <div className="text-xs sm:text-sm text-slate-200 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 whitespace-pre-line max-h-72 sm:max-h-80 overflow-y-auto leading-relaxed shadow-inner">
                        {item.description}
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm font-bold bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                      <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-mono text-emerald-300">{item.location}</span>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    
                    {/* Copy Full Post */}
                    <button
                      type="button"
                      onClick={() => handleCopyFullPost(item)}
                      className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 border border-emerald-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      {copiedFullId === item.id ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950" />
                          <span>FULL POST COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-950" />
                          <span>COPY FULL POST</span>
                        </>
                      )}
                    </button>

                    {/* Copy Location */}
                    <button
                      type="button"
                      onClick={() => handleCopyLocation(item.location, item.id)}
                      className="py-3 px-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                      {copiedLocId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Copied City!</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>Copy City</span>
                        </>
                      )}
                    </button>

                    {/* Save */}
                    <button
                      type="button"
                      onClick={() => onSave(item)}
                      className={`py-3 px-3.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 border transition-all ${
                        isSaved
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 hover:bg-slate-900 text-slate-200 border-slate-800'
                      }`}
                    >
                      <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                  </div>

                </div>

              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

