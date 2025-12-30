
import React from 'react';
import { CarDetails, FuelType, Units } from '../types';

interface CarProfileProps {
  car: CarDetails;
  onUpdate: (car: CarDetails) => void;
}

const CarProfile: React.FC<CarProfileProps> = ({ car, onUpdate }) => {
  const fuelTypes = Object.values(FuelType);
  const unitSystems = Object.values(Units);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...car,
      [name]: name === 'year' ? parseInt(value) : value
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-orange-600 flex items-center justify-center text-orange-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V14.25M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <div>
           <h2 className="text-3xl font-exo font-black italic uppercase text-white">Car Profile</h2>
           <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Active Vehicle: {car.year} {car.make} {car.model}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Make</label>
          <input 
            name="make"
            value={car.make}
            onChange={handleChange}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Model</label>
          <input 
            name="model"
            value={car.model}
            onChange={handleChange}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Year</label>
          <input 
            type="number"
            name="year"
            value={car.year}
            onChange={handleChange}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fuel Type</label>
          <select 
            name="fuelType"
            value={car.fuelType}
            onChange={handleChange}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none appearance-none"
          >
            {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Measurement Units</label>
          <select 
            name="units"
            value={car.units}
            onChange={handleChange}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-orange-500 font-bold focus:border-orange-600 focus:outline-none appearance-none"
          >
            {unitSystems.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-orange-600/10 border border-orange-600/20 p-6 rounded-3xl flex items-center gap-4">
        <div className="text-orange-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-sm text-slate-400">
          Changing the measurement units will not convert your existing record values. It only changes how new inputs are labeled and dashboard units are displayed.
        </p>
      </div>
    </div>
  );
};

export default CarProfile;
