import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockProperties, Property } from '@/data/mockProperties';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PropertyFilters {
  intent?: 'buy' | 'rent' | 'pg';
  city?: string;
  locality?: string;
  type?: string;
  bhk?: string;
  furnishing?: string;
  budgetMin?: number;
  budgetMax?: number;
}

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  filteredProperties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'postedDate' | 'verified' | 'status'>, verified?: boolean) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  archiveProperty: (id: string, status: 'active' | 'archived') => Promise<void>;
  verifyProperty: (id: string, status?: boolean) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  userProperties: Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [userPropertyIds, setUserPropertyIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('zerobroker_user_properties');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch properties from Supabase on mount
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('posted_date', { ascending: false });

        if (error) throw error;

        if (data) {
          // Map snake_case from DB to camelCase for the UI
          const mappedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            intent: item.intent,
            purpose: item.purpose,
            price: item.price,
            priceUnit: item.price_unit,
            priceNegotiable: item.price_negotiable || false,
            maintenanceCharges: item.maintenance_charges,
            securityDeposit: item.security_deposit || 0,
            foodIncluded: item.food_included || false,
            locality: item.locality,
            city: item.city,
            landmark: item.landmark || '',
            pincode: item.pincode || '',
            bhk: item.bhk,
            bathrooms: item.bathrooms || 1,
            balconies: item.balconies || 0,
            furnishing: item.furnishing,
            builtUpArea: item.built_up_area,
            carpetArea: item.carpet_area,
            floor: item.floor,
            totalFloors: item.total_floors,
            facing: item.facing,
            parking: item.parking,
            ownershipType: item.ownership_type,
            availableFrom: item.available_from || '',
            propertyAge: item.property_age || 'new',
            amenities: item.amenities || [],
            images: item.images || [],
            videoUrl: item.video_url || '',
            verified: item.verified,
            status: item.status || 'active',
            postedDate: item.posted_date,
            description: item.description,
            sellerId: item.seller_id,
            sellerName: item.seller_name,
            sellerPhone: item.seller_phone,
            pgDetails: item.pg_details || (item.pg_type ? { pgType: item.pg_type } : undefined),
            coordinates: item.coordinates,
            plotArea: item.plot_area || 0,
            plotAreaUnit: item.plot_area_unit || 'sqft',
            boundaryWall: item.boundary_wall || false,
            roadWidth: item.road_width || '',
            washroomCount: item.washroom_count || 0
          }));
          setProperties(mappedData as Property[]);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties([]);
        toast.error('Failed to connect to the database. Listings may be unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    if (!property.verified) return false;

    // Intent Filter
    if (filters.intent && property.intent !== filters.intent) return false;

    // Improved Location Search (City or Locality, Case-Insensitive)
    if (filters.city) {
      const searchCity = filters.city.toLowerCase();
      if (property.city.toLowerCase() !== searchCity) return false;
    }

    if (filters.locality) {
      const searchLoc = filters.locality.toLowerCase().trim();
      // If the user searched for something, check if it matches locality OR city
      // This handles cases where people type a city name in the location search
      const matchesLocality = property.locality.toLowerCase().includes(searchLoc);
      const matchesCity = property.city.toLowerCase().includes(searchLoc);

      if (!matchesLocality && !matchesCity) return false;
    }

    // Other Filters (Case-Insensitive where applicable)
    if (filters.type && property.type.toLowerCase() !== filters.type.toLowerCase()) return false;
    if (filters.bhk && property.bhk !== filters.bhk) return false;
    if (filters.furnishing && property.furnishing.toLowerCase() !== filters.furnishing.toLowerCase()) return false;

    // Budget Filters
    if (filters.budgetMin && property.price < filters.budgetMin) return false;
    if (filters.budgetMax && property.price > filters.budgetMax) return false;

    // Status Filter (Don't show archived properties in main list)
    if (property.status === 'archived') return false;

    return true;
  });

  const addProperty = async (propertyData: Omit<Property, 'id' | 'postedDate' | 'verified' | 'status'>, verified = false) => {
    const newId = `prop_${Date.now()}`;
    const postedDate = new Date().toISOString().split('T')[0];

    const { data: { user } } = await supabase.auth.getUser();

    const newProperty = {
      id: newId,
      title: propertyData.title,
      type: propertyData.type || null,
      intent: propertyData.intent,
      purpose: propertyData.purpose,
      price: propertyData.price,
      price_unit: propertyData.priceUnit,
      price_negotiable: propertyData.priceNegotiable,
      maintenance_charges: propertyData.maintenanceCharges,
      security_deposit: propertyData.securityDeposit,
      food_included: propertyData.foodIncluded,
      locality: propertyData.locality,
      city: propertyData.city,
      landmark: propertyData.landmark,
      pincode: propertyData.pincode,
      bhk: propertyData.bhk,
      bathrooms: propertyData.bathrooms,
      balconies: propertyData.balconies,
      furnishing: propertyData.furnishing,
      built_up_area: propertyData.builtUpArea,
      carpet_area: propertyData.carpetArea,
      floor: propertyData.floor,
      total_floors: propertyData.totalFloors,
      facing: propertyData.facing,
      parking: propertyData.parking,
      ownership_type: propertyData.ownershipType,
      available_from: propertyData.availableFrom,
      property_age: propertyData.propertyAge,
      amenities: propertyData.amenities,
      images: propertyData.images,
      video_url: propertyData.videoUrl,
      verified: verified,
      posted_date: postedDate,
      description: propertyData.description,
      seller_id: propertyData.sellerId,
      seller_name: propertyData.sellerName,
      seller_phone: propertyData.sellerPhone,
      pg_details: propertyData.pgDetails,
      coordinates: propertyData.coordinates,
      plot_area: propertyData.plotArea,
      plot_area_unit: propertyData.plotAreaUnit,
      boundary_wall: propertyData.boundaryWall,
      road_width: propertyData.roadWidth,
      washroom_count: propertyData.washroomCount
    };

    try {
      const { error } = await supabase
        .from('properties')
        .insert([newProperty]);

      if (error) throw error;

      // Add to local state using the Property interface (camelCase)
      const stateProperty: Property = {
        ...propertyData,
        id: newId,
        postedDate: postedDate,
        verified: verified,
        status: 'active',
      };

      setProperties((prev) => [stateProperty, ...prev]);
      setUserPropertyIds((prev) => {
        const updated = [newId, ...prev];
        localStorage.setItem('zerobroker_user_properties', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Error adding property to Supabase:', err);
      throw err;
    }
  };

  const verifyProperty = async (id: string, status = true) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ verified: status })
        .eq('id', id);

      if (error) throw error;

      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, verified: status } : p))
      );
    } catch (err) {
      console.error('Error verifying property:', err);
      // Re-throw the error so the UI can catch it and show a toast
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    try {
      // If a seller edits their property, it must be re-verified by admin
      const updates: any = {};
      if (propertyData.title) updates.title = propertyData.title;
      if (propertyData.type) updates.type = propertyData.type;
      if (propertyData.intent) updates.intent = propertyData.intent;
      if (propertyData.purpose) updates.purpose = propertyData.purpose;
      if (propertyData.price) updates.price = propertyData.price;
      if (propertyData.priceUnit) updates.price_unit = propertyData.priceUnit;
      if (propertyData.priceNegotiable !== undefined) updates.price_negotiable = propertyData.priceNegotiable;
      if (propertyData.maintenanceCharges !== undefined) updates.maintenance_charges = propertyData.maintenanceCharges;
      if (propertyData.securityDeposit !== undefined) updates.security_deposit = propertyData.securityDeposit;
      if (propertyData.foodIncluded !== undefined) updates.food_included = propertyData.foodIncluded;
      if (propertyData.locality) updates.locality = propertyData.locality;
      if (propertyData.city) updates.city = propertyData.city;
      if (propertyData.landmark !== undefined) updates.landmark = propertyData.landmark;
      if (propertyData.pincode !== undefined) updates.pincode = propertyData.pincode;
      if (propertyData.bhk) updates.bhk = propertyData.bhk;
      if (propertyData.bathrooms !== undefined) updates.bathrooms = propertyData.bathrooms;
      if (propertyData.balconies !== undefined) updates.balconies = propertyData.balconies;
      if (propertyData.furnishing) updates.furnishing = propertyData.furnishing;
      if (propertyData.builtUpArea) updates.built_up_area = propertyData.builtUpArea;
      if (propertyData.carpetArea !== undefined) updates.carpet_area = propertyData.carpetArea;
      if (propertyData.floor) updates.floor = propertyData.floor;
      if (propertyData.totalFloors !== undefined) updates.total_floors = propertyData.totalFloors;
      if (propertyData.facing) updates.facing = propertyData.facing;
      if (propertyData.parking) updates.parking = propertyData.parking;
      if (propertyData.ownershipType) updates.ownership_type = propertyData.ownershipType;
      if (propertyData.availableFrom !== undefined) updates.available_from = propertyData.availableFrom;
      if (propertyData.propertyAge) updates.property_age = propertyData.propertyAge;
      if (propertyData.amenities) updates.amenities = propertyData.amenities;
      if (propertyData.images) updates.images = propertyData.images;
      if (propertyData.videoUrl !== undefined) updates.video_url = propertyData.videoUrl;
      if (propertyData.description) updates.description = propertyData.description;
      if (propertyData.pgDetails) updates.pg_details = propertyData.pgDetails;
      if (propertyData.coordinates) updates.coordinates = propertyData.coordinates;
      if (propertyData.plotArea !== undefined) updates.plot_area = propertyData.plotArea;
      if (propertyData.plotAreaUnit) updates.plot_area_unit = propertyData.plotAreaUnit;
      if (propertyData.boundaryWall !== undefined) updates.boundary_wall = propertyData.boundaryWall;
      if (propertyData.roadWidth !== undefined) updates.road_width = propertyData.roadWidth;
      if (propertyData.washroomCount !== undefined) updates.washroom_count = propertyData.washroomCount;

      // Reset verified status on edit
      updates.verified = false;

      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...propertyData, verified: false } : p))
      );
      toast.success('Property updated and sent for re-verification');
    } catch (err) {
      console.error('Error updating property:', err);
      throw err;
    }
  };

  const archiveProperty = async (id: string, status: 'active' | 'archived') => {
    try {
      // Note: 'status' column is missing in provided schema, 
      // so we only update local state for now.

      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      toast.success(`Property ${status === 'archived' ? 'archived' : 'restored'} successfully (Local only)`);
    } catch (err) {
      console.error('Error archiving property:', err);
      throw err;
    }
  };

  const userProperties = properties.filter((p) => userPropertyIds.includes(p.id));

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        filters,
        setFilters,
        filteredProperties,
        addProperty,
        updateProperty,
        archiveProperty,
        verifyProperty,
        deleteProperty,
        setProperties,
        userProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
