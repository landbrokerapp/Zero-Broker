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

export const mockProperties: Property[] = [
  {
    id: '1',
    title: '2 BHK Apartment in Saravanampatti',
    coordinates: { lat: 11.0801, lng: 76.9958 },
    type: 'apartment',
    intent: 'rent',
    price: 16000,
    priceUnit: 'month',
    locality: 'Saravanampatti',
    city: 'Coimbatore',
    bhk: '2 BHK',
    furnishing: 'semi-furnished',
    builtUpArea: 1100,
    carpetArea: 950,
    floor: '3rd',
    totalFloors: 5,
    facing: 'East',
    parking: '1 Covered',
    maintenanceCharges: 2500,
    ownershipType: 'freehold',
    amenities: ['Swimming Pool', 'Gym', 'Power Backup', 'Lift', 'CCTV', '24/7 Security', 'Garden', 'Kids Play Area'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-25',
    description: 'Beautiful 2 BHK apartment with modern amenities in a prime location. Close to IT parks and shopping centers.',
    sellerId: 's1',
    sellerName: 'Rajesh Kumar',
    sellerPhone: '+91 98765 43210',
  },
  {
    id: '2',
    title: '1 BHK House for Rent in Peelamedu',
    coordinates: { lat: 11.0247, lng: 77.0006 },
    type: 'house',
    intent: 'rent',
    price: 12000,
    priceUnit: 'month',
    locality: 'Peelamedu',
    city: 'Coimbatore',
    bhk: '1 BHK',
    furnishing: 'unfurnished',
    builtUpArea: 750,
    carpetArea: 650,
    floor: 'Ground',
    totalFloors: 2,
    facing: 'North',
    parking: 'Open',
    ownershipType: 'freehold',
    amenities: ['Power Backup', 'Water Storage', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-24',
    description: 'Cozy 1 BHK independent house with private garden. Perfect for small families or working professionals.',
    sellerId: 's2',
    sellerName: 'Priya Sharma',
    sellerPhone: '+91 87654 32109',
  },
  {
    id: '3',
    title: 'Boys PG in Gandhipuram',
    coordinates: { lat: 11.0176, lng: 76.9663 },
    type: 'pg',
    intent: 'pg',
    price: 7000,
    priceUnit: 'month',
    locality: 'Gandhipuram',
    city: 'Coimbatore',
    pgType: 'boys',
    furnishing: 'fully-furnished',
    builtUpArea: 150,
    carpetArea: 120,
    floor: '2nd',
    totalFloors: 3,
    facing: 'South',
    parking: 'Bike Parking',
    ownershipType: 'leasehold',
    amenities: ['Power Backup', 'WiFi', 'Laundry', 'Food Included', 'CCTV'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-23',
    description: 'Comfortable boys PG with all meals included. Walking distance to bus stand and railway station.',
    sellerId: 's3',
    sellerName: 'Suresh PG',
    sellerPhone: '+91 76543 21098',
  },
  {
    id: '4',
    title: 'Girls PG near RS Puram',
    coordinates: { lat: 11.0120, lng: 76.9510 },
    type: 'pg',
    intent: 'pg',
    price: 8500,
    priceUnit: 'month',
    locality: 'RS Puram',
    city: 'Coimbatore',
    pgType: 'girls',
    furnishing: 'fully-furnished',
    builtUpArea: 180,
    carpetArea: 150,
    floor: '1st',
    totalFloors: 2,
    facing: 'East',
    parking: 'Bike Parking',
    ownershipType: 'leasehold',
    amenities: ['Power Backup', 'WiFi', 'Laundry', 'Food Included', 'CCTV', '24/7 Security', 'Hot Water'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-22',
    description: 'Safe and secure girls PG with home-cooked food. Near colleges and shopping areas.',
    sellerId: 's4',
    sellerName: 'Lakshmi Womens PG',
    sellerPhone: '+91 65432 10987',
  },
  {
    id: '5',
    title: '3 BHK Apartment for Sale in Vadavalli',
    coordinates: { lat: 11.0210, lng: 76.9069 },
    type: 'apartment',
    intent: 'buy',
    price: 7500000,
    priceUnit: 'total',
    locality: 'Vadavalli',
    city: 'Coimbatore',
    bhk: '3 BHK',
    furnishing: 'semi-furnished',
    builtUpArea: 1650,
    carpetArea: 1450,
    floor: '5th',
    totalFloors: 8,
    facing: 'West',
    parking: '2 Covered',
    maintenanceCharges: 4000,
    ownershipType: 'freehold',
    amenities: ['Swimming Pool', 'Gym', 'Power Backup', 'Lift', 'CCTV', '24/7 Security', 'Club House', 'Garden', 'Kids Play Area', 'Party Hall'],
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-20',
    description: 'Luxurious 3 BHK apartment in a premium gated community. Offers breathtaking views and world-class amenities.',
    sellerId: 's5',
    sellerName: 'Dhanvi Ventures',
    sellerPhone: '+91 54321 09876',
  },
  {
    id: '6',
    title: 'Spacious Villa in Peelamedu',
    coordinates: { lat: 11.0260, lng: 77.0030 },
    type: 'villa',
    intent: 'buy',
    price: 15000000,
    priceUnit: 'total',
    locality: 'Peelamedu',
    city: 'Coimbatore',
    bhk: '4 BHK',
    furnishing: 'fully-furnished',
    builtUpArea: 3200,
    carpetArea: 2800,
    floor: 'Ground + 1',
    totalFloors: 2,
    facing: 'North-East',
    parking: '3 Covered',
    ownershipType: 'freehold',
    amenities: ['Private Pool', 'Garden', 'Power Backup', 'Modular Kitchen', 'Home Theatre', 'CCTV', 'Solar Panels'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-18',
    description: 'Stunning 4 BHK villa with private pool and landscaped garden. Premium interiors with imported fittings.',
    sellerId: 's1',
    sellerName: 'Rajesh Kumar',
    sellerPhone: '+91 98765 43210',
  },
  {
    id: '7',
    title: 'Premium Plot in Saravanampatti',
    coordinates: { lat: 11.0850, lng: 76.9990 },
    type: 'plot',
    intent: 'buy',
    price: 4500000,
    priceUnit: 'total',
    locality: 'Saravanampatti',
    city: 'Coimbatore',
    furnishing: 'unfurnished',
    builtUpArea: 2400,
    carpetArea: 2400,
    floor: 'N/A',
    totalFloors: 0,
    facing: 'South',
    parking: 'N/A',
    ownershipType: 'freehold',
    amenities: ['Gated Community', 'Underground Drainage', 'Street Lights', 'Wide Roads'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-15',
    description: 'DTCP approved plot in a developing area. Ideal for investment or building your dream home.',
    sellerId: 's5',
    sellerName: 'Dhanvi Ventures',
    sellerPhone: '+91 54321 09876',
  },
  {
    id: '8',
    title: '2 BHK Fully Furnished in RS Puram',
    coordinates: { lat: 11.0086, lng: 76.9493 },
    type: 'apartment',
    intent: 'rent',
    price: 25000,
    priceUnit: 'month',
    locality: 'RS Puram',
    city: 'Coimbatore',
    bhk: '2 BHK',
    furnishing: 'fully-furnished',
    builtUpArea: 1200,
    carpetArea: 1050,
    floor: '4th',
    totalFloors: 6,
    facing: 'East',
    parking: '1 Covered',
    maintenanceCharges: 3000,
    ownershipType: 'freehold',
    amenities: ['Gym', 'Power Backup', 'Lift', 'CCTV', '24/7 Security', 'Modular Kitchen', 'AC'],
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    ],
    verified: true,
    postedDate: '2026-01-26',
    description: 'Move-in ready 2 BHK with premium furnishings. Walking distance to shopping and restaurants.',
    sellerId: 's2',
    sellerName: 'Priya Sharma',
    sellerPhone: '+91 87654 32109',
  },
];

export const mockSellers: Seller[] = [
  {
    id: 's1',
    name: 'Rajesh Kumar',
    experience: 15,
    propertyCount: 24,
    localities: ['Peelamedu', 'Saravanampatti'],
    phone: '+91 98765 43210',
  },
  {
    id: 's2',
    name: 'Priya Sharma',
    experience: 8,
    propertyCount: 12,
    localities: ['RS Puram', 'Peelamedu'],
    phone: '+91 87654 32109',
  },
  {
    id: 's5',
    name: 'Dhanvi Ventures',
    experience: 20,
    propertyCount: 45,
    localities: ['Vadavalli', 'Saravanampatti', 'Gandhipuram'],
    phone: '+91 54321 09876',
  },
];
