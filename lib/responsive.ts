import { useEffect, useState } from "react";

// lib/responsive.ts
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: dimensions.width < breakpoints.md,
    isTablet: dimensions.width >= breakpoints.md && dimensions.width < breakpoints.lg,
    isDesktop: dimensions.width >= breakpoints.lg,
    ...dimensions,
  };
};

// Enhanced responsive hook component
export const Responsive = {
  Mobile: ({ children }: { children: React.ReactNode }) => {
    const { isMobile } = useResponsive();
    return isMobile ? children : null;
  },
  Desktop: ({ children }: { children: React.ReactNode }) => {
    const { isDesktop } = useResponsive();
    return isDesktop ? children : null;
  },
  Tablet: ({ children }: { children: React.ReactNode }) => {
    const { isTablet } = useResponsive();
    return isTablet ? children : null;
  },
};