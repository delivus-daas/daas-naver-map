import React from "react";

export const DeliveryMarker = ({
  fill = "#6E6EFF",
  style,
}: {
  fill: string;
  style?: any;
}) => (
  <svg
    style={style}
    width="48"
    height="56"
    viewBox="0 0 48 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M28.9089 47.4976C39.8094 45.232 48.0001 35.5725 48.0001 24C48.0001 10.7452 37.255 0 24.0001 0C10.7453 0 0.00012207 10.7452 0.00012207 24C0.00012207 35.5724 8.19067 45.2318 19.091 47.4975L24 56.0001L28.9089 47.4976Z"
      fill={fill}
    />
  </svg>
);
