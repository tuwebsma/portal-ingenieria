import { useState, useMemo } from 'react';

export function useSearchAndFilter<T>(
  items: T[],
  searchFields: (item: T) => string[],
  categoryField?: (item: T) => string
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by category
      if (categoryField && selectedCategory !== 'todos') {
        const itemCat = categoryField(item);
        if (itemCat !== selectedCategory) {
          return false;
        }
      }

      // Filter by search query
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      const searchableTexts = searchFields(item);
      return searchableTexts.some((text) => text.toLowerCase().includes(query));
    });
  }, [items, searchQuery, selectedCategory, searchFields, categoryField]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    hasFilters: searchQuery.trim().length > 0 || selectedCategory !== 'todos',
    resetFilters: () => {
      setSearchQuery('');
      setSelectedCategory('todos');
    },
  };
}
