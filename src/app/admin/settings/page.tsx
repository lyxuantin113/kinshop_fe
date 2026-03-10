"use client";

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Truck, CreditCard, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { SystemConfig } from '@/types/api';

export default function AdminSettingsPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllConfigs();
      setConfigs(response.data);
    } catch (err: any) {
      setError('Failed to load system configurations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleUpdate = async (key: string, value: string, description?: string) => {
    try {
      setSaving(key);
      setError('');
      setSuccess('');
      await apiService.updateConfig(key, value, description);
      setSuccess(`Configuration "${key}" updated successfully!`);
      // Update local state
      setConfigs(prev => prev.map(c => c.key === key ? { ...c, value, description } : c));
    } catch (err: any) {
      setError(`Failed to update ${key}.`);
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const getConfigValue = (key: string) => configs.find(c => c.key === key)?.value || '';
  const getConfigDesc = (key: string) => configs.find(c => c.key === key)?.description || '';

  const renderConfigCard = (key: string, title: string, icon: React.ReactNode, placeholder: string) => {
    const [localValue, setLocalValue] = useState(getConfigValue(key));
    const [localDesc, setLocalDesc] = useState(getConfigDesc(key));

    // Sync when data loads
    useEffect(() => {
      setLocalValue(getConfigValue(key));
      setLocalDesc(getConfigDesc(key));
    }, [configs, key]);

    return (
      <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 transition-all hover:shadow-2xl hover:shadow-primary-500/10">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{key}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Current Value</label>
            <input
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder={placeholder}
              className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-slate-900 font-bold outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
            <textarea
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              placeholder="Provide a brief explanation of this setting..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600 outline-none focus:border-primary-500 focus:bg-white transition-all resize-none h-24"
            />
          </div>

          <button
            onClick={() => handleUpdate(key, localValue, localDesc)}
            disabled={saving === key}
            className="btn-primary w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 group"
          >
            {saving === key ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">System Configuration</h1>
          <p className="text-slate-500 mt-1 font-medium">Fine-tune global parameters and logistics settings.</p>
        </div>
        <button 
          onClick={fetchConfigs}
          className="btn-secondary h-11 px-4 text-sm font-bold"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload All
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center space-x-3 rounded-[1.5rem] bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 shadow-sm animate-in fade-in zoom-in">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center space-x-3 rounded-[1.5rem] bg-emerald-50 p-4 text-sm font-bold text-emerald-600 border border-emerald-100 shadow-sm animate-in fade-in zoom-in">
          <CheckCircle2 className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Config Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {renderConfigCard(
          'SHIPPING_BASE_FEE',
          'Standard Shipping Fee',
          <Truck className="h-6 w-6" />,
          'e.g. 15.00'
        )}
        {renderConfigCard(
          'SHIPPING_FREE_THRESHOLD',
          'Free Shipping Threshold',
          <CreditCard className="h-6 w-6" />,
          'e.g. 500.00'
        )}
      </div>

      {/* Info Notice */}
      <div className="rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6 flex items-start space-x-4">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest">Administrative Tip</h4>
          <p className="text-sm font-medium text-blue-700 leading-relaxed">
            These settings take effect immediately across all client sessions. Ensure values are numeric and follow standard currency formats (e.g., 25.00) to maintain data integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
