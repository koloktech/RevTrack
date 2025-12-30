import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, Cell 
} from 'recharts';

// --- TYPES & CONSTANTS ---
enum FuelType { Petrol = 'Petrol', Diesel = 'Diesel', Electric = 'Electric', Hybrid = 'Hybrid' }
enum Units { Metric = 'Metric (L/km)', Imperial = 'Imperial (Gal/mi)' }

interface CarDetails {
  id: string;
  make: string;
  model: string;
  year: number;
  fuelType: FuelType;
  units: Units;
}

interface FuelRecord {
  id: string;
  carId: string;
  date: string;
  amount: number;
  cost: number;
  station: string;
  distanceDriven: number;
  notes?: string;
}

const STORAGE_KEY_RECORDS = 'revtrack_records_v1';
const STORAGE_KEY_CAR = 'revtrack_car_v1';

const INITIAL_CAR: CarDetails = {
  id: 'main-car',
  make: 'Performance',
  model: 'Vehicle',
  year: 2024,
  fuelType: FuelType.Petrol,
  units: Units.Metric
};

// --- COMPONENTS ---

const StatCard = ({ label, value, unit, highlight = false }: any) => (
  <div className={`p-5 rounded-3xl border transition-all duration-300 ${highlight ? 'bg-orange-600 border-orange-500 shadow-lg shadow-orange-900/20' : 'bg-slate-900 border-slate-800'}`}>
    <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${highlight ? 'text-white/70' : 'text-slate-500'}`}>{label}</div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-exo font-black italic">{value}</span>
      <span className={`text-[10px] font-bold uppercase ${highlight ? 'text-white/80' : 'text-slate-400'}`}>{unit}</span>
    </div>
  </div>
);

const Layout = ({ children, car }: { children: React.ReactNode, car: CarDetails }) => {
  const navItems = [
    { to: '/', label: 'Dash', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /> },
    { to: '/history', label: 'History', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
    { to: '/add', label: 'Add', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
    { to: '/profile', label: 'Car', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /> },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 flex flex-col bg-slate-950">
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-900/40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-exo font-black text-white tracking-tighter italic">REVTRACK</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-orange-600/10 text-orange-500 border-l-4 border-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">{item.icon}</svg>
              <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Active Rig</p>
          <p className="font-exo font-bold text-white truncate text-sm italic">{car.year} {car.make} {car.model}</p>
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-exo font-black text-xl tracking-tighter text-orange-500 italic">REVTRACK</span>
        </div>
        <div className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-black uppercase tracking-widest border border-slate-700">
          {car.model}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 max-w-6xl mx-auto w-full page-fade-in">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around py-4 px-2 z-50 shadow-2xl">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">{item.icon}</svg>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const Dashboard = ({ records, car }: { records: FuelRecord[], car: CarDetails }) => {
  const stats = useMemo(() => {
    const totalFuel = records.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCost = records.reduce((acc, curr) => acc + curr.cost, 0);
    const totalDistance = records.reduce((acc, curr) => acc + curr.distanceDriven, 0);
    const avgEfficiency = totalFuel > 0 ? (totalDistance / totalFuel) : 0;
    return {
      totalFuel: totalFuel.toFixed(1),
      totalCost: totalCost.toFixed(2),
      totalDistance: totalDistance.toFixed(0),
      avgEfficiency: avgEfficiency.toFixed(2),
      unit: car.units === Units.Metric ? 'km/L' : 'MPG'
    };
  }, [records, car]);

  const chartData = useMemo(() => 
    [...records].reverse().slice(-7).map(r => ({
      name: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      efficiency: parseFloat((r.distanceDriven / r.amount).toFixed(2)),
      cost: r.cost
    })), [records]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-1">Telemetry Dashboard</h2>
          <h3 className="text-4xl font-exo font-black text-white italic uppercase tracking-tighter">
            {car.make} <span className="text-orange-600">/</span> {car.model}
          </h3>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logs</div>
             <div className="text-xl font-exo font-black text-white">{records.length}</div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="text-right">
             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Year</div>
             <div className="text-xl font-exo font-black text-white">{car.year}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Fuel" value={stats.totalFuel} unit={car.units === Units.Metric ? 'L' : 'GAL'} />
        <StatCard label="Spend" value={stats.totalCost} unit="$" />
        <StatCard label="Odometer" value={stats.totalDistance} unit={car.units === Units.Metric ? 'KM' : 'MI'} />
        <StatCard label="Avg Efficiency" value={stats.avgEfficiency} unit={stats.unit} highlight />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-600"></div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Efficiency Curve</h4>
          {records.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="efficiency" stroke="#ea580c" strokeWidth={4} dot={{ fill: '#ea580c', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-600 italic text-sm">No data logged.</div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Cost per Session</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => <Cell key={index} fill={index === chartData.length - 1 ? '#ea580c' : '#334155'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 transition-all rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 border border-slate-700">
            Export Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

const History = ({ records, onDelete }: { records: FuelRecord[], onDelete: (id: string) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-exo font-black italic uppercase text-white tracking-tighter">Fuel Logs</h2>
        <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-900 px-3 py-1 rounded-full border border-slate-800 tracking-widest">Historical Telemetry</span>
      </div>

      <div className="space-y-4">
        {records.map(record => (
          <div key={record.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500 border border-slate-700 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21V6.75a4.5 4.5 0 1 1 9 0V21M3.375 21h17.25M4.5 21V10.5m1.5 10.5h.75" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(record.date).toLocaleDateString()}</p>
                <h4 className="font-exo font-black italic text-lg text-white">{record.station || 'Fuel-Up'}</h4>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 text-right">
              <div><p className="text-[9px] font-black text-slate-600 uppercase">Cost</p><p className="font-exo font-bold text-white">${record.cost}</p></div>
              <div><p className="text-[9px] font-black text-slate-600 uppercase">Amount</p><p className="font-exo font-bold text-white">{record.amount}L</p></div>
              <div><p className="text-[9px] font-black text-slate-600 uppercase">Dist</p><p className="font-exo font-bold text-orange-500">{record.distanceDriven}KM</p></div>
            </div>

            <button onClick={() => onDelete(record.id)} className="p-2 hover:bg-red-950/30 rounded-lg text-slate-600 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg>
            </button>
          </div>
        ))}
        {records.length === 0 && <div className="text-center py-20 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl text-slate-600 font-bold italic">No telemetry data found.</div>}
      </div>
    </div>
  );
};

const RecordForm = ({ onSubmit, car }: { onSubmit: (r: any) => void, car: CarDetails }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({ date: new Date().toISOString().split('T')[0], amount: '', cost: '', station: '', distanceDriven: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.amount || !data.cost || !data.distanceDriven) return;
    onSubmit({ ...data, amount: parseFloat(data.amount), cost: parseFloat(data.cost), distanceDriven: parseFloat(data.distanceDriven) });
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-4xl font-exo font-black italic uppercase text-white mb-2 tracking-tighter">New Entry</h2>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Logging System Telemetry</p>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Date', name: 'date', type: 'date' },
            { label: 'Station', name: 'station', type: 'text', placeholder: 'e.g. Shell V-Power' },
            { label: `Amount (${car.units === Units.Metric ? 'L' : 'Gal'})`, name: 'amount', type: 'number' },
            { label: 'Total Cost ($)', name: 'cost', type: 'number' }
          ].map(field => (
            <div key={field.name} className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{field.label}</label>
              <input required type={field.type} name={field.name} placeholder={field.placeholder} value={(data as any)[field.name]} onChange={e => setData({...data, [field.name]: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none transition-all" />
            </div>
          ))}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distance Log ({car.units === Units.Metric ? 'KM' : 'MI'})</label>
            <input required type="number" name="distanceDriven" value={data.distanceDriven} onChange={e => setData({...data, distanceDriven: e.target.value})} className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-4 text-orange-500 font-exo font-black text-2xl focus:border-orange-600 focus:outline-none transition-all italic" />
          </div>
        </div>
        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-exo font-black italic uppercase tracking-[0.2em] py-5 rounded-xl shadow-lg shadow-orange-900/40 transition-all transform active:scale-95">Save Record</button>
      </form>
    </div>
  );
};

const CarProfile = ({ car, onUpdate }: { car: CarDetails, onUpdate: (c: CarDetails) => void }) => (
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 bg-slate-900 rounded-full border-4 border-orange-600 flex items-center justify-center text-orange-500 shadow-xl shadow-orange-900/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
      </div>
      <div>
         <h2 className="text-3xl font-exo font-black italic uppercase text-white tracking-tighter">Rig Profile</h2>
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Configure your active vehicle</p>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
      {['Make', 'Model', 'Year'].map(label => (
        <div key={label} className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
          <input value={(car as any)[label.toLowerCase()]} onChange={e => onUpdate({...car, [label.toLowerCase()]: label === 'Year' ? parseInt(e.target.value) : e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-orange-600 focus:outline-none transition-all" />
        </div>
      ))}
      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Units System</label>
        <select value={car.units} onChange={e => onUpdate({...car, units: e.target.value as Units})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-orange-500 font-bold focus:border-orange-600 focus:outline-none appearance-none cursor-pointer">
          <option value={Units.Metric}>{Units.Metric}</option>
          <option value={Units.Imperial}>{Units.Imperial}</option>
        </select>
      </div>
    </div>
  </div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [car, setCar] = useState<CarDetails>(INITIAL_CAR);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const r = localStorage.getItem(STORAGE_KEY_RECORDS);
    const c = localStorage.getItem(STORAGE_KEY_CAR);
    if (r) setRecords(JSON.parse(r));
    if (c) setCar(JSON.parse(c));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
      localStorage.setItem(STORAGE_KEY_CAR, JSON.stringify(car));
    }
  }, [records, car, isLoading]);

  const addRecord = (record: any) => {
    const newRecord: FuelRecord = { ...record, id: crypto.randomUUID(), carId: car.id };
    setRecords(prev => [newRecord, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteRecord = (id: string) => setRecords(prev => prev.filter(r => r.id !== id));

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <HashRouter>
      <Layout car={car}>
        <Routes>
          <Route path="/" element={<Dashboard records={records} car={car} />} />
          <Route path="/history" element={<History records={records} onDelete={deleteRecord} />} />
          <Route path="/add" element={<RecordForm onSubmit={addRecord} car={car} />} />
          <Route path="/profile" element={<CarProfile car={car} onUpdate={setCar} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
