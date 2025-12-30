
import React, { useState } from 'react';
import { FuelRecord } from '../types';

interface HistoryProps {
  records: FuelRecord[];
  onDelete: (id: string) => void;
  onUpdate: (record: FuelRecord) => void;
}

const History: React.FC<HistoryProps> = ({ records, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FuelRecord | null>(null);

  const filteredRecords = records.filter(r => 
    r.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(r.date).toLocaleDateString().includes(searchTerm)
  );

  const startEdit = (record: FuelRecord) => {
    setEditingId(record.id);
    setEditForm({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (editForm) {
      onUpdate(editForm);
      cancelEdit();
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Station', 'Amount', 'Cost', 'Distance', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...records.map(r => [
        r.date,
        `"${r.station}"`,
        r.amount,
        r.cost,
        r.distanceDriven,
        `"${r.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `revtrack_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-exo font-black italic uppercase text-white">Fuel Logs</h2>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search station or date..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <div key={record.id} className={`bg-slate-900 border ${editingId === record.id ? 'border-orange-600' : 'border-slate-800'} rounded-2xl overflow-hidden transition-all shadow-lg`}>
              {editingId === record.id ? (
                <div className="p-6 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Station</label>
                        <input 
                          className="w-full bg-slate-800 border-none rounded p-2 text-sm" 
                          value={editForm?.station} 
                          onChange={e => setEditForm(prev => prev ? {...prev, station: e.target.value} : null)} 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                        <input 
                          type="date"
                          className="w-full bg-slate-800 border-none rounded p-2 text-sm" 
                          value={editForm?.date} 
                          onChange={e => setEditForm(prev => prev ? {...prev, date: e.target.value} : null)} 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Amount</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-800 border-none rounded p-2 text-sm" 
                          value={editForm?.amount} 
                          onChange={e => setEditForm(prev => prev ? {...prev, amount: Number(e.target.value)} : null)} 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Distance</label>
                        <input 
                          type="number"
                          className="w-full bg-slate-800 border-none rounded p-2 text-sm" 
                          value={editForm?.distanceDriven} 
                          onChange={e => setEditForm(prev => prev ? {...prev, distanceDriven: Number(e.target.value)} : null)} 
                        />
                      </div>
                   </div>
                   <div className="flex justify-end gap-2 pt-2">
                      <button onClick={cancelEdit} className="px-4 py-2 text-slate-400 text-xs font-bold">CANCEL</button>
                      <button onClick={saveEdit} className="px-6 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold">SAVE CHANGES</button>
                   </div>
                </div>
              ) : (
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21V6.75a4.5 4.5 0 1 1 9 0V21M3.375 21h17.25M4.5 21V10.5m1.5 10.5h.75m1.313-1.313h.75m.187 0h.75m.187 0h.75m.187 0h.75m.187 0h.75M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-3h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <h4 className="font-exo font-black italic text-lg">{record.station || 'Unknown Station'}</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:flex gap-4 md:gap-8">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Spent</p>
                      <p className="font-exo font-bold text-white">${record.cost}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Amount</p>
                      <p className="font-exo font-bold text-white">{record.amount}L</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Dist</p>
                      <p className="font-exo font-bold text-orange-500">{record.distanceDriven}KM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <button 
                      onClick={() => startEdit(record)}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="p-2 hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
            <p className="text-slate-500 font-bold italic">No records found matching your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
