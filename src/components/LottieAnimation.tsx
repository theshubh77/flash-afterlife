"use client";

import React, { useEffect, useState } from "react";
import { Lottie } from "lottie-react";

import candleData from "@/assets/lottie/candleFlame.json";
import ghostData from "@/assets/lottie/spookyGhost.json";
import skullData from "@/assets/lottie/sugarSkull.json";
import portalData from "@/assets/lottie/summoningPortal.json";
import arcadeData from "@/assets/lottie/retroArcade.json";

export type LottieAnimationType = "candle" | "ghost" | "skull" | "portal" | "arcade";

interface LottieAnimationProps {
  type: LottieAnimationType;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const animationMap: Record<LottieAnimationType, object> = {
  candle: candleData,
  ghost: ghostData,
  skull: skullData,
  portal: portalData,
  arcade: arcadeData,
};

export function LottieAnimation({
  type,
  className = "w-16 h-16",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`${className} bg-transparent animate-pulse`} />;
  }

  const animData = animationMap[type] || candleData;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <Lottie
        src={animData}
        loop={loop}
        autoplay={autoplay}
        className="w-full h-full"
      />
    </div>
  );
}
