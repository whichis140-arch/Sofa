import React from 'react';
import { Settings, Store, MapPin, Phone, MessageSquare, Truck, Save, Check } from 'lucide-react';
import { ShopSettings } from '../types';

interface SettingsViewProps {
  settings: ShopSettings;
  setSettings: React.Dispatch<React.SetStateAction<ShopSettings>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sofa_shop_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" /> Location & Shop Template Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure your furniture outlet details. These defaults will be automatically injected into every Facebook Marketplace description and poster graphic.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        
        {/* Shop Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-400" /> Business / Shop Outlet Name
          </label>
          <input
            type="text"
            value={settings.shopName}
            onChange={(e) => setSettings(prev => ({ ...prev, shopName: e.target.value }))}
            placeholder="e.g. Greater Manchester Furniture Clearance Outlet"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Default UK Town / Postcode
            </label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Manchester, M1 2WD"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Contact Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="e.g. 07700 900123"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* WhatsApp Link / Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> WhatsApp Number (with Country Code)
          </label>
          <input
            type="text"
            value={settings.whatsapp}
            onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
            placeholder="e.g. 447700900123"
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Delivery Terms */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400" /> Standard Delivery & Service Terms
          </label>
          <textarea
            rows={3}
            value={settings.deliveryTerms}
            onChange={(e) => setSettings(prev => ({ ...prev, deliveryTerms: e.target.value }))}
            placeholder="Specify your delivery radiuses, fees, and assembly options..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/10 active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Shop Defaults</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
