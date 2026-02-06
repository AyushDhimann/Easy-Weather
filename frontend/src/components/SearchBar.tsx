'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchLocations, SearchResult } from '@/lib/api';

interface SearchBarProps {
  onLocationSelect: (query: string) => void;
  onRequestGeolocation: () => void;
  isLoadingLocation: boolean;
}

export default function SearchBar({
  onLocationSelect,
  onRequestGeolocation,
  isLoadingLocation,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    onLocationSelect(`${result.lat},${result.lon}`);
    setQuery(`${result.name}, ${result.country}`);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onLocationSelect(query.trim());
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or zip..."
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 
                       text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30
                       transition-all duration-200 text-sm sm:text-base"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-300 animate-spin" />
          )}
        </div>
        <button
          type="button"
          onClick={onRequestGeolocation}
          disabled={isLoadingLocation}
          className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20
                     text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50
                     flex items-center gap-2"
          title="Use my location"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-md rounded-xl 
                       border border-white/20 shadow-2xl z-50 overflow-hidden">
          {results.map((result) => (
            <li key={`${result.lat}-${result.lon}`}>
              <button
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors
                           flex items-center gap-3"
              >
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-gray-400">
                    {result.region && `${result.region}, `}
                    {result.country}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
