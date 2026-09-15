import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * HTML5 Official Shield Logo
 */
export function HtmlIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <path d="M413.6 62.4H98.4L136.8 409.6L256 449.6L375.2 409.6L413.6 62.4Z" fill="#E44D26" />
      <path d="M256 418.4L347.2 384.8L378.4 86.4H256V418.4Z" fill="#F16529" />
      <path d="M256 187.2H192.8L188 136H256V86.4H134.4L148.8 236.8H256V187.2Z" fill="#EBEBEB" />
      <path d="M256 312L255.2 312.8L209.6 300.8L206.4 266.4H156.8L163.2 337.6L255.2 363.2L256 363V312Z" fill="#EBEBEB" />
      <path d="M256 187.2V136H373.6L378.4 86.4H256V187.2H320.8L315.2 249.6L256 265.6V316L348.8 290.4L358.4 187.2H256Z" fill="#FFFFFF" />
      <path d="M256 363.2L256 312.2L301.6 300.2L304.8 265.8H354.4L348 337L256 363.2Z" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * CSS3 Official Shield Logo
 */
export function CssIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <path d="M413.6 62.4H98.4L136.8 409.6L256 449.6L375.2 409.6L413.6 62.4Z" fill="#1572B6" />
      <path d="M256 418.4L347.2 384.8L378.4 86.4H256V418.4Z" fill="#33A9DC" />
      <path d="M256 187.2H192.8L188 136H256V86.4H134.4L148.8 236.8H256V187.2Z" fill="#EBEBEB" />
      <path d="M256 312L255.2 312.8L209.6 300.8L206.4 266.4H156.8L163.2 337.6L255.2 363.2L256 363V312Z" fill="#EBEBEB" />
      <path d="M256 187.2V136H373.6L378.4 86.4H256V187.2H320.8L315.2 249.6L256 265.6V316L348.8 290.4L358.4 187.2H256Z" fill="#FFFFFF" />
      <path d="M256 363.2L256 312.2L301.6 300.2L304.8 265.8H354.4L348 337L256 363.2Z" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * JavaScript Official Logo
 */
export function JsIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <rect width="512" height="512" rx="32" fill="#F7DF1E" />
      <path
        d="M296 370C296 385 306 397 325 397C340 397 349 389 349 375C349 324 281 332 281 254C281 209 313 180 361 180C395 180 422 195 435 224L389 253C382 238 371 230 357 230C343 230 334 238 334 250C334 297 402 291 402 368C402 418 368 447 319 447C272 447 245 421 238 387L296 370ZM178 372C178 392 189 400 205 400C218 400 228 393 232 384V186H285V385C285 425 256 447 207 447C162 447 131 422 125 376L178 372Z"
        fill="#000000"
      />
    </svg>
  );
}

/**
 * React Official Atom Logo
 */
export function ReactIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

/**
 * Tailwind CSS Official Waves Logo
 */
export function TailwindIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 310" fill="none">
      <path
        d="M256 0C176 0 128 48 112 112C144 72 184 60 232 76C259.4 85.1 279 105.1 300.8 127.4C336.4 163.6 378.1 206 464 206C544 206 592 158 608 94C576 134 536 146 488 130C460.6 120.9 441 100.9 419.2 78.6C383.6 42.4 341.9 0 256 0ZM112 176C32 176 -16 224 -32 288C0 248 40 236 88 252C115.4 261.1 135 281.1 156.8 303.4C192.4 339.6 234.1 382 320 382C400 382 448 334 464 270C432 310 392 322 344 306C316.6 296.9 297 276.9 275.2 254.6C239.6 218.4 197.9 176 112 176Z"
        fill="#06B6D4"
        transform="scale(0.8) translate(30, -5)"
      />
    </svg>
  );
}

/**
 * Git Official Branch Logo
 */
export function GitIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <path
        d="M502.8 233.9L278.1 9.2C265.8-3.1 245.9-3.1 233.6 9.2L187.5 55.3L243.6 111.4C258.4 106.4 275.6 109.9 287.1 121.4C298.8 133.1 302.2 150.7 296.8 165.7L350.3 219.2C365.3 213.8 382.9 217.2 394.6 228.9C409.9 244.2 409.9 269 394.6 284.3C379.3 299.6 354.5 299.6 339.2 284.3C327.9 273 324.3 256.3 329.3 241.8L279.8 192.3V329.9C283.4 332.6 286.7 335.9 289.4 339.8C304.7 355.1 304.7 379.9 289.4 395.2C274.1 410.5 249.3 410.5 234 395.2C218.7 379.9 218.7 355.1 234 339.8C237.4 336.4 241.4 333.6 245.7 331.6V191.1C241.4 189.1 237.4 186.3 234 182.9C222.7 171.6 219.1 154.9 224.1 140.4L168.4 84.7L9.2 243.9C-3.1 256.2-3.1 276.1 9.2 288.4L233.9 513.1C246.2 525.4 266.1 525.4 278.4 513.1L502.8 288.7C515.1 276.4 515.1 256.2 502.8 233.9Z"
        fill="#F05032"
      />
    </svg>
  );
}

/**
 * GitHub Official Octocat Logo
 */
export function GithubIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 98 96" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  );
}

/**
 * Adobe Illustrator Official Logo (Ai Square)
 */
export function IllustratorIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="52" fill="#330000" />
      <rect x="6" y="6" width="244" height="244" rx="46" stroke="#FF9A00" strokeWidth="12" fill="none" />
      <path
        d="M116 190L105.6 158H67.4L57 190H28L72 66H101L145 190H116ZM86.5 98.6L73.4 138.8H99.6L86.5 98.6Z"
        fill="#FF9A00"
      />
      <path
        d="M168 106H193V190H168V106Z"
        fill="#FF9A00"
      />
      <circle cx="180.5" cy="78.5" r="14.5" fill="#FF9A00" />
    </svg>
  );
}

/**
 * Adobe Photoshop Official Logo (Ps Square)
 */
export function PhotoshopIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="52" fill="#001E36" />
      <rect x="6" y="6" width="244" height="244" rx="46" stroke="#31A8FF" strokeWidth="12" fill="none" />
      <path
        d="M58 68H104C130 68 147 83 147 107C147 131 130 146 104 146H84V190H58V68ZM84 90V124H103C116 124 122 118 122 107C122 96 116 90 103 90H84Z"
        fill="#31A8FF"
      />
      <path
        d="M156 172C163 178 174 183 186 183C198 183 205 177 205 168C205 158 197 154 182 147C162 138 151 128 151 112C151 91 168 77 191 77C204 77 216 81 222 86L214 105C208 101 199 96 191 96C180 96 174 102 174 109C174 116 180 120 197 127C218 137 228 147 228 164C228 187 210 202 185 202C170 202 156 196 148 188L156 172Z"
        fill="#31A8FF"
      />
    </svg>
  );
}

/**
 * CorelDRAW Official Hot-Air Balloon Logo
 */
export function CorelDrawIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none">
      <defs>
        <linearGradient id="corel-s1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8BE21E" />
          <stop offset="100%" stopColor="#4A8F0E" />
        </linearGradient>
        <linearGradient id="corel-s2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#70C824" />
          <stop offset="100%" stopColor="#2E6B08" />
        </linearGradient>
        <linearGradient id="corel-s3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#51A914" />
          <stop offset="100%" stopColor="#1B4D04" />
        </linearGradient>
      </defs>
      <g transform="translate(0, -6)">
        {/* Outer Left Slice */}
        <path
          d="M75 55 C52 85 48 132 72 176 C92 212 112 232 126 248 C114 220 98 188 90 148 C82 108 86 68 98 44 C90 46 82 50 75 55 Z"
          fill="url(#corel-s3)"
        />
        {/* Mid Left Slice */}
        <path
          d="M98 44 C86 68 82 108 90 148 C98 188 114 220 126 248 L138 248 C126 216 110 180 106 140 C102 96 110 60 124 37 C115 39 105 41 98 44 Z"
          fill="url(#corel-s2)"
        />
        {/* Center Bright Slice */}
        <path
          d="M124 37 C110 60 102 96 106 140 C110 180 126 216 138 248 L158 248 C170 216 186 180 190 140 C194 96 186 60 172 37 C157 34 139 34 124 37 Z"
          fill="url(#corel-s1)"
        />
        {/* Mid Right Slice */}
        <path
          d="M172 37 C186 60 194 96 190 140 C186 180 170 216 158 248 L170 248 C182 220 198 188 206 148 C214 108 210 68 198 44 C190 41 180 39 172 37 Z"
          fill="url(#corel-s2)"
        />
        {/* Outer Right Slice */}
        <path
          d="M198 44 C210 68 214 108 206 148 C198 188 182 220 170 248 C184 232 204 212 224 176 C248 132 244 85 221 55 C214 50 206 46 198 44 Z"
          fill="url(#corel-s3)"
        />
        {/* Basket Rigging */}
        <ellipse cx="148" cy="253" rx="13" ry="3.5" fill="#FFE270" />
        <line x1="135" y1="254" x2="137" y2="268" stroke="#FFE270" strokeWidth="2.5" />
        <line x1="161" y1="254" x2="159" y2="268" stroke="#FFE270" strokeWidth="2.5" />
        <rect x="132" y="268" width="32" height="18" rx="4" fill="#FFE270" />
      </g>
    </svg>
  );
}

/**
 * Figma Official Logo
 */
export function FigmaIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  );
}

/**
 * OpenAI / ChatGPT Official Rosette Logo
 * Standalone, 100% authentic vector geometry without outer boxes
 */
export function ChatGptIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#10A37F">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4947zm-9.66-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1401-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1636a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

/**
 * Google Antigravity Official Logo
 * Pure Google Antigravity levitation arch with authentic Google quad-color styling
 */
export function AntigravityIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="antigravity-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="35%" stopColor="#EA4335" />
          <stop offset="70%" stopColor="#FBBC05" />
          <stop offset="100%" stopColor="#34A853" />
        </linearGradient>
      </defs>
      <g transform="translate(1, 1) scale(1.88)">
        {/* Antigravity Warp Arch */}
        <path
          d="M14.0777 13.984C14.945 14.6345 16.2458 14.2008 15.0533 13.0084C11.476 9.53949 12.2349 0 7.79033 0C3.34579 0 4.10461 9.53949 0.527295 13.0084C-0.773543 14.3092 0.635692 14.6345 1.50293 13.984C4.86344 11.7076 4.64663 7.69664 7.79033 7.69664C10.934 7.69664 10.7172 11.7076 14.0777 13.984Z"
          fill="url(#antigravity-grad)"
        />
        {/* Quantum Core Floating Node */}
        <circle cx="7.79" cy="4.2" r="1.8" fill="#4285F4" />
      </g>
    </svg>
  );
}

/**
 * Google Gemini Official 4-Point Star Sparkle
 * Pure standalone star with smooth gradient
 */
export function GeminiIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <defs>
        <linearGradient id="gemini-star-grad-clean" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1BA1E3" />
          <stop offset="35%" stopColor="#5468FF" />
          <stop offset="70%" stopColor="#9B4BFF" />
          <stop offset="100%" stopColor="#FF60A5" />
        </linearGradient>
      </defs>
      <path
        d="M256 16 C256 148 364 256 496 256 C364 256 256 364 256 496 C256 364 148 256 16 256 C148 256 256 148 256 16 Z"
        fill="url(#gemini-star-grad-clean)"
      />
      <circle cx="390" cy="110" r="28" fill="#60A5FA" opacity="0.85" />
      <circle cx="110" cy="390" r="20" fill="#F472B6" opacity="0.85" />
    </svg>
  );
}

/**
 * Midjourney Official Sailboat Logo
 */
export function MidjourneyIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <g transform="translate(16, 20) scale(0.94)" fill="#6366F1">
        <path d="M256 32 L360 300 L256 300 Z" fill="#6366F1" />
        <path d="M232 90 L140 300 L232 300 Z" fill="#818CF8" />
        <path d="M60 330 C130 400 380 400 450 330 C400 375 110 375 60 330 Z" fill="#4F46E5" />
        <path d="M120 320 L390 320 C350 360 160 360 120 320 Z" fill="#818CF8" />
      </g>
    </svg>
  );
}

/**
 * OpenAI Codex Official Logo
 * Code Intelligence chevron mark with central OpenAI core
 */
export function CodexIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M8 5L2 12L8 19"
        stroke="#10A37F"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 5L22 12L16 19"
        stroke="#10A37F"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 3L10 21"
        stroke="#6EE7B7"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Cursor AI (Anysphere) Official 3D Isometric Cube Logo
 */
export function CursorIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none">
      <g transform="translate(128, 128)">
        {/* Top Face */}
        <polygon points="0,-96 84,-48 0,0 -84,-48" fill="#52525B" />
        {/* Left Face */}
        <polygon points="-84,-48 0,0 0,96 -84,48" fill="#27272A" />
        {/* Right Face */}
        <polygon points="0,0 84,-48 84,48 0,96" fill="#18181B" />
        {/* Iconic Cursor White Arrow Pointer */}
        <polygon points="-30,-42 28,-22 -6,-2" fill="#FFFFFF" />
        <line x1="-6" y1="-2" x2="10" y2="18" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Visual Studio Code Official Origami Ribbon Logo
 * Authentic Microsoft VS Code ribbon path without artificial container box
 */
export function VisualStudioIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      {/* Background wing */}
      <path
        d="M70.912 99.317a6.223 6.223 0 0 0 4.96-.19l20.589-9.907A6.25 6.25 0 0 0 100 83.587V16.413a6.25 6.25 0 0 0-3.54-5.632L75.874.874a6.226 6.226 0 0 0-7.104 1.21L29.355 38.04 12.187 25.01a4.162 4.162 0 0 0-5.318.236l-5.506 5.009a4.168 4.168 0 0 0-.004 6.162L16.247 50 1.36 63.583a4.168 4.168 0 0 0 .004 6.162l5.506 5.01a4.162 4.162 0 0 0 5.318.236l17.168-13.032L68.77 97.917a6.217 6.217 0 0 0 2.143 1.4ZM75.015 27.3 45.11 50l29.906 22.701V27.3Z"
        fill="#007ACC"
      />
      {/* Top folding shade */}
      <path
        d="M96.461 10.796 75.857.876a6.23 6.23 0 0 0-7.107 1.207l-67.451 61.5a4.167 4.167 0 0 0 .004 6.162l5.51 5.009a4.167 4.167 0 0 0 5.32.236l81.228-61.62c2.725-2.067 6.639-.124 6.639 3.297v-.24a6.25 6.25 0 0 0-3.539-5.63Z"
        fill="#1F9CF0"
        opacity="0.85"
      />
      {/* Bottom fold */}
      <path
        d="m96.461 89.204-20.604 9.92a6.229 6.229 0 0 1-7.107-1.207l-67.451-61.5a4.167 4.167 0 0 1 .004-6.162l5.51-5.009a4.167 4.167 0 0 1 5.32-.236l81.228 61.62c2.725 2.067 6.639.124 6.639-3.297v.24a6.25 6.25 0 0 1-3.539 5.63Z"
        fill="#0065A9"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * Anthropic Claude Official Starburst Mark
 * Official 100% path from simple-icons / thesvg in authentic Anthropic Terracotta
 */
export function ClaudeIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#D97706">
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

/**
 * Behance Official Logo
 */
export function BehanceIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor">
      <path d="M400 136H312V112H400V136ZM192.4 225.2C204.6 216.4 212 201.2 212 181.6C212 142.4 180.8 128 140 128H48V384H146C188.8 384 224 365.2 224 322C224 293.2 210.8 266 192.4 225.2ZM108 178H138C156 178 168 186.8 168 202C168 217.2 156 226 138 226H108V178ZM142 334H108V272H142C162 272 176 283.6 176 303C176 322.4 162 334 142 334ZM348 200C294 200 256 238 256 292C256 348 294 384 350 384C392 384 422 360 434 328H388C380 340 366 348 350 348C324 348 308 332 304 308H440C440 304 440 298 440 292C440 238 402 200 348 200ZM304 274C308 250 324 236 348 236C372 236 386 250 390 274H304Z" />
    </svg>
  );
}
