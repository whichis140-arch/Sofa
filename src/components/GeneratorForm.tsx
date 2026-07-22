import React from 'react';
import { MapPin, Sparkles, Check, Sofa, Tag, Truck, ShieldCheck } from 'lucide-react';
import { MAJOR_UK_CITIES } from '../data/samples';
import { SofaGenerationRequest } from '../types';

interface GeneratorFormProps {
  request: SofaGenerationRequest;
  setRequest: React.Dispatch<React.SetStateAction<SofaGenerationRequest>>;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImages: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  request,
  setRequest,
  onGenerate,
  isGenerating,
  hasImages
}) => {
  return (
    <div className="space-y-6">
      
      {/* Auto-Applied Presets Banner */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            £0
          </div>
          <div>
            <div className="font-bold text-slate-200">Free Listing</div>
            <div className="text-[10px] text-slate-400">Price set to FREE</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">Brand New</div>
            <div className="text-[10px] text-slate-400">New condition tag</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Sofa className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">Auto AI Vision</div>
            <div className="text-[10px] text-slate-400">Seater & Fabric auto</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">Multi-City UK</div>
            <div className="text-[10px] text-slate-400">Auto UK Cities per photo</div>
          </div>
        </div>
      </div>

      {/* Submit Action Button */}
      <div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !hasImages}
          className={`w-full py-4.5 px-6 rounded-2xl font-mono font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-xl ${
            !hasImages
              ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
              : isGenerating
              ? 'bg-emerald-500/80 text-slate-950 cursor-wait border border-emerald-400'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>[PROCESSING PHOTOS: AI MULTI-CITY COPYWRITER RUNNING...]</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>GENERATE ALL FACEBOOK MARKETPLACE LISTINGS</span>
            </>
          )}
        </button>
        {!hasImages && (
          <p className="text-[11px] font-mono text-center text-slate-500 mt-2">
            [AWAITING_INPUT: Please upload sofa photos above to activate AI generator]
          </p>
        )}
      </div>

    </div>
  );
};

