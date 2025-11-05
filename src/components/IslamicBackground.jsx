import './IslamicBackground.css'

function IslamicBackground() {
  return (
    <div className="islamic-background">
      <svg className="bg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
        <defs>
          <pattern id="islamic-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Eight-pointed star pattern */}
            <g transform="translate(100, 100)">
              {/* Central star */}
              <polygon 
                points="0,-50 14,-14 50,-14 28,0 50,14 14,14 0,50 -14,14 -50,14 -28,0 -50,-14 -14,-14" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                opacity="0.1"
              />
              {/* Outer circles */}
              <circle cx="0" cy="0" r="70" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
              <circle cx="0" cy="0" r="85" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
            </g>
            {/* Corner decorations */}
            <g transform="translate(0, 0)">
              <polygon points="0,0 30,0 0,30" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.05" />
            </g>
            <g transform="translate(200, 0) rotate(90)">
              <polygon points="0,0 30,0 0,30" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.05" />
            </g>
            <g transform="translate(200, 200) rotate(180)">
              <polygon points="0,0 30,0 0,30" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.05" />
            </g>
            <g transform="translate(0, 200) rotate(270)">
              <polygon points="0,0 30,0 0,30" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.05" />
            </g>
            {/* Connecting lines */}
            <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.2" opacity="0.04" />
            {/* Diagonal lines */}
            <line x1="0" y1="0" x2="200" y2="200" stroke="currentColor" strokeWidth="0.2" opacity="0.03" />
            <line x1="200" y1="0" x2="0" y2="200" stroke="currentColor" strokeWidth="0.2" opacity="0.03" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
      <div className="bg-overlay"></div>
    </div>
  )
}

export default IslamicBackground

