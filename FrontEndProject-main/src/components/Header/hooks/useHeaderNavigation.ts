import { useEffect, useState } from 'react';

export const useHeaderNavigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hover menu
  const onNavItemEnter = (itemId: string, hasDropdown?: boolean) => {
    if (hasDropdown) {
      setHoveredNavItem(itemId);
    } else {
      setHoveredNavItem(null);
    }
  };

  const onNavLeave = () => {
    setHoveredNavItem(null);
  };

  return {
    scrolled,
    hoveredNavItem,
    isDropdownOpen: hoveredNavItem !== null,
    onNavItemEnter,
    onNavLeave,
  };
};
