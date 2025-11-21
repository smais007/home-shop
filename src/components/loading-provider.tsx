"use client";

import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import LoadingScreen from "./loading-screen";

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // Handle initial page load
  useEffect(() => {
    // Show loading screen briefly on mount, then fade out
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle route changes
  useEffect(() => {
    setIsNavigating(true);

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {(isLoading || isNavigating) && <LoadingScreen message={isLoading ? "Loading..." : "Navigating..."} />}
      {children}
    </>
  );
}
