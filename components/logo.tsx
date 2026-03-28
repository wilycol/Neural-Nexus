"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 40, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex-shrink-0 overflow-hidden rounded-2xl"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand.png"
          alt="Neural Nexus"
          width={size}
          height={size}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-orbitron text-xl font-bold gradient-text tracking-wider">
            NEURAL
          </span>
          <span className="font-orbitron text-sm font-medium text-muted-foreground tracking-[0.3em]">
            NEXUS
          </span>
        </div>
      )}
    </div>
  );
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return <Logo size={size} showText={false} />;
}
