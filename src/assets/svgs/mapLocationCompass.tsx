import React from "react";

const MyLocation = ({ className }: { className: string }) => (
  <svg
    className={className}
    width="84"
    height="84"
    viewBox="0 0 84 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_72_5192)">
      <path
        d="M42 48L24 -3.14722e-06L60 0L42 48Z"
        fill="url(#paint0_linear_72_5192)"
      />
      <g filter="url(#filter0_d_72_5192)">
        <circle cx="42" cy="42" r="8" fill="#FF7864" />
        <circle cx="42" cy="42" r="9.5" stroke="white" stroke-width="3" />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_72_5192"
        x="19"
        y="27"
        width="46"
        height="46"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="6" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.960784 0 0 0 0 0.490196 0 0 0 0 0.12549 0 0 0 0.12 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_72_5192"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_72_5192"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_72_5192"
        x1="42"
        y1="48"
        x2="42"
        y2="-1.57361e-06"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.125" stop-color="#FF7864" />
        <stop offset="1" stop-color="#FF7864" stop-opacity="0" />
      </linearGradient>
      <clipPath id="clip0_72_5192">
        <rect width="84" height="84" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default MyLocation;
