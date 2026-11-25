/** Outline lettering redrawn by hand from the supplied TOGETHER WITH DOG sketch. */
export default function HandwrittenTitle() {
  return (
    <svg className="handwritten-title" viewBox="0 0 550 160" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-4 160 78)">
        {/* TOGETHER: intentionally uneven outlines, angles and counters from the sketch. */}
        <path d="M5 22 37 10 40 26 29 29 28 73 17 78 19 32 7 38Z" />
        <path d="M64 20C48 20 45 38 45 55 44 72 51 81 62 76 78 71 85 50 82 34 81 23 73 17 64 20ZM64 33C73 28 73 42 69 54 65 66 58 68 58 56 57 46 59 36 64 33Z" />
        <path d="M119 22C107 13 93 21 88 37 81 58 85 78 98 77L117 65 122 42 105 46 102 57 110 55 107 63 100 66C93 66 97 46 101 37 105 30 110 31 115 35Z" />
        <path d="m126 20 30-5-1 13-16 3-2 12 14-3-2 12-13 3-2 12 18-4-2 13-31 5Z" />
        <path d="m161 15 37-4-1 15-13 1-3 48-13 3 4-49-12 2Z" />
        <path d="m203 15 12-3-2 23 12-3 3-25 11 2-4 67-13 2 2-32-12 3-1 26-12 3Z" />
        <path d="m245 17 29-5-1 14-15 1-2 12 13-2-2 12-13 3-2 12 18-2-2 12-31 5Z" />
        <path d="m281 15 16-4C316 8 323 26 314 42L306 49 317 68 304 75 294 55 291 77 279 79ZM294 25 293 42C309 39 308 24 294 25Z" />

        {/* WITH: the smaller, closely set second line. */}
        <path d="m68 96 11-3 1 25 10-27 10 1-1 27 11-30 11 2-21 50-12-2 2-22-10 25-11-3Z" />
        <path d="m128 90 13-1-4 49-12 3Z" />
        <path d="m147 89 33-2-1 12-10-1-3 40-12 2 3-40-11 2Z" />
        <path d="m188 90 11-2-2 18 12-2 2-18 11 1-3 49-12 2 1-22-12 2-1 23-12-1Z" />

        </g>

        {/* DOG: the tall, loose letterforms on the right side of the original. */}
        <g className="dog-lettering" fill="currentColor" fillRule="evenodd">
          <path d="M343 13C359 1 378 4 389 14 410 33 411 52 398 73 386 94 367 110 349 126L337 40C335 29 336 20 343 13ZM354 44 359 71C369 63 375 52 369 44 365 39 358 41 354 44Z" />
          <path d="M417 50C402 52 391 68 390 87 387 110 398 126 415 128 436 129 450 110 452 89 455 66 438 46 423 49ZM421 74C411 75 408 93 414 101 423 109 432 95 431 85 431 77 427 73 421 74Z" />
          <path d="M502 40C490 14 478 6 468 15 453 27 447 49 448 73 449 101 461 136 473 139L481 127 478 104 486 99 492 139 506 135 498 89 510 85 508 68 474 80 471 93C465 88 463 72 466 57 469 42 477 35 487 49Z" />
        </g>
      </g>
    </svg>
  );
}
