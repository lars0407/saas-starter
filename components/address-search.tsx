'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchAddresses, getAddressDetails } from '@/lib/api-client';
import { toast } from 'sonner';

interface Address {
  id: number;
  display_name: string;
  lat: number;
  lon: number;
  type: string;
  importance: number;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
    house_number?: string;
  };
}

interface AddressSearchProps {
  onAddressSelect: (address: Address) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export default function AddressSearch({ 
  onAddressSelect, 
  placeholder = "Adresse eingeben...", 
  className = "",
  initialValue = ""
}: AddressSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search addresses when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setAddresses([]);
      setShowDropdown(false);
      return;
    }

    const searchAddressesAsync = async () => {
      setLoading(true);
      try {
        const results = await searchAddresses(debouncedQuery, 8);
        setAddresses(results);
        setShowDropdown(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Address search error:', error);
        toast.error('Adresssuche fehlgeschlagen. Bitte versuchen Sie es erneut.');
        setAddresses([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    searchAddressesAsync();
  }, [debouncedQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDropdown) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < addresses.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && addresses[selectedIndex]) {
            handleAddressSelect(addresses[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowDropdown(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown, addresses, selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddressSelect = (address: Address) => {
    setQuery(address.display_name);
    setShowDropdown(false);
    setAddresses([]);
    setSelectedIndex(-1);
    onAddressSelect(address);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) {
      setAddresses([]);
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setAddresses([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onAddressSelect({
      id: 0,
      display_name: '',
      lat: 0,
      lon: 0,
      type: '',
      importance: 0,
      address: {}
    });
  };

  const formatAddress = (address: Address) => {
    // For JobJaeger API, we can use the display_name directly as it's already formatted
    // or construct from available parts
    const parts = [];
    
    if (address.address.city) {
      parts.push(address.address.city);
    }
    
    if (address.address.state) {
      parts.push(address.address.state);
    }
    
    if (address.address.country) {
      parts.push(address.address.country);
    }
    
    // If we have parts, join them, otherwise use display_name
    return parts.length > 0 ? parts.join(', ') : address.display_name;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-20 border-gray-300 focus:ring-2 focus:ring-[#0F973D] focus:border-[#0F973D] focus-visible:ring-2 focus-visible:ring-[#0F973D] focus-visible:border-[#0F973D]"
          onFocus={() => {
            if (addresses.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {loading && (
          <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Address Dropdown */}
      {showDropdown && addresses.length > 0 && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border-gray-200"
        >
          <CardContent className="p-0">
            <div className="max-h-60 overflow-y-auto">
              {addresses.map((address, index) => (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => handleAddressSelect(address)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  } ${index < addresses.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-[#0F973D] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {formatAddress(address)}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {address.display_name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {address.type} • Koordinaten: {address.lat.toFixed(6)}, {address.lon.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No results message */}
      {showDropdown && !loading && addresses.length === 0 && debouncedQuery.trim().length >= 3 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border-gray-200">
          <CardContent className="p-4 text-center text-gray-500">
            Keine Adressen gefunden für "{debouncedQuery}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}
