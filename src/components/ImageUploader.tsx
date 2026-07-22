import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Star, Plus, Sparkles } from 'lucide-react';
import { SAMPLE_SOFAS } from '../data/samples';
import { SampleSofaPhoto } from '../types';

interface ImageUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    
    files.forEach((file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => {
            if (prev.length >= 10) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const files: File[] = Array.from(e.dataTransfer.files);
    
    files.forEach((file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => {
            if (prev.length >= 10) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const newImages = [...prev];
      const selected = newImages.splice(index, 1)[0];
      return [selected, ...newImages];
    });
  };

  const loadSampleSofa = async (sample: SampleSofaPhoto) => {
    try {
      // Convert URL image to base64 for reliable processing
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages([reader.result as string]);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      // Fallback if CORS prevents fetch
      setImages([sample.url]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            1. Sofa Photos
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload up to 10 photos of the sofa (front, angle, cushions, label).
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {images.length}/10 Photos
        </span>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="group relative border-2 border-dashed border-slate-700 hover:border-amber-500/80 bg-slate-800/40 hover:bg-slate-800/80 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />

        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-800 border border-slate-700 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 flex items-center justify-center text-slate-400 group-hover:text-amber-400 transition-all">
          <Upload className="w-6 h-6" />
        </div>

        <h4 className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
          Drag & drop sofa photos here
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          or click to browse from your computer / device. Multiple angles improve AI accuracy!
        </p>
      </div>

      {/* Uploaded Images Gallery */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            Click on a photo to set it as the Primary Cover Image for Marketplace.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                  index === 0
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img
                  src={img}
                  alt={`Sofa photo ${index + 1}`}
                  className="w-full h-28 object-cover bg-slate-950"
                  referrerPolicy="no-referrer"
                />

                {/* Primary Tag */}
                {index === 0 ? (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold shadow flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-950" /> Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrimaryImage(index);
                    }}
                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 text-[10px] font-medium opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-slate-950 transition-all"
                  >
                    Set Cover
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all shadow"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {images.length < 10 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-28 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-800/30 hover:bg-slate-800 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-amber-400 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[11px] font-medium">Add More</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* One-Click Sample Photos */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">
            Quick Test: Try with Sample Sofa Photos
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_SOFAS.map(sample => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadSampleSofa(sample)}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 transition-all text-left group"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-10 h-10 rounded-lg object-cover bg-slate-900 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-400">
                  {sample.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {sample.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
