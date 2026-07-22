import React, { useState } from 'react';
import { Search, Trash2, Copy, Check, Eye, ImageIcon, BookmarkCheck, Sofa, MapPin, PoundSterling, Calendar } from 'lucide-react';
import { SofaListingData } from '../types';

interface SavedListingsViewProps {
  savedListings: SofaListingData[];
  onSelectListing: (listing: SofaListingData) => void;
  onDeleteListing: (id: string) => void;
}

export const SavedListingsView: React.FC<SavedListingsViewProps> = ({
  savedListings,
  onSelectListing,
  onDeleteListing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = savedListings.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.facebookTitle?.toLowerCase().includes(q) ||
      item.seater?.toLowerCase().includes(q) ||
      item.fabric?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.price?.toString().includes(q)
    );
  });

  const handleCopyText = (item: SofaListingData) => {
    const text = `TITLE:
${item.facebookTitle}

PRICE: £${item.price}

DESCRIPTION:
${item.description}`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" /> Saved Sofa Listings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Access, inspect, copy, or export your saved Facebook Marketplace sofa generations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, fabric, seater..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
            <Sofa className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-base font-bold text-slate-300">
            {searchQuery ? 'No matching sofa listings found' : 'No saved sofa listings yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search query or clear the filter.'
              : 'Generate a new sofa listing and click "Save Listing" to keep it in your history.'}
          </p>
        </div>
      ) : (
        /* Saved Listings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Image & Price Overlay */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={item.primaryImage}
                    alt={item.facebookTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur text-amber-400 text-xs font-black border border-slate-700/80">
                    £{item.price}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur text-slate-300 text-[10px] font-medium flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-400" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                    {item.facebookTitle}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                      🛋️ {item.seater}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                      ✨ {item.fabric}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                      🏷️ {item.condition}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectListing(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyText(item)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                  title="Copy Text"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteListing(item.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
