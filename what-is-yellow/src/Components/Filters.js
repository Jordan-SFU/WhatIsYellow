import React from 'react';

export const ProtanopiaFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="protanopiaColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".56667 .43333 0      0 0
                  .55833 .44167 0      0 0
                  0      .24167 .75833 0 0
                  0      0      0      1 0" />
            </filter>
        </defs>
    </svg>
);

export const ProtanomalyFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="protanomalyColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".81667 .18333 0 0 0
                  .33333 .66667 0 0 0
                  0      .125   .875 0 0
                  0      0      0    1 0" />
            </filter>
        </defs>
    </svg>
);

export const DeuteranopiaFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="deuteranopiaColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".625 .375 0 0 0
                    .7 .3 0 0 0
                    0 .3 .7 0 0
                    0 0 0 1 0" />
            </filter>
        </defs>
    </svg>
);

export const DeuteranomalyFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="deuteranomalyColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".8 .2 0 0 0
                    .25833 .74167 0 0 0
                    0 .14167 .85833 0 0
                    0 0 0 1 0" />
            </filter>
        </defs>
    </svg>
);

export const TritanopiaFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="tritanopiaColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".95 .05 0 0 0
                        0 .43333 .56667 0 0
                        0 .475 .525 0 0
                        0 0 0 1 0" />
            </filter>
        </defs>
    </svg>
);

export const TritanomalyFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="tritanomalyColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".96667 .03333 0 0 0
                        0 .73333 .26667 0 0
                        0 .18333 .81667 0 0
                        0 0 0 1 0" />
            </filter>
        </defs>
    </svg>
);

export const AchromatopsiaFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="achromatopsiaColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".299 .587 .114 0 0
                        .299 .587 .114 0 0
                        .299 .587 .114 0 0
                        0 0 0 1 0" />
            </filter>
        </defs>
    </svg>
);

export const AchromatomalyFilter = () => (
    <svg width="0" height="0">
        <defs>
            <filter id="achromatomalyColourMatrix">
                <feColorMatrix
                    type="matrix"
                    values=".618 .320 .062 0 0
                        .163 .775 .062 0 0
                        .163 .320 .516 0 0
                        0 0 0 1 0" />
            </filter>
        </defs>
    </svg>
);