import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockProperties, Property } from '@/data/mockProperties';

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
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  filteredProperties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'postedDate' | 'verified'>) => void;
  verifyProperty: (id: string) => void;
  deleteProperty: (id: string) => void;
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  userProperties: Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('zerobroker_all_properties');
    return saved ? JSON.parse(saved) : mockProperties;
  });
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [userPropertyIds, setUserPropertyIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('zerobroker_user_properties');
    return saved ? JSON.parse(saved) : [];
  });

  // Save properties to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('zerobroker_all_properties', JSON.stringify(properties));
  }, [properties]);

  const filteredProperties = properties.filter((property) => {
    if (filters.intent && property.intent !== filters.intent) return false;
    if (filters.locality && property.locality !== filters.locality) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (filters.bhk && property.bhk !== filters.bhk) return false;
    if (filters.furnishing && property.furnishing !== filters.furnishing) return false;
    if (filters.budgetMin && property.price < filters.budgetMin) return false;
    if (filters.budgetMax && property.price > filters.budgetMax) return false;
    return true;
  });

  const addProperty = (propertyData: Omit<Property, 'id' | 'postedDate' | 'verified'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: `prop_${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      verified: false,
    };
    setProperties((prev) => [newProperty, ...prev]);
    setUserPropertyIds((prev) => {
      const updated = [newProperty.id, ...prev];
      localStorage.setItem('zerobroker_user_properties', JSON.stringify(updated));
      return updated;
    });
  };

  const verifyProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, verified: true } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const userProperties = properties.filter((p) => userPropertyIds.includes(p.id));

  return (
    <PropertyContext.Provider
      value={{
        properties,
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
