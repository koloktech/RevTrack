
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FuelRecord, CarDetails, FuelType, Units } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import History from './components/History';
import RecordForm from './components/RecordForm';
import CarProfile from './components/CarProfile';

const STORAGE_KEY_RECORDS = 'revtrack_records_v1';
const STORAGE_KEY_CAR = 'revtrack_car_v1';

const INITIAL_CAR: CarDetails = {
  id: 'main-car',
  make: 'Tesla',
  model: 'Model 3',
  year: 2023,
  fuelType: FuelType.Petrol,
  units: Units.Metric
};

const App: React.FC = () => {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [car, setCar] = useState<CarDetails>(INITIAL_CAR);
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY_RECORDS);
    const savedCar = localStorage.getItem(STORAGE_KEY_CAR);

    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedCar) setCar(JSON.parse(savedCar));
    
    setIsLoading(false);
  }, []);

  // Save data
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
      localStorage.setItem(STORAGE_KEY_CAR, JSON.stringify(car));
    }
  }, [records, car, isLoading]);

  const addRecord = (record: Omit<FuelRecord, 'id' | 'carId'>) => {
    const newRecord: FuelRecord = {
      ...record,
      id: crypto.randomUUID(),
      carId: car.id,
    };
    setRecords(prev => [newRecord, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateRecord = (updated: FuelRecord) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const updateCar = (updated: CarDetails) => {
    setCar(updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-orange-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout car={car}>
        <Routes>
          <Route path="/" element={<Dashboard records={records} car={car} />} />
          <Route path="/history" element={<History records={records} onDelete={deleteRecord} onUpdate={updateRecord} />} />
          <Route path="/add" element={<RecordForm onSubmit={addRecord} car={car} />} />
          <Route path="/profile" element={<CarProfile car={car} onUpdate={updateCar} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
