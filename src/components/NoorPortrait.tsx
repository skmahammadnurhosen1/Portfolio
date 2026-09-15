import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface NoorPortraitProps {
  customPhotoUrl: string | null;
  onOpenPhotoManager: () => void;
  darkMode: boolean;
}

export function NoorPortrait({
  customPhotoUrl,
  onOpenPhotoManager,
  darkMode,
}: NoorPortraitProps) {
  const [imageError, setImageError] = useState(false);

  // Primary source is customPhotoUrl (if user uploaded another), otherwise the uploaded picture /noor-profile.png
  const imageSource = customPhotoUrl || '/noor-profile.png';

  return (
    <div className="relative w-full max-w-[440px] mx-auto flex items-center justify-center select-none group">
      {/* 1. Decorative Sunny Sparks / Rays above head (top-right of head popping out) */}
      <div className="absolute -top-3 right-12 sm:right-16 z-30 pointer-events-none">
        <svg
          width="50"
          height="50"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-amber-400 drop-shadow-xs"
        >
          <path
            d="M8 26C12 21 16 17 21 13"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M27 6V18"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M46 26C42 21 38 17 33 13"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Soft Organic Yellow Splash extending behind the circle towards the right */}
      <div
        className={`absolute top-12 -right-6 w-[88%] h-[80%] rounded-[40%_60%_70%_30%/50%_40%_60%_50%] pointer-events-none transition-transform duration-700 ${
          darkMode ? 'bg-amber-500/10' : 'bg-[#FDE68A]/60'
        } transform rotate-6 scale-105`}
      />

      {/* 3. Outer Curved Accent Arc around the left of the circle (matches UI screenshot stroke) */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        <svg
          className="w-full h-full text-amber-400"
          viewBox="0 0 400 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer sweeping curved contour on left side of circle */}
          <path
            d="M75 360 C40 300 35 190 80 120 C100 90 130 70 170 65"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-80"
          />
        </svg>
      </div>

      {/* 4. MAIN CIRCLE & POP-OUT PORTRAIT COMPOSITION */}
      <div className="relative z-20 w-full aspect-[400/440] max-h-[440px] flex items-end justify-center">
        <svg
          viewBox="0 0 400 440"
          className="w-full h-full overflow-visible transition-transform duration-500 group-hover:scale-[1.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pop-Out Clip Path:
                - Bottom half (y >= 235): Clipped strictly to the circle arc!
                - Top half (y < 235): Opens wide up to y = -50, so Noor's head and hair break out of the circle cleanly! */}
            <clipPath id="noor-popout-clip">
              <path d="M 40 235 L 40 -50 L 360 -50 L 360 235 A 160 160 0 0 1 40 235 Z" />
            </clipPath>

            {/* Sunny Yellow Radial Gradient for Circle */}
            <radialGradient id="noor-circle-light" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="75%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>

            {/* Dark Mode Gradient */}
            <radialGradient id="noor-circle-dark" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="65%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
          </defs>

          {/* Yellow Circle Base (Center: 200, 235; Radius: 160. Top rim is at y = 75, Bottom is at y = 395) */}
          <circle
            cx="200"
            cy="235"
            r="160"
            fill={darkMode ? 'url(#noor-circle-dark)' : 'url(#noor-circle-light)'}
            stroke={darkMode ? '#FBBF24' : '#FDE68A'}
            strokeWidth="4"
            className="filter drop-shadow-lg"
          />

          {/* Portrait Image:
              Starts at y = 20 (Head pops out 55px ABOVE the top rim of the circle at y = 75!)
              Bottom of the body curves smoothly inside the circle via clipPath */}
          {!imageError ? (
            <image
              href={imageSource}
              x="30"
              y="18"
              width="340"
              height="380"
              clipPath="url(#noor-popout-clip)"
              preserveAspectRatio="xMidYMax meet"
              onError={() => setImageError(true)}
              className="drop-shadow-md cursor-pointer select-none"
            />
          ) : (
            /* Pop-out Fallback Vector Illustration */
            <g clipPath="url(#noor-popout-clip)">
              <defs>
                <linearGradient id="skin-art" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5B289" />
                  <stop offset="60%" stopColor="#E29468" />
                  <stop offset="100%" stopColor="#C9784D" />
                </linearGradient>
                <linearGradient id="hair-art" x1="0" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor="#252528" />
                  <stop offset="100%" stopColor="#121214" />
                </linearGradient>
                <linearGradient id="hoodie-art" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2A2A2E" />
                  <stop offset="100%" stopColor="#151518" />
                </linearGradient>
              </defs>

              {/* Black Hoodie Shoulders & Chest */}
              <path
                d="M30 400 C 60 300, 110 260, 180 260 C 230 260, 300 280, 370 400 Z"
                fill="url(#hoodie-art)"
              />
              <path
                d="M130 270 C 150 250, 240 250, 265 270 C 255 295, 230 315, 195 315 C 160 315, 135 295, 130 270 Z"
                fill="#1E1E22"
              />
              <path
                d="M165 285 C 165 320, 160 350, 162 375"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M225 285 C 225 320, 230 350, 228 375"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="165" cy="285" r="4.5" fill="#E0E0E0" />
              <circle cx="225" cy="285" r="4.5" fill="#E0E0E0" />

              {/* Neck & Face */}
              <path
                d="M175 190 L 175 260 C 185 265, 205 265, 215 260 L 225 190 Z"
                fill="#D8865B"
              />
              {/* Head popping out above circle line */}
              <path
                d="M160 130 C 150 170, 160 210, 190 228 C 220 240, 255 225, 275 180 C 290 145, 275 100, 240 90 C 195 80, 170 100, 160 130 Z"
                fill="url(#skin-art)"
              />
              <path
                d="M152 155 C 145 150, 142 168, 148 180 C 153 188, 160 185, 162 175 Z"
                fill="#E29468"
              />
              <path d="M245 145 L 268 140 L 250 158 Z" fill="#D8865B" />
              <ellipse cx="236" cy="134" rx="4" ry="4.5" fill="#18181B" />
              <circle cx="238" cy="132" r="1.2" fill="#FFFFFF" />
              <path
                d="M225 178 C 235 176, 248 176, 255 180"
                stroke="#3D2E24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Hair breaking out of the circle */}
              <path
                d="M140 150 C 130 100, 160 50, 210 40 C 255 30, 280 55, 285 85 C 295 105, 285 130, 275 135 C 270 115, 255 95, 230 100 C 205 105, 180 110, 160 135 Z"
                fill="url(#hair-art)"
              />
            </g>
          )}
        </svg>
      </div>

      {/* 5. Handwritten Script on the right: "Design Build Grow" with curved underline */}
      <div className="absolute -right-4 top-16 md:-right-8 md:top-20 z-30 pointer-events-none transform rotate-3">
        <div className="font-handwriting text-2xl md:text-3xl font-bold tracking-wide text-stone-800 dark:text-amber-200 leading-tight flex flex-col items-start drop-shadow-xs">
          <span>Design</span>
          <span className="pl-1">Build</span>
          <span className="pl-2 relative">
            Grow
            <svg
              className="absolute -bottom-2.5 -left-2 w-20 h-4 text-stone-800 dark:text-amber-300"
              viewBox="0 0 100 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 14C30 20 70 20 95 6"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* 6. Quick Photo Upload Trigger (subtle pill on hover) */}
      <div className="absolute bottom-1 left-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onOpenPhotoManager}
          title="Upload or manage profile photo"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white/95 text-stone-800 shadow-md hover:bg-amber-400 hover:text-stone-900 transition-colors border border-stone-200 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Change Photo</span>
        </button>
      </div>
    </div>
  );
}
