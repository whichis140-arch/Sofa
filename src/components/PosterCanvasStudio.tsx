import React, { useRef, useEffect, useState } from 'react';
import { Download, Sparkles, Image as ImageIcon, Layers, X, Phone, Truck, Shield } from 'lucide-react';
import { SofaListingData } from '../types';

interface PosterCanvasStudioProps {
  listing: SofaListingData;
  onClose: () => void;
}

export const PosterCanvasStudio: React.FC<PosterCanvasStudioProps> = ({ listing, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState<'modern' | 'luxury' | 'marketplace' | 'clearance'>('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    drawPoster();
  }, [listing, template]);

  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsGenerating(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = listing.primaryImage;

    img.onload = () => {
      // Set square 1:1 canvas size (1080x1080 for high resolution social posts)
      canvas.width = 1080;
      canvas.height = 1080;

      // Draw background image
      ctx.drawImage(img, 0, 0, 1080, 1080);

      // Draw overlay gradient depending on template
      if (template === 'modern') {
        // Dark gradient from bottom
        const grad = ctx.createLinearGradient(0, 400, 0, 1080);
        grad.addColorStop(0, 'rgba(15, 23, 42, 0)');
        grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.75)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.98)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Header Top Bar
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 1080, 90);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('UK FURNITURE OUTLET', 50, 58);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px sans-serif';
        ctx.fillText(listing.location || 'UK Nationwide Delivery', 750, 58);

        // Price Badge Top Right
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(750, 130, 280, 100, 20);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 52px sans-serif';
        ctx.fillText(`£${listing.price}`, 780, 200);

        // Content Area Bottom
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 46px serif';
        ctx.fillText(listing.seater || '3-Seater Sofa', 60, 800);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '32px sans-serif';
        ctx.fillText(`${listing.fabric || 'Velvet'} • ${listing.color || 'Grey'} • ${listing.condition || 'Very Good'}`, 60, 850);

        // Specs Pills
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.beginPath();
        ctx.roundRect(60, 890, 420, 60, 12);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '24px sans-serif';
        ctx.fillText(`🚚 ${listing.delivery || 'Free Local Delivery'}`, 80, 928);

        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.beginPath();
        ctx.roundRect(500, 890, 520, 60, 12);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '24px sans-serif';
        ctx.fillText(`📏 ${listing.dimensions?.approxText || 'Dimensions Available'}`, 520, 928);

        // Phone / WhatsApp Bar
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, 990, 1080, 90);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(`💬 ORDER / INQUIRE: ${listing.contactNumber || '07700 900123'}`, 60, 1048);
      } else if (template === 'luxury') {
        // Gold / Dark Luxury frame
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 20;
        ctx.strokeRect(20, 20, 1040, 1040);

        const grad = ctx.createLinearGradient(0, 500, 0, 1080);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Gold Title Ribbon
        ctx.fillStyle = '#b45309';
        ctx.fillRect(0, 50, 600, 80);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px serif';
        ctx.fillText('LUXURY SHOWROOM COLLECTION', 40, 105);

        // Price Tag
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(60, 820, 320, 120);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 64px serif';
        ctx.fillText(`£${listing.price}`, 90, 900);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(listing.seater, 410, 860);
        ctx.font = '28px sans-serif';
        ctx.fillText(`${listing.fabric} • ${listing.color}`, 410, 900);

        // Contact Footer
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 970, 1080, 110);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(`TEL / WHATSAPP: ${listing.contactNumber || '07700 900123'}`, 60, 1035);
      } else if (template === 'marketplace') {
        // Facebook Marketplace Style Banner
        ctx.fillStyle = '#1877f2';
        ctx.fillRect(0, 0, 1080, 100);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText('Facebook Marketplace Featured Sofa', 50, 65);

        // Bottom gradient
        const grad = ctx.createLinearGradient(0, 600, 0, 1080);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(15,23,42,0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Price Tag
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(60, 780, 280, 100, 16);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 56px sans-serif';
        ctx.fillText(`£${listing.price}`, 90, 850);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText(listing.seater, 370, 830);
        ctx.font = '28px sans-serif';
        ctx.fillText(`Condition: ${listing.condition}`, 370, 870);

        // Footer
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 970, 1080, 110);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(`🚚 ${listing.delivery} • Message to Order`, 50, 1035);
      } else if (template === 'clearance') {
        // Clearance Red Banner
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, 0, 1080, 120);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px sans-serif';
        ctx.fillText('⚡ CLEARANCE DEAL - MUST GO!', 50, 80);

        const grad = ctx.createLinearGradient(0, 600, 0, 1080);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.92)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 72px sans-serif';
        ctx.fillText(`£${listing.price} ONLY!`, 60, 860);

        ctx.fillStyle = '#ffffff';
        ctx.font = '36px sans-serif';
        ctx.fillText(`${listing.seater} in ${listing.color}`, 60, 920);

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, 970, 1080, 110);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(`CALL/TEXT NOW: ${listing.contactNumber || '07700 900123'}`, 60, 1035);
      }

      setIsGenerating(false);
    };
  };

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Sofa_Post_${listing.seater.replace(/\s+/g, '_')}_${listing.price}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              Social Poster & Banner Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Select Poster Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'modern', name: 'UK Modern', desc: 'Sleek dark theme' },
              { id: 'luxury', name: 'Luxury Gold', desc: 'Gold frame elegance' },
              { id: 'marketplace', name: 'Marketplace', desc: 'FB style blue badge' },
              { id: 'clearance', name: 'Clearance Deal', desc: 'High urgency deal' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  template === t.id
                    ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-amber-400">{t.name}</div>
                <div className="text-[10px] text-slate-400">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-2 flex items-center justify-center min-h-[300px]">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[480px] h-auto rounded-xl shadow-xl border border-slate-800"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={downloadPoster}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Poster (PNG)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
