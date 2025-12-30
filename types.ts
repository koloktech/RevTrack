
export enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid'
}

export enum Units {
  Metric = 'Metric (L/km)',
  Imperial = 'Imperial (Gal/mi)'
}

export interface CarDetails {
  id: string;
  make: string;
  model: string;
  year: number;
  fuelType: FuelType;
  units: Units;
}

export interface FuelRecord {
  id: string;
  carId: string;
  date: string;
  amount: number; // Liters or Gallons
  cost: number;
  station: string;
  distanceDriven: number; // km or miles
  notes?: string;
}

export interface DashboardStats {
  totalFuel: number;
  totalCost: number;
  totalDistance: number;
  avgEfficiency: number;
}
