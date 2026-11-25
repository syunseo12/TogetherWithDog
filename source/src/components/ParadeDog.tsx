import { paradeDogs } from '@/data/paradeDogs';

interface ParadeDogProps {
  variant?: number;
  className?: string;
}

/** Original vector illustrations; the parade is decorative, unlike the care diagram. */
export default function ParadeDog({ variant = 0, className = '' }: ParadeDogProps) {
  const kind = ((variant % paradeDogs.length) + paradeDogs.length) % paradeDogs.length;
  return (
    <svg viewBox="0 0 260 190" fill="none" className={className} data-breed={paradeDogs[kind].id} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {kind === 0 && <>
          <path d="M199 115Q237 98 227 66Q214 78 209 98" fill="#fde6bc" />
          <path d="M92 104C111 87 187 86 202 112Q214 144 186 149H101Z" fill="#fcd18a" />
          <path className="parade-front-paw" d="M113 140V167Q104 176 99 165L98 139" fill="#fcd18a" />
          <path className="parade-front-paw" d="M144 145V169Q135 179 130 168V145" fill="#fcd18a" />
          <path className="parade-rear-paw" d="M187 140L192 165Q184 176 178 168L170 144" fill="#fcd18a" />
          <path d="M60 70L52 47Q39 48 35 77M91 70L102 46Q114 56 111 84" fill="#fcd18a" />
          <path d="M104 78Q87 59 60 68Q32 72 29 98Q28 120 58 125Q89 133 108 112Q121 94 104 78Z" fill="#fff9ed" />
          <path d="M47 110Q34 122 24 113Q17 101 32 100" />
          <ellipse cx="76" cy="101" rx="8" ry="6" fill="currentColor" stroke="none" />
          <circle cx="52" cy="89" r="3" fill="currentColor" stroke="none" /><circle cx="91" cy="87" r="3" fill="currentColor" stroke="none" />
          <path d="M75 108V114M67 114Q74 122 82 113M114 109L109 127" />
          <path d="M155 99Q146 114 160 123Q179 128 184 103" fill="#eaa24a" stroke="none" />
        </>}
        {kind === 1 && <>
          <path d="M190 105Q220 83 216 66Q238 93 202 121" fill="#fcd18a" />
          <path d="M88 99Q113 77 174 92Q209 96 205 128Q202 144 176 144H100Z" fill="#fff9ed" />
          <path className="parade-front-paw" d="M107 136L103 168Q90 176 89 164L91 134" fill="#fff9ed" />
          <path className="parade-front-paw" d="M135 141V169Q124 176 121 165V140" fill="#fff9ed" />
          <path className="parade-rear-paw" d="M184 136L191 164Q183 177 176 166L169 140" fill="#fff9ed" />
          <path d="M56 65Q78 43 104 68L111 106Q96 131 63 122L40 104Z" fill="#fcd18a" />
          <path d="M48 66Q29 61 27 82Q19 108 34 112Q54 111 59 75M98 66Q115 61 125 79Q138 105 119 112Q103 111 92 80" fill="#d99343" />
          <path d="M57 99Q76 90 96 102Q109 119 81 127Q49 128 50 113Z" fill="#fff9ed" />
          <circle cx="61" cy="85" r="3" fill="currentColor" stroke="none" /><circle cx="91" cy="85" r="3" fill="currentColor" stroke="none" />
          <path d="M71 103Q79 98 86 103L79 111Z" fill="currentColor" /><path d="M79 112V118M70 117Q79 124 87 116" />
          <path d="M155 94Q142 105 153 118Q171 122 177 96" fill="#fcd18a" stroke="none" />
        </>}
        {kind === 2 && <>
          <path d="M192 105Q209 74 226 72Q223 107 201 123" fill="#fcd18a" />
          <path d="M96 100Q130 83 181 96Q211 103 200 135Q179 154 108 141Z" fill="#fcd18a" />
          <path className="parade-front-paw" d="M111 138L109 169Q99 178 94 165L95 132" fill="#fcd18a" />
          <path className="parade-front-paw" d="M139 145L141 167Q131 179 127 168L124 142" fill="#fcd18a" />
          <path className="parade-rear-paw" d="M185 138L194 165Q186 177 180 167L171 144" fill="#fcd18a" />
          <path d="M65 75L52 39Q67 39 83 66M89 70L105 39Q114 55 106 85" fill="#fff9ed" />
          <path d="M61 70L31 105Q24 114 39 115L68 110Q93 129 108 106L112 86Q101 64 80 67Z" fill="#fff9ed" />
          <path d="M35 103L28 108L36 112Z" fill="currentColor" /><circle cx="75" cy="87" r="4" fill="currentColor" stroke="none" />
          <path d="M53 108Q57 119 69 113M109 112L95 131" />
          <path d="M89 93Q108 94 102 109Q87 115 89 93Z" fill="#eaa24a" stroke="none" />
        </>}
        {kind === 3 && <>
          <path d="M198 100Q226 69 239 90L233 99L242 106L230 113Q226 130 206 123" fill="#fff9ed" />
          <path d="M100 101L111 88L125 94L139 85L149 92L166 87L173 96L190 92L193 106L207 110L201 124L209 134L195 139L196 151L179 150L174 162L159 151L145 159L131 150L117 156L111 144L97 143Z" fill="#fff9ed" />
          <path className="parade-front-paw" d="M117 144L114 168Q104 179 98 166L99 141" fill="#fff9ed" />
          <path className="parade-rear-paw" d="M180 147L186 168Q177 178 170 166L164 148" fill="#fff9ed" />
          <path d="M51 70L39 57L40 80L25 77L34 91L22 103L35 108L28 121L46 122L46 135L64 130L74 140L84 129L99 135L100 119L113 115L105 101L116 91L103 84L107 70L90 74L83 59L70 69L59 58Z" fill="#fff9ed" />
          <path d="M39 79Q25 62 24 78Q18 93 38 99M99 78Q121 62 123 80Q129 96 106 100" fill="#fcd18a" />
          <circle cx="54" cy="96" r="3" fill="currentColor" stroke="none" /><circle cx="88" cy="96" r="3" fill="currentColor" stroke="none" />
          <path d="M65 106Q72 102 79 106L72 113Z" fill="currentColor" /><path d="M72 113V120M62 118Q71 128 82 118" />
          <path d="M128 111L132 119M154 104L159 111M179 125L184 133M145 137L150 144" />
        </>}
        {kind === 4 && <>
          {/* Dachshund: a long body, low legs and a soft hanging ear. */}
          <path d="M214 119Q239 104 236 81Q249 99 231 127" fill="#fcd18a" />
          <path d="M70 112Q108 100 192 109Q225 112 227 133Q230 151 204 153L81 151Z" fill="#eaa24a" />
          <path className="parade-front-paw" d="M88 145L87 168Q79 174 75 166V143" fill="#eaa24a" />
          <path className="parade-front-paw" d="M112 149L111 168Q102 173 99 165V148" fill="#eaa24a" />
          <path className="parade-rear-paw" d="M196 148L199 166Q192 175 187 166L184 147" fill="#eaa24a" />
          <path className="parade-rear-paw" d="M217 145L223 165Q217 173 212 165L205 149" fill="#eaa24a" />
          <path d="M44 77Q61 59 79 77Q92 88 87 110Q80 132 53 129L30 118Q20 108 31 99Z" fill="#fcd18a" />
          <path d="M67 77Q87 66 95 84L94 115Q84 134 75 116L67 93Z" fill="#d99343" />
          <path d="M32 105L21 107Q17 113 26 116L40 116" fill="#fff9ed" />
          <ellipse cx="25" cy="108" rx="5" ry="4" fill="currentColor" stroke="none" />
          <circle cx="52" cy="94" r="3" fill="currentColor" stroke="none" />
          <path d="M40 116Q46 124 55 116M86 126L81 141" />
          <path d="M121 118Q153 111 175 120" stroke="#fcd18a" strokeWidth="8" />
        </>}
        {kind === 5 && <>
          {/* Poodle: rounded curls, a clipped waist and pompom feet. */}
          <path d="M188 109Q218 86 213 68" />
          <path d="M206 55Q216 45 225 57Q240 58 232 72Q234 86 220 83Q207 88 202 75Q193 64 206 55Z" fill="#fff9ed" />
          <path d="M91 105Q127 91 168 103Q196 111 188 136Q164 145 107 136Z" fill="#fcd18a" />
          <path className="parade-front-paw" d="M105 131L100 163" strokeWidth="9" stroke="#fcd18a" />
          <path className="parade-front-paw" d="M126 137L126 165" strokeWidth="9" stroke="#fcd18a" />
          <path className="parade-rear-paw" d="M171 135L180 163" strokeWidth="9" stroke="#fcd18a" />
          <path className="parade-rear-paw" d="M181 129L193 158" strokeWidth="9" stroke="#fcd18a" />
          <path className="parade-front-paw" d="M93 151Q101 143 109 152Q121 155 113 166Q111 179 99 171Q85 174 88 161Z" fill="#fff9ed" />
          <path className="parade-front-paw" d="M120 154Q128 146 136 155Q147 161 137 169Q136 180 125 172Q113 176 114 163Z" fill="#fff9ed" />
          <path className="parade-rear-paw" d="M174 151Q184 144 190 153Q205 157 195 168Q193 180 182 172Q168 176 169 163Z" fill="#fff9ed" />
          <path d="M54 64Q57 49 70 55Q80 43 89 56Q107 50 110 68Q126 77 113 88L103 112 63 116 44 90Q33 73 54 64Z" fill="#fff9ed" />
          <path d="M54 82Q34 72 32 93Q25 112 44 121Q60 121 62 103M102 81Q120 73 124 91Q132 110 113 120Q99 120 96 102" fill="#fcd18a" />
          <path d="M63 83Q87 70 100 93L103 111Q88 133 64 119Q51 106 63 83Z" fill="#fff9ed" />
          <circle cx="69" cy="95" r="3" fill="currentColor" stroke="none" /><circle cx="91" cy="94" r="3" fill="currentColor" stroke="none" />
          <path d="M74 106Q81 101 88 106L81 112Z" fill="currentColor" /><path d="M81 112V119M72 116Q81 125 91 115" />
          <path d="M102 118L92 133L66 127" fill="#f59e0b" />
        </>}
        {kind === 6 && <>
          {/* Pug: a compact body, folded ears and a curled tail. */}
          <path d="M187 110Q217 77 227 98Q234 120 213 121Q198 118 210 106" fill="#fcd18a" />
          <path d="M96 103Q132 83 174 99Q204 106 199 136Q185 156 113 144Z" fill="#fcd18a" />
          <path className="parade-front-paw" d="M113 139L110 166Q99 176 95 165L96 137" fill="#fcd18a" />
          <path className="parade-front-paw" d="M142 146L144 168Q134 178 128 165V144" fill="#fcd18a" />
          <path className="parade-rear-paw" d="M183 138L193 164Q185 177 179 166L169 145" fill="#fcd18a" />
          <path d="M43 68L35 52Q53 47 67 66M92 64Q104 47 119 55L108 80" fill="#d99343" />
          <path d="M51 65Q79 49 101 65Q123 85 112 112Q100 135 66 127Q37 124 33 99Q30 78 51 65Z" fill="#fcd18a" />
          <path d="M48 92Q62 81 74 97Q84 82 101 94L103 113Q84 132 60 119Z" fill="#d99343" />
          <circle cx="54" cy="84" r="3" fill="currentColor" stroke="none" /><circle cx="94" cy="83" r="3" fill="currentColor" stroke="none" />
          <path d="M65 103Q74 96 84 103L75 111Z" fill="currentColor" /><path d="M75 111V116M64 114Q69 122 75 116Q81 122 87 114M62 71Q75 65 88 71" />
          <path d="M104 123L96 136" />
        </>}
        {kind === 7 && <>
          {/* Dalmatian: longer legs, floppy ears and warm brown spots. */}
          <path d="M194 108Q217 85 222 66Q234 90 205 124" fill="#fff9ed" />
          <path d="M95 101Q123 86 177 96Q208 103 204 128Q191 147 110 139Z" fill="#fff9ed" />
          <path className="parade-front-paw" d="M111 132L106 170Q96 179 91 166L94 130" fill="#fff9ed" />
          <path className="parade-front-paw" d="M138 140L137 171Q128 179 124 167L124 138" fill="#fff9ed" />
          <path className="parade-rear-paw" d="M186 133L196 167Q190 178 181 169L171 139" fill="#fff9ed" />
          <path d="M48 66Q70 52 95 67L109 96Q110 119 83 124L46 118 28 105Z" fill="#fff9ed" />
          <path d="M81 67Q103 54 114 76Q125 105 109 109Q94 112 89 88Z" fill="#a96e37" />
          <path d="M37 99L23 103Q21 112 34 113L47 111" fill="#fff9ed" />
          <ellipse cx="28" cy="104" rx="5" ry="4" fill="currentColor" stroke="none" />
          <circle cx="60" cy="84" r="3" fill="currentColor" stroke="none" />
          <path d="M50 111Q57 120 66 110M105 119L100 133" />
          <g fill="#a96e37" stroke="none">
            <path d="M124 101Q139 94 143 106Q139 120 128 116Q120 114 124 101Z" />
            <ellipse cx="175" cy="115" rx="10" ry="8" transform="rotate(-23 175 115)" />
            <ellipse cx="153" cy="135" rx="7" ry="5" />
            <ellipse cx="104" cy="151" rx="5" ry="7" />
            <circle cx="54" cy="65" r="5" /><circle cx="191" cy="136" r="5" />
          </g>
        </>}
        {kind >= 8 && <>
          <path d={kind === 8 ? 'M190 114Q226 112 227 85Q223 69 209 77Q195 87 211 94Q207 104 189 100' : 'M188 106Q218 91 242 98Q239 110 202 124'} fill="#e5a95f" />
          <path d="M90 103Q125 84 170 92Q212 97 206 132Q198 151 112 142Z" fill={kind === 8 ? '#e5a95f' : '#dcb279'} />
          <path className="parade-front-paw" d="M107 133L100 169Q91 176 88 166L91 130" fill="#fbedce" />
          <path className="parade-front-paw" d="M132 140L128 170Q120 178 115 168L117 139" fill="#fbedce" />
          <path className="parade-rear-paw" d="M183 135L192 167Q185 177 176 168L168 138" fill="#fbedce" />
          <path d="M44 78Q62 53 89 65Q113 74 108 104Q99 128 70 126L34 115Q23 102 44 78Z" fill={kind === 8 ? '#e5a95f' : '#dcb279'} />
          <path d={kind === 8 ? 'M48 77L49 46Q64 48 73 67M77 66Q91 46 103 48L103 84' : 'M72 69Q94 52 110 70Q119 93 100 106Q86 100 80 82Z'} fill="#c88849" />
          <path d="M35 99Q59 91 73 108Q67 129 42 118L29 110Z" fill="#fff5e1" />
          <circle cx="58" cy="85" r="3.5" fill="currentColor" stroke="none" />
          <ellipse cx="34" cy="105" rx="6" ry="4" fill="currentColor" stroke="none" />
          <path d="M39 113Q48 122 60 113" />
        </>}
      </g>
    </svg>
  );
}
