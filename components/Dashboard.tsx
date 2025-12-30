
import React from 'react';
import { FuelRecord, CarDetails, Units } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

interface DashboardProps {
  records: FuelRecord[];
  car: CarDetails;
}

const Dashboard: React.FC<DashboardProps> = ({ records, car }) => {
  const stats = React.useMemo(() => {
    const totalFuel = records.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCost = records.reduce((acc, curr) => acc + curr.cost, 0);
    const totalDistance = records.reduce((acc, curr) => acc + curr.distanceDriven, 0);
    const avgEfficiency = totalDistance > 0 ? (totalDistance / totalFuel) : 0;
    
    return {
      totalFuel: totalFuel.toFixed(1),
      totalCost: totalCost.toFixed(2),
      totalDistance: totalDistance.toFixed(0),
      avgEfficiency: avgEfficiency.toFixed(2),
      efficiencyUnit: car.units === Units.Metric ? 'km/L' : 'MPG'
    };
  }, [records, car]);

  const chartData = React.useMemo(() => {
    // Last 10 records for visualization
    return [...records].reverse().slice(-10).map(r => ({
      date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      efficiency: (r.distanceDriven / r.amount).toFixed(2),
      cost: r.cost,
      amount: r.amount
    }));
  }, [records]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs font-bold mb-1 uppercase">{label}</p>
          <p className="text-orange-500 font-exo font-bold">{payload[0].value} {stats.efficiencyUnit}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Summary */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Telemetry Summary</h2>
            <h3 className="text-3xl font-exo font-black text-white italic uppercase">{car.make} {car.model}</h3>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-slate-500 uppercase">Records</div>
             <div className="text-xl font-exo font-bold text-orange-500">{records.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Fuel" value={stats.totalFuel} unit={car.units === Units.Metric ? 'L' : 'GAL'} icon="fuel" />
          <StatCard label="Total Spend" value={stats.totalCost} unit="$" icon="currency" />
          <StatCard label="Distance" value={stats.totalDistance} unit={car.units === Units.Metric ? 'KM' : 'MI'} icon="distance" />
          <StatCard label="Avg Efficiency" value={stats.avgEfficiency} unit={stats.efficiencyUnit} icon="efficiency" highlight />
        </div>
      </section>

      {/* Main Efficiency Gauge/Graph */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Fuel Efficiency History</h4>
          
          {records.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#f97316" 
                    strokeWidth={4} 
                    dot={{ fill: '#f97316', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 italic">
               <p>No telemetry data available.</p>
               <p className="text-xs mt-2">Add your first fuel-up to see trends.</p>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Last Station Usage</h4>
          {records.length > 0 ? (
             <div className="space-y-4">
                {Array.from(new Set(records.map(r => r.station))).slice(0, 5).map((station, i) => {
                  const count = records.filter(r => r.station === station).length;
                  const percentage = (count / records.length) * 100;
                  return (
                    <div key={station} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{station || 'Unknown'}</span>
                        <span>{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
             </div>
          ) : (
             <div className="text-center text-slate-500 py-10 italic">No locations tracked.</div>
          )}
          <button className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300">
            View All Data
          </button>
        </div>
      </section>

      {/* Secondary Data: Spend per session */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Fuel Cost Analysis</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip cursor={{fill: '#1e293b'}} content={({active, payload}) => {
                 if (active && payload && payload.length) {
                    return (
                       <div className="bg-slate-800 border border-slate-700 p-2 rounded text-[10px] font-bold">
                         <span className="text-slate-400 mr-2">COST:</span>
                         <span className="text-white">${payload[0].value}</span>
                       </div>
                    )
                 }
                 return null;
              }} />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#f97316' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; unit: string; icon: string; highlight?: boolean }> = ({ label, value, unit, icon, highlight }) => {
  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 ${highlight ? 'bg-orange-600 border-orange-500' : 'bg-slate-900 border-slate-800'}`}>
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${highlight ? 'text-white/60' : 'text-slate-500'}`}>{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-exo font-black italic">{value}</span>
        <span className={`text-[10px] font-bold uppercase ${highlight ? 'text-white/80' : 'text-slate-400'}`}>{unit}</span>
      </div>
    </div>
  );
};

export default Dashboard;
