export type Overlaped = { index: number };
export type DaasMapProps = {
  currentPosition?: GeolocationPosition;
  isContainerVisible?: boolean;
  isUnitVisible?: boolean;
  isShippingVisible?: boolean;
  isDeliveryVisible?: boolean;
  isVisibleMarkers?: boolean;
  compassSupported?: boolean;
  isShowInfoWindow?: boolean;
  selectedDelivery?: number;
  children?: JSX.Element | JSX.Element[];
  onClickDelivery?: (item: number) => void;
  onClickShipping?: (item: number) => void;
  onMouseOverShipping?: (item: number) => void;
  onMouseOverUnit?: (item: number) => void;
  onMouseOutUnit?: (item: number) => void;
  onClickContainer?: (item: number) => void;
  onClickUnit?: (item: number, unit?: MapUnitType) => void;
  onClickMap?: () => void;
  onClickContainerCluster?: (containers: MapContainerType[]) => void;
  onClickOverlappedShipping?: (
    shippings: MapShippingType[],
    sector: MapSectorType,
    metric: MetricType
  ) => void;
  onMouseOverShippingCluster?: (
    shippings: MapShippingType[],
    sector: MapSectorType
  ) => void;
  getSectorInfo?: (
    sector: MapSectorType,
    metric: MetricType
  ) => Promise<SectorInfoProps | undefined>;
  getUnitInfo?: (unit: MapUnitType) => Promise<UnitInfoProps | undefined>;
  onMouseOutShippingCluster?: (overlaped: Overlaped[]) => void;
};

export interface UnitInfoProps extends MapUnitType {
  num_total: number;
  num_unitarrived: number;
  num_claimed: number;
  num_out_for_delivery: number;
  num_out_return_unit_available: number;
  num_out_delivery_completed: number;
  num_unit_returned: 0;
  index?: number;
}

export interface ShippingsInfoProps {
  shippings: MapShippingType[];
}
export interface SectorInfoProps extends MapSectorType {
  count_total?: number;
  count_shipping?: number;
  count_return?: number;
  metric?: MetricType;
  name?: string;
}

export type MapContainerType = {
  unit_location?: {
    lat: string;
    lng: string;
    name: string;
    address1: string;
    address2: string;
  };
  timestamp_claimed: string;
  count_deliveries: number;
  count_remaining: number;
  count_return: number;
  count_return_collected: number;
  count_shipping: number;
  count_shipping_incomplete: number;
  count_total_items: number;
  uuid: string;
  status: "CLAIMED" | "FINISHED" | "DELIVERYCOMPLETED";
  container_class: "WHITE" | "BLUE" | "BLACK";
};

export type MapUnitType = {
  id: string;
  name: string;
  address: {
    name: string;
    address_road: string;
    address_jibun: string;
    lat: string;
    lng: string;
    zipcode: string;
    mobile_tel: string;
    sector: {
      area: string;
      code: string;
      id: string;
      name: string;
    };
  };
  sector_codes: string;
};

export type MapDeliveryType = {
  address?: {
    lat: string;
    lng: string;
  };
  uuid: string;
  complete: boolean;
  shipping_count: number;
  return_count: number;
};

export type MetricType = "area" | "sector" | "shipping";

export type MapSectorType = {
  area: string;
  code: string;
};
export type MapShippingType = {
  address?: {
    lat: string;
    lng: string;
    address1: string;
    sector?: MapSectorType;
  };
  uuid: string;
  tracking_number: string;
  complete: boolean;
  is_return: boolean;
  designated_sector?: {
    area: string;
    code: string;
  };
  shipping_container?: {
    uuid: string;
  };
};
