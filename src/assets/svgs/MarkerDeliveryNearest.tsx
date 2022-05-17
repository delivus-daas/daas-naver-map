import React from "react";

export const DeliveryMarker = ({
  fill = "#6E6EFF",
  center = false,
  className,
}: {
  fill: string;
  center?: boolean;
  className?: string;
}) => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      opacity="0.2"
      d="M60 72C60 76.418 51.0454 80 40 80C28.9546 80 20 76.418 20 72C20 67.582 28.9546 64 40 64C51.0454 64 60 67.582 60 72Z"
      fill={fill}
      fill-opacity="0.25"
    />
    <g filter="url(#filter0_d_560_11555)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M44.9089 57.4975C55.8093 55.232 64 45.5725 64 34C64 20.7452 53.2548 10 40 10C26.7452 10 16 20.7452 16 34C16 45.5725 24.1907 55.232 35.0911 57.4975L40 66L44.9089 57.4975Z"
        fill={fill}
      />
    </g>
    <circle cx="40" cy="34" r="10" fill={center ? "white" : "transparent"} />
    <defs>
      <filter
        id="filter0_d_560_11555"
        x="12"
        y="6"
        width="56"
        height="64"
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
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.431373 0 0 0 0 0.431373 0 0 0 0 1 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_560_11555"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_560_11555"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
