
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarDetails, FuelRecord, Units } from '../types';

interface RecordFormProps {
  onSubmit: (record: Omit<FuelRecord, 'id' | 'carId'>) => void;
  car: CarDetails;
}

const RecordForm: React.FC<RecordFormProps> = ({ onSubmit, car }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    cost: '',
    station: '',
    distanceDriven: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.cost || !formData.distanceDriven) return;

    onSubmit({
      date: formData.date,
      amount: parseFloat(formData.amount),
      cost: parseFloat(formData.cost),
      station: formData.station,
      distanceDriven: parseFloat(formData.distanceDriven),
      notes: formData.notes
    });

    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-xl mx-auto animate-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-exo font-black italic uppercase text-white mb-2">New Entry</h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Record your latest fuel-up telemetry</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
            <input 
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Station Location</label>
            <input 
              placeholder="e.g. Shell"
              type="text"
              name="station"
              value={formData.station}
              onChange={handleChange}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Amount ({car.units === Units.Metric ? 'L' : 'Gal'})
            </label>
            <input 
              required
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Cost ($)</label>
            <input 
              required
              type="number"
              step="0.01"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Distance Since Last Fill ({car.units === Units.Metric ? 'KM' : 'MI'})
            </label>
            <input 
              required
              type="number"
              step="1"
              name="distanceDriven"
              value={formData.distanceDriven}
              onChange={handleChange}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-orange-500 font-exo font-black text-xl focus:border-orange-600 focus:outline-none transition-colors italic"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-exo font-black italic uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all transform active:scale-95 flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Record Telemetry
        </button>
      </form>
    </div>
  );
};

export default RecordForm;
