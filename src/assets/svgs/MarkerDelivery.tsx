import React from "react";

export const ShippingMarker = ({
  id,
  fill = "#141E28",
  selected,
  className,
}: {
  id?: string;
  fill?: string;
  className?: string;
  selected?: boolean;
}) => (
  <svg
    id={id}
    className={className}
    width="24"
    height="32"
    viewBox="0 0 24 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_1306_5708)">
      <g filter="url(#filter0_f_1306_5708)">
        <ellipse
          cx="12"
          cy="29"
          rx="4"
          ry="2"
          fill="black"
          fill-opacity="0.12"
        />
      </g>
      <mask
        id="path-2-outside-1_1306_5708"
        maskUnits="userSpaceOnUse"
        x="1"
        y="1"
        width="22"
        height="28"
        fill="black"
      >
        <rect fill="white" x="1" y="1" width="22" height="28" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17.9159 20.0632C20.3926 18.243 22 15.3092 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.3092 3.60742 18.243 6.08406 20.0632C7.96608 21.4813 10.619 23.7185 11.2288 27.3195C11.2934 27.701 11.6131 27.997 12 27.997C12.3869 27.997 12.7066 27.701 12.7712 27.3195C13.381 23.7185 16.0339 21.4813 17.9159 20.0632Z"
        />
      </mask>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.9159 20.0632C20.3926 18.243 22 15.3092 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.3092 3.60742 18.243 6.08406 20.0632C7.96608 21.4813 10.619 23.7185 11.2288 27.3195C11.2934 27.701 11.6131 27.997 12 27.997C12.3869 27.997 12.7066 27.701 12.7712 27.3195C13.381 23.7185 16.0339 21.4813 17.9159 20.0632Z"
        fill={fill}
      />
      <path
        d="M17.9159 20.0632L17.3237 19.2573L17.3141 19.2645L17.9159 20.0632ZM6.08406 20.0632L6.6859 19.2645L6.67626 19.2574L6.08406 20.0632ZM11.2288 27.3195L10.2428 27.4865H10.2428L11.2288 27.3195ZM12.7712 27.3195L13.7572 27.4865H13.7572L12.7712 27.3195ZM18.5081 20.869C21.2301 18.8685 23 15.6409 23 12H21C21 14.9776 19.555 17.6175 17.3237 19.2574L18.5081 20.869ZM23 12C23 5.92487 18.0751 1 12 1V3C16.9706 3 21 7.02944 21 12H23ZM12 1C5.92487 1 1 5.92487 1 12H3C3 7.02944 7.02944 3 12 3V1ZM1 12C1 15.6409 2.76987 18.8685 5.49185 20.869L6.67626 19.2574C4.44496 17.6175 3 14.9776 3 12H1ZM12.2147 27.1526C11.5345 23.1359 8.58192 20.6933 6.68585 19.2645L5.48226 20.8618C7.35024 22.2694 9.70338 24.3011 10.2428 27.4865L12.2147 27.1526ZM12 26.997C12.0686 26.997 12.1251 27.0246 12.1593 27.0551C12.1912 27.0836 12.2089 27.118 12.2147 27.1526L10.2428 27.4865C10.3809 28.3017 11.0789 28.997 12 28.997V26.997ZM11.7853 27.1526C11.7911 27.118 11.8088 27.0836 11.8407 27.0551C11.8749 27.0246 11.9314 26.997 12 26.997V28.997C12.9211 28.997 13.6191 28.3017 13.7572 27.4865L11.7853 27.1526ZM17.3141 19.2645C15.4181 20.6933 12.4655 23.1359 11.7853 27.1526L13.7572 27.4865C14.2966 24.3011 16.6498 22.2694 18.5177 20.8618L17.3141 19.2645Z"
        fill="url(#paint0_linear_1306_5708)"
        mask="url(#path-2-outside-1_1306_5708)"
      />
    </g>
    {selected && (
      <circle cx="12" cy="12" r="4" fill="black" fill-opacity="0.4" />
    )}
    <defs>
      <filter
        id="filter0_f_1306_5708"
        x="6"
        y="25"
        width="12"
        height="8"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="1"
          result="effect1_foregroundBlur_1306_5708"
        />
      </filter>
      <linearGradient
        id="paint0_linear_1306_5708"
        x1="12"
        y1="2"
        x2="12"
        y2="27.9969"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0.35" />
      </linearGradient>
      <clipPath id="clip0_1306_5708">
        <rect width="24" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
