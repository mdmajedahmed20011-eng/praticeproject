'use client';

import { useState, useEffect } from 'react';
import { ProductProps } from '@/components/ProductCard/ProductCard';

const STORAGE_KEY = 'luxeaura-recently-viewed';
const MAX_ITEMS = 6;

export function useRecentlyViewed() {
  const [viewedItems, setViewedItems] = useState<ProductProps[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setViewedItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse recently viewed items', e);
    }
  }, []);

  const addViewedItem = (product: ProductProps) => {
    setViewedItems((prevItems) => {
      // Remove the exact item if it's already in the list so we can bump it to the front
      const filtered = prevItems.filter(item => item.id !== product.id);
      
      // Add the new item to the front
      const newItems = [product, ...filtered].slice(0, MAX_ITEMS);
      
      // Save it to storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      
      return newItems;
    });
  };

  const clearViewedItems = () => {
    setViewedItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    viewedItems,
    addViewedItem,
    clearViewedItems
  };
}
