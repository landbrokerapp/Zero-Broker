export interface Property {
  id: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  title: string;
  type: 'apartment' | 'house' | 'villa' | 'plot' | 'pg' | 'commercial';
  intent: 'buy' | 'rent' | 'pg';
  price: number;
  priceUnit: 'month' | 'total' | 'sqft';
  locality: string;
  city: string;
  bhk?: string;
  pgType?: 'boys' | 'girls' | 'coliving';
  furnishing: 'fully-furnished' | 'semi-furnished' | 'unfurnished';
  builtUpArea: number;
  carpetArea: number;
  floor: string;
  totalFloors: number;
  facing: string;
  parking: string;
  maintenanceCharges?: number;
  ownershipType: 'freehold' | 'leasehold' | 'cooperative';
  amenities: string[];
  images: string[];
  verified: boolean;
  postedDate: string;
  description: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
}

export interface Seller {
  id: string;
  name: string;
  experience: number;
  propertyCount: number;
  localities: string[];
  phone: string;
  avatar?: string;
}

export const localities = [
  'Saravanampatti',
  'Peelamedu',
  'RS Puram',
  'Gandhipuram',
  'Vadavalli',
];

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot/Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'others', label: 'Others' },
];

export const budgetRanges = {
  rent: [
    { value: '0-10000', label: 'Below ₹10K', min: 0, max: 10000 },
    { value: '10000-20000', label: '₹10K - ₹20K', min: 10000, max: 20000 },
    { value: '20000-30000', label: '₹20K - ₹30K', min: 20000, max: 30000 },
    { value: '30000+', label: 'Above ₹30K', min: 30000, max: Infinity },
  ],
  buy: [
    { value: '0-50L', label: 'Below 50L', min: 0, max: 5000000 },
    { value: '50L-1Cr', label: '50L - 1Cr', min: 5000000, max: 10000000 },
    { value: '1Cr-2Cr', label: '1Cr - 2Cr', min: 10000000, max: 20000000 },
    { value: '2Cr+', label: 'Above 2Cr', min: 20000000, max: Infinity },
  ],
  pg: [
    { value: '0-5000', label: 'Below ₹5K', min: 0, max: 5000 },
    { value: '5000-10000', label: '₹5K - ₹10K', min: 5000, max: 10000 },
    { value: '10000+', label: 'Above ₹10K', min: 10000, max: Infinity },
  ],
};

export const amenitiesList = {
  sports: ['Swimming Pool', 'Gym', 'Tennis Court', 'Badminton Court', 'Jogging Track'],
  convenience: ['Power Backup', 'Lift', 'Intercom', 'Gas Pipeline', 'Water Storage'],
  safety: ['CCTV', '24/7 Security', 'Gated Community', 'Fire Safety', 'Video Door Phone'],
  leisure: ['Club House', 'Garden', 'Party Hall', 'Kids Play Area', 'Library'],
  environment: ['Rain Water Harvesting', 'Solar Panels', 'Waste Management', 'EV Charging'],
};

export const mockProperties: Property[] = [];

export const mockSellers: Seller[] = [];
