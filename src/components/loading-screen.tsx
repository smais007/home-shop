"use client";

import React from "react";

import Image from "next/image";

import logoImg from "@/assets/logo.jpeg";

interface LoadingScreenProps {
  /** Optional small message shown under the logo */
  message?: string;
  /** Optional className to customize the container */
  className?: string;
}

export default function LoadingScreen({ message = "Loading...", className = "" }: LoadingScreenProps) {
  // Use bundled logo from src/assets (preferable when the file is present)
  const logoSrc = logoImg;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300 ${className}`}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8 px-6 py-8 text-center">
        {/* Logo Container with subtle shadow */}
        <div className="relative h-96 w-96">
          <Image
            src={logoSrc}
            alt="Logo"
            fill
            sizes="(max-width: 768px) 100px, 128px"
            className="object-contain p-2"
            onError={(e) => {
              console.info("LoadingScreen: logo failed to load from", logoSrc, e);
            }}
          />
        </div>

        {/* Spinner and Message */}
        <div className="flex flex-col items-center gap-4">
          <svg className="h-8 w-8 animate-spin text-gray-800" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
          </svg>

          <p className="text-base font-semibold text-gray-900">{message}</p>
        </div>
      </div>
    </div>
  );
}
