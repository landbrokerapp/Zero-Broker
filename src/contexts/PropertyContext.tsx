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

        if (data && data.length > 0) {
          // Map database names to Property interface if needed
          setProperties(data as Property[]);
        } else {
          // If DB is empty, use mock data
          setProperties(mockProperties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties(mockProperties);
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

    const newProperty: Property = {
      ...propertyData,
      id: newId,
      postedDate: postedDate,
      verified: verified,
    };

    try {
      const { error } = await supabase
        .from('properties')
        .insert([newProperty]);

      if (error) throw error;

      setProperties((prev) => [newProperty, ...prev]);
      setUserPropertyIds((prev) => {
        const updated = [newProperty.id, ...prev];
        localStorage.setItem('zerobroker_user_properties', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Error adding property to Supabase:', err);
      // Still update locally so the user sees it in their session
      setProperties((prev) => [newProperty, ...prev]);
      throw err; // Rethrow to let the UI know it failed to sync with the cloud
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
