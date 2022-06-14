export type Overlaped = { index: number };
export type DaasMapProps = {
  currentPosition?: GeolocationPosition;
  units?: MapUnitType[];
  containers?: MapContainerType[];
  deliveries?: MapDeliveryType[];
  shippings?: MapShippingType[];
  isContainerVisible?: boolean;
  isUnitVisible?: boolean;
  isShippingVisible?: boolean;
  isDeliveryVisible?: boolean;
  isVisibleMarkers?: boolean;
  compassSupported?: boolean;
  isShowInfoWindow?: boolean;
  children?: JSX.Element | JSX.Element[];
  selectedDelivery?: number;
  selectedUnit?: UnitInfoProps;
  selectedSector?: SectorInfoProps;
  selectedContainer?: any[];
  metric?: MetricType;
  selectedShipping?: MapShippingType;
  onClickDelivery?: (item: number) => void;
  onClickShipping?: (item: number) => void;
  onMouseOverShipping?: (item: number) => void;
  onClickContainer?: (item: number) => void;
  onClickUnit?: (item: number) => void;
  onClickMap?: () => void;
  onClickOverlappedContainer?: (overlaped: Overlaped[]) => void;
  onClickOverlappedShipping?: (
    shippings: MapShippingType[],
    sector: MapSectorType
  ) => void;
  onMouseOverShippingCluster?: (
    shippings: MapShippingType[],
    sector: MapSectorType
  ) => void;
  getSectorInfo?: (
    sector: MapSectorType
  ) => Promise<SectorInfoProps | undefined>;
  onMouseOutShippingCluster?: (overlaped: Overlaped[]) => void;
};

export interface UnitInfoProps extends MapUnitType {
  num_assigned: number;
  num_delivery_completed: number;
  num_out_for_delivery: number;
  num_ready_for_delivery: number;
  num_ready_for_return_hub: number;
  num_ready_for_return_unit: number;
  num_total: number;
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
