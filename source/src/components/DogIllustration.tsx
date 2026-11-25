import { useId, useState, type MouseEvent, type KeyboardEvent } from 'react';
import { careHotspots, pupilOffset, type Point } from '@/lib/dogMotion';

interface DogIllustrationProps {
  selectedPart: string | null;
  onSelectPart: (partId: string) => void;
  collarActive?: boolean;
  onCollarClick?: () => void;
}

export default function DogIllustration({ selectedPart, onSelectPart, collarActive, onCollarClick }: DogIllustrationProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [collarHovered, setCollarHovered] = useState(false);
  const [clickedPoint, setClickedPoint] = useState<(Point & { part: string }) | null>(null);
  const id = useId().replace(/:/g, '');
  const target = collarActive ? { x: 150, y: 242 }
    : selectedPart && careHotspots[selectedPart]
      ? clickedPoint?.part === selectedPart ? clickedPoint : careHotspots[selectedPart]
      : null;
  const motion = (part: string) => selectedPart === part ? ' is-selected' : '';

  function selectPart(part: string, event?: MouseEvent<SVGGElement>) {
    const svg = event?.currentTarget.ownerSVGElement;
    const matrix = svg?.getScreenCTM();
    if (event && svg && matrix) {
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const local = point.matrixTransform(matrix.inverse());
      setClickedPoint({ x: local.x, y: local.y, part });
    } else {
      setClickedPoint({ ...careHotspots[part], part });
    }
    onSelectPart(part);
  }

  function keyboardSelect(event: KeyboardEvent<SVGGElement>, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }

  return (
    <div className="care-dog relative w-full max-w-[300px] mx-auto">
      <svg viewBox="36 54 338 324" className="w-full h-auto" aria-label="강아지 부위별 건강 정보" role="group">
        <defs>
          {[127, 173].map((x, index) => <clipPath key={x} id={`${id}-eye-${index}`}><ellipse cx={x} cy="143" rx="11" ry="12" /></clipPath>)}
        </defs>
        <ellipse cx="215" cy="366" rx="112" ry="9" fill="#e9d5b7" opacity=".28" />

        {/* A flat, warm outline style to match the dogs on the home page. */}
        <g stroke="#ad773e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <g className={`care-tail care-part-motion${motion('tail')}`} style={{ transformOrigin: '311px 218px' }}>
            <path d="M309 218C341 206 362 174 354 145Q350 127 338 132Q328 136 335 147Q342 166 322 177L304 191" fill="#f5be70" />
            <path d="M337 133Q348 128 353 142Q347 152 337 148Q330 141 337 133Z" fill="#fff9ed" stroke="none" />
          </g>
          <g className={`care-body care-part-motion${motion('back')}`} style={{ transformOrigin: '231px 283px' }}>
            <path d="M166 190Q201 157 251 166Q299 170 318 211Q338 259 298 286Q267 311 209 296Q173 285 160 252Z" fill="#f5be70" />
            <path d="M193 244Q218 214 257 234Q286 250 278 275Q253 300 214 282Q190 273 193 244Z" fill="#fff4dc" stroke="none" />
            <g className={`care-fur care-part-motion${motion('fur')}`} style={{ transformOrigin: '270px 234px' }}>
              <path d="M258 216Q273 202 288 214Q301 231 289 245Q276 256 260 244Q250 233 258 216Z" fill="#eaa24a" stroke="none" />
              <path d="M261 231Q267 221 275 225M277 241Q284 234 286 228" fill="none" stroke="#d28e3e" strokeWidth="2" />
            </g>
            <path d="M223 174Q249 166 271 179" fill="none" stroke="#ffe0a7" strokeWidth="5" />
          </g>

          <g className={`care-paws care-part-motion${motion('paws')}`} style={{ transformOrigin: '213px 293px' }}>
            <path d="M179 275Q163 295 161 329Q160 345 174 345Q186 345 187 331L193 285" fill="#e3a456" />
            <path d="M259 283Q262 304 263 333Q266 346 280 344Q292 342 289 328L284 286" fill="#e3a456" />
            <path d="M193 282Q188 315 190 344Q190 360 204 360Q221 361 221 346L220 289" fill="#f5be70" />
            <path d="M295 277Q303 309 306 342Q308 359 292 360Q276 360 275 346L267 287" fill="#f5be70" />
            <path d="M168 337L168 343M176 337L176 344M197 352L197 358M207 352L207 359M272 336L272 343M283 351L283 358M294 351L294 359" fill="none" strokeWidth="1.7" />
          </g>

          <path d="M77 143C78 99 108 72 151 73C197 70 225 104 225 147Q226 199 184 220Q146 239 108 214Q74 192 77 143Z" fill="#f9ce89" />
          <g className={`care-ear-left care-part-motion${motion('ears')}`} style={{ transformOrigin: '87px 105px' }}>
            <path d="M94 99Q75 90 62 105Q48 125 60 151Q67 168 84 160Q96 149 97 128Q99 111 94 99Z" fill="#d99343" />
            <path d="M83 109Q69 104 65 123Q61 144 73 150Q84 145 85 125Z" fill="#f5be70" stroke="none" />
          </g>
          <g className={`care-ear-right care-part-motion${motion('ears')}`} style={{ transformOrigin: '212px 107px' }}>
            <path d="M205 103Q224 95 237 111Q248 129 240 153Q233 171 218 162Q206 151 204 132Q201 114 205 103Z" fill="#d99343" />
            <path d="M215 113Q228 106 233 125Q239 145 226 153Q215 148 213 130Z" fill="#f5be70" stroke="none" />
          </g>

          <g fill="#eaa78a" stroke="none" opacity=".65">
            <ellipse cx="108" cy="163" rx="9" ry="4" />
            <ellipse cx="192" cy="163" rx="9" ry="4" />
          </g>
          <ellipse cx="150" cy="182" rx="40" ry="33" fill="#fff9ed" stroke="none" />
          <g className={`care-eyes care-part-motion${motion('eyes')}`} style={{ transformOrigin: '150px 143px' }}>
            {[127, 173].map((x, index) => {
              const offset = pupilOffset({ x, y: 143 }, target);
              return <g key={x} className="care-eye">
                <ellipse cx={x} cy="143" rx="11" ry="12" fill="#fffdf8" stroke="#9b6839" strokeWidth="1.6" />
                <g clipPath={`url(#${id}-eye-${index})`} stroke="none">
                  <g className="care-pupil" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} data-gaze-x={offset.x.toFixed(3)} data-gaze-y={offset.y.toFixed(3)}>
                    <circle cx={x} cy="143" r="7" fill="#34261d" />
                    <circle cx={x - 2.2} cy="140.5" r="2.1" fill="#fff" />
                  </g>
                </g>
              </g>;
            })}
          </g>
          <g className={`care-nose care-part-motion${motion('nose')}`} style={{ transformOrigin: '150px 175px' }}>
            <path d="M140 173Q150 166 160 173Q161 178 151 182Q142 179 140 173Z" fill="#68462f" stroke="#68462f" strokeWidth="1.6" />
            <path d="M144 173Q148 171 151 172" stroke="#fff0d6" strokeWidth="1.6" />
          </g>
          <g className={`care-mouth care-part-motion${motion('mouth')}`} style={{ transformOrigin: '150px 190px' }}>
            <path d="M150 182V189Q142 200 135 191M150 189Q157 200 165 191" fill="none" strokeWidth="2.3" />
            <path d="M143 199Q151 204 158 198Q159 210 151 212Q144 210 143 199Z" fill="#eead9a" stroke="none" />
            <path d="M151 202V208" stroke="#d68f7c" strokeWidth="1.2" />
          </g>

          <g className={`care-collar${collarActive ? ' is-active' : ''}`} style={{ transformOrigin: '150px 228px' }}
            role="button" tabIndex={0} aria-label="목줄 뼈다귀: 동물병원 찾기" aria-pressed={!!collarActive}
            onMouseEnter={() => setCollarHovered(true)} onMouseLeave={() => setCollarHovered(false)}
            onClick={onCollarClick} onKeyDown={(event) => keyboardSelect(event, () => onCollarClick?.())}>
            <path d="M91 215Q149 243 209 215" fill="none" stroke="#d48743" strokeWidth="10" />
            <path d="M95 214Q150 238 204 214" fill="none" stroke="#fff0d6" strokeWidth="1.3" strokeDasharray="3 5" />
            <circle cx="150" cy="228" r="3" fill="#b3834a" strokeWidth="1.5" />
            <path d="M138 238C130 227 123 242 134 244C122 252 134 262 140 251H160C166 262 178 252 166 244C177 242 170 227 162 238Z" fill="#fff9ed" strokeWidth="1.8" />
            <path d="M91 215Q149 243 209 215" fill="none" stroke="transparent" strokeWidth="16" />
            <rect x="122" y="225" width="56" height="39" rx="12" fill="transparent" stroke="none" />
          </g>
        </g>

        {Object.entries(careHotspots).map(([part, position]) => {
          const active = selectedPart === part || hoveredPart === part;
          const rx = part === 'eyes' ? 38 : part === 'paws' ? 80 : position.r;
          const ry = part === 'eyes' ? 17 : part === 'paws' ? 23 : position.r;
          return <g key={part} role="button" tabIndex={0} aria-label={`${position.label} 정보 보기`} aria-pressed={selectedPart === part}
            className={`care-hotspot${active ? ' is-active' : ''}${selectedPart === part ? ' is-selected' : ''}`}
            onMouseEnter={() => setHoveredPart(part)} onMouseLeave={() => setHoveredPart(null)}
            onFocus={() => setHoveredPart(part)} onBlur={() => setHoveredPart(null)}
            onClick={(event) => selectPart(part, event)} onKeyDown={(event) => keyboardSelect(event, () => selectPart(part))}>
            <ellipse cx={position.x} cy={position.y} rx={rx} ry={ry} fill="transparent" className="care-hotspot-outline" stroke="#d19045" strokeWidth="1.4" strokeDasharray="3 4" />
            {active && <g pointerEvents="none">
              <rect x={position.x - 22} y={position.y - ry - 26} width="44" height="19" rx="9" fill="#805332" />
              <text x={position.x} y={position.y - ry - 13} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600" fontFamily="inherit">{position.label}</text>
            </g>}
          </g>;
        })}
        {(collarActive || collarHovered) && <g pointerEvents="none">
          <rect x="110" y="267" width="80" height="22" rx="11" fill="#688667" />
          <text x="150" y="282" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600" fontFamily="inherit">동물병원 찾기</text>
        </g>}
      </svg>
      <span className="sr-only" role="status">{selectedPart && careHotspots[selectedPart] ? `${careHotspots[selectedPart].label} 정보를 선택했습니다.` : collarActive ? '동물병원 찾기를 선택했습니다.' : '강아지 그림의 부위를 선택하세요.'}</span>
    </div>
  );
}
