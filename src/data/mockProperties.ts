export interface Property {
  id: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  title: string;
  type: 'apartment' | 'house' | 'villa' | 'plot' | 'pg' | 'commercial' | 'shop' | 'income';
  intent: 'buy' | 'rent' | 'pg';
  purpose?: 'Sale' | 'Rent' | 'PG';
  price: number;
  priceUnit: 'month' | 'total' | 'sqft' | 'cents';
  priceNegotiable?: boolean;
  maintenanceCharges?: number;
  securityDeposit?: number;
  foodIncluded?: boolean;
  locality: string;
  city: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  bhk?: string;
  bathrooms?: number;
  balconies?: number;
  parking: string;
  builtUpArea: number;
  carpetArea?: number;
  floor: string;
  totalFloors: number;
  furnishing: 'fully-furnished' | 'semi-furnished' | 'unfurnished';
  availableFrom?: string;
  propertyAge?: 'new' | '1-3' | '3-5' | '5+';
  facing?: string;
  ownershipType?: 'freehold' | 'leasehold' | 'cooperative';
  amenities: string[];
  // Land specific
  plotArea?: number;
  plotAreaUnit?: 'sqft' | 'cents';
  boundaryWall?: boolean;
  roadWidth?: string;
  // PG specific
  pgDetails?: {
    pgType: 'boys' | 'girls' | 'coliving';
    roomType: 'single' | 'double' | 'shared';
    foodType: 'veg' | 'non-veg' | 'both';
    electricityChargesIncluded: boolean;
    houseRules?: string;
    numBeds?: number;
  };
  // Commercial specific
  washroomCount?: number;
  images: string[];
  videoUrl?: string;
  verified: boolean;
  status: 'active' | 'archived';
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

export const tamilNaduCities: Record<string, string[]> = {
  'Chennai': ['Adyar', 'Velachery', 'T Nagar', 'Anna Nagar', 'Ambattur', 'Porur', 'Madipakkam', 'Guindy', 'Mylapore', 'Perambur', 'Pallavaram', 'Tambaram', 'Royapettah', 'Thiruvanmiyur', 'Besant Nagar'],
  'Coimbatore': ['Saravanampatti', 'Peelamedu', 'RS Puram', 'Gandhipuram', 'Vadavalli', 'Singanallur', 'Thudiyalur', 'Kovaipudur', 'Ganapathy', 'Ramanathapuram', 'Saibaba Colony'],
  'Madurai': ['Anna Nagar', 'K Pudur', 'Sellur', 'Simmakkal', 'SS Colony', 'Tiruppalai', 'Tirunagar', 'Kalavasal', 'Arapalayam'],
  'Trichy': ['Thillai Nagar', 'Srirangam', 'Cantonment', 'KK Nagar', 'Woraiyur', 'Lalgudi', 'Tiruvarambur'],
  'Salem': ['Alagapuram', 'Fairlands', 'Suramangalam', 'Hasthampatti', 'Ammmapet', 'Kondalampatti'],
  'Tiruppur': ['Avinashi Road', 'Palladam Road', 'Dharapuram Road', 'Kangayam Road'],
  'Erode': ['Perundurai Road', 'Sathy Road', 'Bhavani', 'Gobichettipalayam'],
  'Vellore': ['Katpadi', 'Sathuvachari', 'Gandhi Nagar', 'Arcot'],
  'Tirunelveli': ['Palayamkottai', 'Pettai', 'Melapalayam', 'Tenkasi'],
  'Thoothukudi': ['Spic Nagar', 'Millerpuram', 'Meelavittan'],
  'Hosur': ['SIPCOT Phase I', 'SIPCOT Phase II', 'Mathigiri', 'Zuzuvadi'],
  'Kancheepuram': ['Sriperumbudur', 'Walajabad', 'Oragadam'],
  'Thanjavur': ['Medical College Road', 'McDaniel Nagar', 'Kumbakonam Road'],
  'Nagercoil': ['Kottar', 'Vadasery', 'Ozhuginasery'],
};

export const localities = Object.values(tamilNaduCities).flat();

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment / Flat' },
  { value: 'house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot / Land' },
  { value: 'commercial', label: 'Commercial Office' },
  { value: 'shop', label: 'Shop / Showroom' },
  { value: 'income', label: 'Income Property' },
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
  residential: ['Lift', 'Power Backup', 'Security', 'Parking', 'Water Supply', 'Gym', 'Swimming Pool', 'Club House'],
  pg: ['Wi-Fi', 'Food', 'Laundry', 'CCTV', 'Power Backup', 'Security', 'Parking'],
  commercial: ['Lift', 'Power Backup', 'Parking', 'Security', 'CCTV', 'Fire Safety'],
};

export const mockProperties: Property[] = [];

export const mockSellers: Seller[] = [];
