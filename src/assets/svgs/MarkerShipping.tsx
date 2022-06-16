import React from "react";

export const ShippingMarker = ({
  id,
  fill = "#6E6EFF",
  selected = 0,
  className,
  opacity = 1,
}: {
  id?: string;
  fill: string;
  className?: string;
  selected?: number;
  opacity?: number;
}) => (
  <svg
    id={id}
    className={className}
    width="50"
    height="51"
    viewBox="0 0 50 51"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="25"
      cy="25.5"
      r="25"
      fill={selected == 1 ? "#6E6EFF" : "transparent"}
      fill-opacity="0.4"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M28.6817 43.1232C36.857 41.424 43 34.1794 43 25.5C43 15.5589 34.9411 7.5 25 7.5C15.0589 7.5 7 15.5589 7 25.5C7 34.1794 13.143 41.424 21.3183 43.1232L25 49.5L28.6817 43.1232Z"
      fill={fill}
      fill-opacity={opacity}
    />
  </svg>
);
