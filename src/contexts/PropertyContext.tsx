import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockProperties, Property } from '@/data/mockProperties';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PropertyFilters {
  intent?: 'buy' | 'rent' | 'pg';
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
  addProperty: (property: Omit<Property, 'id' | 'postedDate' | 'verified'>, verified?: boolean) => Promise<void>;
  verifyProperty: (id: string) => Promise<void>;
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
            price: item.price,
            priceUnit: item.price_unit,
            locality: item.locality,
            city: item.city,
            bhk: item.bhk,
            furnishing: item.furnishing,
            builtUpArea: item.built_up_area,
            carpetArea: item.carpet_area,
            floor: item.floor,
            totalFloors: item.total_floors,
            facing: item.facing,
            parking: item.parking,
            maintenanceCharges: item.maintenance_charges,
            ownershipType: item.ownership_type,
            amenities: item.amenities,
            images: item.images,
            verified: item.verified,
            postedDate: item.posted_date,
            description: item.description,
            sellerId: item.seller_id,
            sellerName: item.seller_name,
            sellerPhone: item.seller_phone,
            pgType: item.pg_type,
            coordinates: item.coordinates
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
    if (filters.intent && property.intent !== filters.intent) return false;
    if (filters.locality && property.locality !== filters.locality) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (filters.bhk && property.bhk !== filters.bhk) return false;
    if (filters.furnishing && property.furnishing !== filters.furnishing) return false;
    if (filters.budgetMin && property.price < filters.budgetMin) return false;
    if (filters.budgetMax && property.price > filters.budgetMax) return false;
    return true;
  });

  const addProperty = async (propertyData: Omit<Property, 'id' | 'postedDate' | 'verified'>, verified = false) => {
    const newId = `prop_${Date.now()}`;
    const postedDate = new Date().toISOString().split('T')[0];

    const newProperty = {
      id: newId,
      title: propertyData.title,
      type: propertyData.type,
      intent: propertyData.intent,
      price: propertyData.price,
      price_unit: propertyData.priceUnit,
      locality: propertyData.locality,
      city: propertyData.city,
      bhk: propertyData.bhk,
      furnishing: propertyData.furnishing,
      built_up_area: propertyData.builtUpArea,
      carpet_area: propertyData.carpetArea,
      floor: propertyData.floor,
      total_floors: propertyData.totalFloors,
      facing: propertyData.facing,
      parking: propertyData.parking,
      maintenance_charges: propertyData.maintenanceCharges,
      ownership_type: propertyData.ownershipType,
      amenities: propertyData.amenities,
      images: propertyData.images,
      verified: verified,
      posted_date: postedDate,
      description: propertyData.description,
      seller_id: propertyData.sellerId,
      seller_name: propertyData.sellerName,
      seller_phone: propertyData.sellerPhone,
      pg_type: propertyData.pgType,
      coordinates: propertyData.coordinates
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

  const verifyProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ verified: true })
        .eq('id', id);

      if (error) throw error;

      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, verified: true } : p))
      );
    } catch (err) {
      console.error('Error verifying property:', err);
      // Local fallback
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, verified: true } : p))
      );
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
