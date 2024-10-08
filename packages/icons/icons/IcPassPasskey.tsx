/*
 * This file is auto-generated. Do not modify it manually!
 * Run 'yarn workspace @proton/icons build' to update the icons react components.
 */
import React from 'react';

import type { IconSize } from '../types';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    /** If specified, renders an sr-only element for screenreaders */
    alt?: string;
    /** If specified, renders an inline title element */
    title?: string;
    /**
     * The size of the icon
     * Refer to the sizing taxonomy: https://design-system.protontech.ch/?path=/docs/components-icon--basic#sizing
     */
    size?: IconSize;
}

export const IcPassPasskey = ({ alt, title, size = 4, className = '', viewBox = '0 0 16 16', ...rest }: IconProps) => {
    return (
        <>
            <svg
                viewBox={viewBox}
                className={`icon-size-${size} ${className}`}
                role="img"
                focusable="false"
                aria-hidden="true"
                {...rest}
            >
                {title ? <title>{title}</title> : null}

                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.39999 5C9.39999 6.65685 8.05685 8 6.39999 8C4.74314 8 3.39999 6.65685 3.39999 5C3.39999 3.34315 4.74314 2 6.39999 2C8.05685 2 9.39999 3.34315 9.39999 5ZM8.39999 5C8.39999 6.10457 7.50456 7 6.39999 7C5.29542 7 4.39999 6.10457 4.39999 5C4.39999 3.89543 5.29542 3 6.39999 3C7.50456 3 8.39999 3.89543 8.39999 5Z"
                ></path>
                <path d="M2.25548 10.9804C2.62526 10.3792 3.3001 10 4.04078 10H8.75921C9.10211 10 9.43089 10.0813 9.72183 10.2282C9.46142 9.86901 9.26201 9.46212 9.13945 9.02297C9.01422 9.00777 8.88727 9 8.75921 9H4.04078C2.96053 9 1.95949 9.5529 1.4037 10.4565L0.621497 11.7283C0.0065621 12.728 0.744815 14 1.94003 14H10.2584C10.2201 13.8717 10.2 13.7371 10.2 13.6V13H1.94003C1.48256 13 1.29124 12.5481 1.47328 12.2522L2.25548 10.9804Z"></path>
                <path d="M12 7.59999C12 7.15816 12.3582 6.79999 12.8 6.79999C13.2418 6.79999 13.6 7.15816 13.6 7.59999C13.6 8.04182 13.2418 8.39999 12.8 8.39999C12.3582 8.39999 12 8.04182 12 7.59999Z"></path>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 7.99995C10 6.45355 11.2536 5.19995 12.8 5.19995C14.3464 5.19995 15.6 6.45355 15.6 7.99995C15.6 9.06419 15.0063 9.98899 14.1333 10.4626V11L15.04 11.68C15.1407 11.7555 15.2 11.8741 15.2 12C15.2 12.1259 15.1407 12.2444 15.04 12.32L14.4 12.8L15.04 13.28C15.1407 13.3555 15.2 13.4741 15.2 13.6C15.2 13.7259 15.1407 13.8444 15.04 13.92L13.44 15.12C13.2978 15.2266 13.1022 15.2266 12.96 15.12L11.36 13.92C11.2593 13.8444 11.2 13.7259 11.2 13.6V10.298C10.4753 9.79253 10 8.95194 10 7.99995ZM12.8 5.99995C11.6954 5.99995 10.8 6.89538 10.8 7.99995C10.8 8.73973 11.2014 9.38622 11.8003 9.73264C11.9239 9.80413 12 9.93609 12 10.0789V13.4L13.2 14.3L14.1333 13.6L13.4933 13.12C13.3926 13.0444 13.3333 12.9259 13.3333 12.8C13.3333 12.6741 13.3926 12.5555 13.4933 12.48L14.1333 12L13.4933 11.52C13.3926 11.4444 13.3333 11.3259 13.3333 11.2V10.2117C13.3333 10.0509 13.4296 9.90581 13.5777 9.84324C14.2967 9.53946 14.8 8.82802 14.8 7.99995C14.8 6.89538 13.9046 5.99995 12.8 5.99995Z"
                ></path>
            </svg>
            {alt ? <span className="sr-only">{alt}</span> : null}
        </>
    );
};
