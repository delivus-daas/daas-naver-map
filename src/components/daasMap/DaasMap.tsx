import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import $ from "jquery";
import { renderToStaticMarkup } from "react-dom/server";
import blackClaimed from "../../assets/svgs/blackClaimed";
import whiteClaimed from "../../assets/svgs/whiteClaimed";
import whiteCompleted from "../../assets/svgs/whiteCompleted";
import blackCompleted from "../../assets/svgs/blackCompleted";
import blackDropoff from "../../assets/svgs/blackDropoff";
import WhiteDropoff from "../../assets/svgs/whiteDropoff";
import EyesSvg from "../../assets/svgs/eyes";
import MapLocationCompass from "../../assets/svgs/mapLocationCompass";
import MarkerClustering from "../../marker-tools";
import "./daasMap.css";
import { DeliveryMarker } from "../../assets/svgs/MarkerDeliveryNearest";
import {
  DaasMapProps,
  MapContainerType,
  MapUnitType,
  MapDeliveryType,
  MapShippingType,
  UnitInfoProps,
  SectorInfoProps,
  Overlaped,
  MetricType,
} from "./daasMap.type";
import UnitInfo from "./UnitInfo";
import SectorInfo from "./SectorInfo";
import ShippingsInfo from "./ShippingsInfo";
declare global {
  interface Window {
    naver: any;
    mouseOut: boolean;
  }
}
const DaasMap = forwardRef(
  (
    {
      currentPosition,
      compassSupported,
      containers,
      children,
      selectedDelivery,
      selectedContainer,
      onClickMap,
      isVisibleMarkers,
      isContainerVisible,
      isUnitVisible,
      isDeliveryVisible,
      isShippingVisible,
      onClickOverlappedContainer,
      onClickOverlappedShipping,
      onMouseOverShippingCluster,
      getSectorInfo,
      getUnitInfo,
      onMouseOutShippingCluster,
      onClickDelivery,
      onClickShipping,
      onMouseOverShipping,
      onMouseOverUnit,
      onMouseOutUnit,
      onClickContainer,
      onClickUnit,
      deliveries,
      isShowInfoWindow,
    }: DaasMapProps,
    ref
  ) => {
    const mapRef = useRef<any>();
    const deliveryMarkers = useRef(new Array());
    const shippingMarkers = useRef(new Array());
    const deliveryPreviewMarkers = useRef(new Array());
    const containerMarkers = useRef(new Array());
    const unitMarkers = useRef(new Array());
    const unitInfo = useRef<any>();
    const shippingsRef = useRef<MapShippingType[]>();
    const unitsRef = useRef<MapUnitType[]>();
    const shippingGroupRef = useRef<MetricType>("area");
    const deliveryClustering = useRef<any>();
    const shippingClustering = useRef<any>();
    const containerClustering = useRef<any>();
    const mypositionMarker = useRef<any>();

    const getSelectedUnit = (index: number) => {
      const units = unitsRef.current;
      return units?.length && units?.length > index ? units[index] : undefined;
    };

    const getSelectedShippings = (clusters: Overlaped[]) => {
      const selectedShippings: MapShippingType[] = [];
      const shippings = shippingsRef.current;
      clusters &&
        clusters.forEach((m) => {
          if (shippings && m.index >= 0 && shippings.length > m.index) {
            selectedShippings.push(shippings[m.index]);
          }
        });
      return selectedShippings;
    };

    const getSelectedSector = (shippings: MapShippingType[]) => {
      let selectedSector: any = undefined;
      shippings.every((s) => {
        if (!!s && (!!s.designated_sector || !!s.address?.sector)) {
          selectedSector = s.designated_sector || s.address?.sector;
          return false;
        }
        return true;
      });
      return selectedSector;
    };

    const changeCurrentPosition = useCallback(
      (currentPosition?: GeolocationPosition) => {
        if (!!mypositionMarker.current) {
          const position = new window.naver.maps.LatLng(
            currentPosition?.coords?.latitude,
            currentPosition?.coords?.longitude
          );
          mypositionMarker.current.setPosition(position);
        }
      },
      []
    );

    const getMyPositionIcon = () => {
      if (compassSupported) {
        const icon = (
          <div className="compass-circle">
            <MapLocationCompass className={"compass-circle-img"} />
          </div>
        );

        return {
          content: [renderToStaticMarkup(icon)].join(""),
          size: new window.naver.maps.Size(50, 50),
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(25, 25), //마커의 원점을 가르킴
        };
      }
      const icon = <div className="loc-circle-img" />;

      return {
        content: [renderToStaticMarkup(icon)].join(""),
        size: new window.naver.maps.Size(16, 16),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(8, 8), //마커의 원점을 가르킴
      };
    };

    const drawMarkerMyPosition = useCallback((currentPosition: any) => {
      if (
        !!currentPosition?.coords?.latitude &&
        !!currentPosition?.coords?.longitude &&
        !!window.naver.maps
      ) {
        const map: any = mapRef.current;
        const position = new window.naver.maps.LatLng(
          currentPosition?.coords?.latitude,
          currentPosition?.coords?.longitude
        );
        if (!!mypositionMarker.current) {
          mypositionMarker.current.setMap(null);
        }
        map.setCenter(position);
        mypositionMarker.current = new window.naver.maps.Marker({
          position: position,
          map,
          icon: getMyPositionIcon(),
        });
      }
    }, []);

    /** Lifecycle event handlers **/
    useImperativeHandle(
      ref,
      () => ({
        drawShippingMarkers: drawMarkersShippings,
        drawUnitMarkers: drawMarkersUnits,
        zoomIn: () => {
          const map = mapRef.current;
          const zoom = map.getOptions("zoom");
          if (zoom < 21) {
            map.setOptions({
              zoom: zoom + 1,
            });
          }
        },
        zoomOut: () => {
          const map = mapRef.current;
          const zoom = map.getOptions("zoom");
          if (zoom > 6) {
            map.setOptions({
              zoom: zoom - 1,
            });
          }
        },
        setCenter: (lat: any, lng: any) => {
          if (!!window.naver.maps && !!lat && !!lng) {
            const position = new window.naver.maps.LatLng(lat, lng);
            !!mapRef.current && mapRef.current.setCenter(position);
          }
        },
        navigateToMyLocation: () => {
          if (!!mypositionMarker.current && !!mapRef.current) {
            mapRef.current.setCenter(mypositionMarker.current.getPosition());
          }
        },
        drawPreviewMarkers: (deliveries: any[]) => {
          removeMarkers(deliveryPreviewMarkers.current);
          if (
            isVisibleMarkers &&
            isDeliveryVisible &&
            deliveries &&
            deliveries?.length > 0 &&
            !!window.naver.maps
          ) {
            let recommendIdx = -1;
            deliveries.map((d, index) => {
              if (!d.complete && recommendIdx === -1) {
                recommendIdx = index;
              }
              drawMarkerDeliveryPreview(d, index, recommendIdx);
            });
          }
        },
      }),
      [currentPosition, isVisibleMarkers, isDeliveryVisible, deliveries]
    );

    useEffect(() => {
      if (!!window.naver.maps) {
        let mapOptions = {
          zoom: 13,
          // center: cityHall,
        };
        mapRef.current = new window.naver.maps.Map("map", mapOptions);
        mapRef.current.setCursor("pointer");
        createClusterContainer(containerMarkers.current);
        createClusterDelivery(deliveryMarkers.current);
        createClusterShipping(shippingMarkers.current);

        window.naver.maps.Event.addListener(
          mapRef.current,
          "click",
          onClickMap
        );

        window.naver.maps.Event.addListener(
          mapRef.current,
          "bounds_changed",
          handleMapBoundsChanged
        );
      }
    }, []);

    useEffect(() => {
      if (!mypositionMarker.current) {
        //if my my position marker isn't initialized then create one.
        drawMarkerMyPosition(currentPosition);
      } else {
        //if my my position marker is initialized then change its position.
        changeCurrentPosition(currentPosition);
      }
    }, [currentPosition]);

    useEffect(() => {
      if (!!mypositionMarker.current) {
        //change my position marker icon according to compass supported by device orientation
        mypositionMarker.current.setIcon(getMyPositionIcon());
      } else {
        drawMarkerMyPosition(currentPosition);
      }
    }, [compassSupported]);

    useEffect(() => {
      //update delivery marker style when selected marker change
      const map: any = mapRef.current;
      deliveryMarkers.current &&
        deliveryMarkers.current.forEach((d, i) => {
          if (selectedDelivery == i) {
            map.setCenter(d.position);
          }
          const selectedMarker = $("#d-marker" + i);
          selectedMarker.toggleClass("selected", i === selectedDelivery);
        });
    }, [selectedDelivery]);

    useEffect(() => {
      drawMarkersContainers(
        containers,
        selectedContainer,
        isVisibleMarkers,
        isContainerVisible
      );
    }, [containers, isContainerVisible, isVisibleMarkers, selectedContainer]);

    useEffect(() => {
      drawMarkersDeliveries(deliveries, isVisibleMarkers, isDeliveryVisible);
    }, [deliveries, isVisibleMarkers, isDeliveryVisible]);

    /**Draw markers**/
    const drawMarkersUnits = (units?: MapUnitType[]) => {
      if (!!units) unitsRef.current = units;

      removeMarkers(unitMarkers.current, unitInfo.current);
      if (isUnitVisible && isVisibleMarkers && !!mapRef.current) {
        if (units && units?.length > 0) {
          units.map((unit, index) => {
            drawMarkerUnit(unit, index);
          });
        }
      }
    };

    const drawMarkersContainers = (
      containers?: MapContainerType[],
      selectedContainer?: MapContainerType[],
      isVisibleMarkers?: boolean,
      isContainerVisible?: boolean
    ) => {
      removeMarkers(containerMarkers.current);
      if (isContainerVisible && isVisibleMarkers && !!mapRef.current) {
        //배송 목록 있을 떼 업무 목록 표시안
        if (containers && containers?.length > 0) {
          containers.map((container, index) => {
            drawMarkerContainer(container, index, selectedContainer);
          });
        }
      }
      redrawCluster(containerClustering.current, containerMarkers.current);
    };

    const drawMarkersDeliveries = (
      deliveries?: MapDeliveryType[],
      isVisibleMarkers?: boolean,
      isDeliveryVisible?: boolean
    ) => {
      removeMarkers(deliveryMarkers.current);
      if (
        isVisibleMarkers &&
        isDeliveryVisible &&
        deliveries &&
        deliveries?.length > 0 &&
        !!window.naver.maps
      ) {
        let recommendIdx = -1;
        deliveries.map((d, index) => {
          if (!d.complete && recommendIdx === -1) {
            recommendIdx = index;
          }
          drawMarkerDelivery(d, index, recommendIdx);
        });
      }
      redrawCluster(deliveryClustering.current, deliveryMarkers.current);
    };

    const drawMarkersShippings = (
      metric?: MetricType,
      shippings?: MapShippingType[],
      selectedSector?: SectorInfoProps
    ) => {
      if (!!shippings) shippingsRef.current = shippings;
      if (!!metric) shippingGroupRef.current = metric;

      removeMarkers(shippingMarkers.current);
      if (
        isVisibleMarkers &&
        isShippingVisible &&
        shippingsRef.current &&
        shippingsRef.current?.length > 0 &&
        !!window.naver.maps
      ) {
        shippingsRef.current.map((d, index) => {
          drawMarkerShipping(d, index, selectedSector);
        });
      }
      redrawCluster(shippingClustering.current, shippingMarkers.current);
    };
    /** Draw marker **/

    const drawMarkerUnit = (unit: MapUnitType, index: number) => {
      const map: any = mapRef.current;
      if (!!unit?.address?.lat && !!unit?.address?.lng) {
        const position = new window.naver.maps.LatLng(
          unit?.address?.lat,
          unit?.address?.lng
        );

        let size = 32,
          Svg = blackClaimed,
          className = "";

        const icon = (
          <div>
            <Svg
              id={"u-marker" + index}
              className={"order-marker-img " + className}
            />
          </div>
        );
        var markerOptions = {
          index,
          position,
          map: isPositionInBounds(position, map) ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size / 2),
          },
        };
        const marker = new window.naver.maps.Marker(markerOptions);
        unitMarkers.current.push(marker);

        window.naver.maps.Event.addListener(
            marker,
          "click",
          handleClickUnitMarker(index)
        );

        window.naver.maps.Event.addListener(
            marker,
          "mouseover",
          handleMouseOverUnitMarker(index, marker)
        );

        window.naver.maps.Event.addListener(
            marker,
          "mouseout",
          handleMouseOutUnitMarker(index)
        );
      }
    };

    const drawMarkerContainer = (
      container: MapContainerType,
      index: number,
      selectedContainer?: MapContainerType[]
    ) => {
      if (
        !!mapRef.current &&
        !!window.naver.maps &&
        !!container?.unit_location?.lat &&
        !!container?.unit_location?.lng
      ) {
        const map = mapRef.current;
        const position = new window.naver.maps.LatLng(
          container.unit_location.lat,
          container.unit_location.lng
        );
        let size = 32,
          Svg,
          className = "";

        const selected =
          selectedContainer &&
          selectedContainer.filter((c) => c.uuid === container.uuid).length > 0;
        if (selected) {
          size = 64;
          className = "selected";
        }
        switch (container.status) {
          case "CLAIMED":
            Svg =
              container.container_class === "WHITE"
                ? whiteClaimed
                : blackClaimed;
            break;
          case "DELIVERYCOMPLETED":
          case "FINISHED":
            Svg =
              container.container_class === "WHITE"
                ? whiteCompleted
                : blackCompleted;
            break;
          default:
            Svg =
              container.container_class === "WHITE"
                ? WhiteDropoff
                : blackDropoff;
        }

        const icon = <Svg className={"order-marker-img " + className} />;

        var markerOptions = {
          index,
          selected,
          claimed: container.status === "CLAIMED",
          assigned: container.container_class !== "WHITE",
          position,
          map: isPositionInBounds(position, map) ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size / 2),
          },
        };
        const orderMarker = new window.naver.maps.Marker(markerOptions);
        containerMarkers.current.push(orderMarker);
        if (
          selectedContainer &&
          selectedContainer.length <= 0 &&
          selectedDelivery &&
          selectedDelivery < 0 &&
          index == 0
        ) {
          map.setCenter(position);
        }

        window.naver.maps.Event.addListener(
          orderMarker,
          "click",
          handleClickContainerMarker(index)
        );
      }
    };

    const drawMarkerDelivery = (
      delivery: MapDeliveryType,
      index: number,
      recommendIdx: number,
      selectedDelivery?: number
    ) => {
      if (!!delivery?.address?.lat && !!delivery?.address?.lng) {
        const position = new window.naver.maps.LatLng(
          delivery.address.lat,
          delivery.address.lng
        );
        const map: any = mapRef.current;
        let bg = "var(--primary)";
        let size = 52;
        let className = "";
        if (index === selectedDelivery) {
          className = "selected";
          size = 100;
        }
        if (delivery.complete) {
          bg = "var(--grey96)";
        } else {
          if (delivery.return_count > 0) {
            if (delivery.shipping_count <= 0) {
              //only return
              bg = "var(--errorActive)";
            } else {
              //mixed
              bg = "var(--yellow)";
            }
          }
        }
        const icon = (
          <div
            id={"d-marker" + index}
            className={"delivery-marker body1 bold white " + className}
          >
            <DeliveryMarker
              className={"delivery-marker-img"}
              center={index === recommendIdx}
              fill={bg}
            />
            {index != recommendIdx &&
              (delivery.shipping_count > 0 ? (
                <>
                  <div className={"map-delivery-count bold white"}>
                    {delivery.shipping_count}
                  </div>
                  {delivery.return_count > 0 && (
                    <span className={"map-delivery-return-count bold white"}>
                      {delivery.return_count}
                    </span>
                  )}
                </>
              ) : (
                delivery.return_count > 0 && (
                  <div className={"map-delivery-count bold white"}>
                    {"R" + delivery.return_count}
                  </div>
                )
              ))}
          </div>
        );
        var markerOptions = {
          position,
          map: isPositionInBounds(position, map) ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size / 2),
          },
        };
        const marker = new window.naver.maps.Marker(markerOptions);
        deliveryMarkers.current.push(marker);

        if (selectedDelivery === index) {
          map.setCenter(position, map);
        }

        window.naver.maps.Event.addListener(
          marker,
          "click",
          handleClickDeliveryMarker(index)
        );
      }
    };

    const drawMarkerDeliveryPreview = (
      delivery: any,
      index: number,
      recommendIdx: number
    ) => {
      const map: any = mapRef.current;
      if (!!delivery?.address?.lat && !!delivery?.address?.lng) {
        const position = new window.naver.maps.LatLng(
          delivery.address.lat,
          delivery.address.lng
        );
        let size = 52;
        let className = "";
        if (index === recommendIdx) {
          className = "selected";
          size = 100;
        }
        const icon = (
          <div
            id={"d-marker" + index}
            className={"delivery-marker " + className}
          >
            <DeliveryMarker
              className={"delivery-marker-img"}
              center={index === recommendIdx}
              fill={"var(--dark)"}
            />
            {index != recommendIdx && <EyesSvg className={"eye-img"} />}
          </div>
        );
        var markerOptions = {
          position,
          map: isPositionInBounds(position, map) ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size),
          },
        };
        if (0 === index) {
          map.setCenter(position);
        }
        const marker = new window.naver.maps.Marker(markerOptions);
        deliveryPreviewMarkers.current.push(marker);
      }
    };

    const drawMarkerShipping = (
      delivery: MapShippingType,
      index: number,
      selectedSector?: SectorInfoProps
    ) => {
      if (!!delivery?.address?.lat && !!delivery?.address?.lng) {
        const position = new window.naver.maps.LatLng(
          delivery.address.lat,
          delivery.address.lng
        );
        const map: any = mapRef.current;
        let bg = "var(--greyc4)",
          size = 52,
          className = "",
          selected = checkShippingIsSelected(delivery, selectedSector);

        if (selected) {
          className = "selected";
        }
        if (delivery.complete) {
          bg = "var(--grey96)";
        } else if (delivery.is_return) {
          //only return
          bg = "var(--errorActive)";
        }
        const icon = (
          <div
            id={"d-marker" + index}
            className={"shipping-marker " + className}
          >
            <DeliveryMarker className={"delivery-marker-img"} fill={bg} />
            {!delivery.is_return ? (
              <>
                <div className={"map-delivery-count body1 bold white"}>{1}</div>
              </>
            ) : (
              <div className={"map-delivery-count body1 bold white"}>
                {"R1"}
              </div>
            )}
          </div>
        );
        var markerOptions = {
          index,
          selected,
          position,
          map: isPositionInBounds(position, map) ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size / 2),
          },
        };
        const marker = new window.naver.maps.Marker(markerOptions);
        shippingMarkers.current.push(marker);

        window.naver.maps.Event.addListener(
          marker,
          "click",
          handleClickShippingMarker(index)
        );
        window.naver.maps.Event.addListener(
          marker,
          "mouseenter mouseleave",
          handleMouseOverShippingMarker(index)
        );
      }
    };

    /** Draw tooltip **/
    const drawTooltipUnit = (marker: any, map: any, unit: UnitInfoProps) => {
      unitInfo.current = new window.naver.maps.InfoWindow({
        borderWidth: 0,
        anchorColor: "#151619",
        pixelOffset: 10,
        maxWidth: 250,
        zIndex: 100001,
        anchorSize: { width: 24, height: 10 },
        content: [renderToStaticMarkup(<UnitInfo {...unit} />)].join(""),
      });
      unitInfo.current.open(map, marker);
    };

    const drawTooltipSector = (
      marker: any,
      map: any,
      sector: SectorInfoProps
    ) => {
      unitInfo.current = new window.naver.maps.InfoWindow({
        borderWidth: 0,
        anchorColor: "#151619",
        pixelOffset: 10,
        maxWidth: 250,
        zIndex: 100001,
        anchorSize: { width: 24, height: 10 },
        content: [
          renderToStaticMarkup(
            <SectorInfo metric={shippingGroupRef.current} {...sector} />
          ),
        ].join(""),
      });
      unitInfo.current.open(map, marker);
    };

    const drawTooltipShippings = (
      marker: any,
      map: any,
      selectedShippings: MapShippingType[]
    ) => {
      unitInfo.current = new window.naver.maps.InfoWindow({
        borderWidth: 0,
        anchorColor: "#151619",
        pixelOffset: 10,
        maxWidth: 250,
        zIndex: 100001,
        anchorSize: { width: 24, height: 10 },
        content: [
          renderToStaticMarkup(<ShippingsInfo shippings={selectedShippings} />),
        ].join(""),
      });
      unitInfo.current.open(map, marker);
    };

    /** Registration of cluster **/

    const createClusterContainer = (markers: any[]) => {
      const icon = (
        <div id={"cluster-id"} className={"map-order-cluster"}>
          <WhiteDropoff className={"order-marker-img"} />
          <span className={"map-order-cluster-count small bold"} />
        </div>
      );
      var htmlMarker1 = {
        content: [renderToStaticMarkup(icon)].join(""),
        size: new window.naver.maps.Size(40, 40),
        anchor: new window.naver.maps.Point(20, 20),
      };
      containerClustering.current = new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 30,
        map: mapRef.current,
        markers: markers,
        disableClickZoom: false,
        gridSize: 120,
        icons: [htmlMarker1],
        indexGenerator: [100],
        onClusterClick: onClickOverlappedContainer,
        stylingFunction: styleClusterContainer,
      });
    };

    const createClusterDelivery = (markers: any[]) => {
      const icon = (count: number) => (
        <div
          className={
            "map-cluster-cntr" +
            count +
            " column align-center justify-center white"
          }
        >
          <span className={"map-cluster-text"} />
        </div>
      );
      var htmlMarker5 = {
        content: [renderToStaticMarkup(icon(5))].join(""),
        size: new window.naver.maps.Size(60, 60),
        anchor: new window.naver.maps.Point(30, 30),
      };
      var htmlMarker10 = {
        content: [renderToStaticMarkup(icon(10))].join(""),
        size: new window.naver.maps.Size(72, 72),
        anchor: new window.naver.maps.Point(36, 36),
      };
      var htmlMarker30 = {
        content: [renderToStaticMarkup(icon(30))].join(""),
        size: new window.naver.maps.Size(80, 80),
        anchor: new window.naver.maps.Point(40, 40),
      };
      var htmlMarker40 = {
        content: [renderToStaticMarkup(icon(40))].join(""),
        size: new window.naver.maps.Size(100, 100),
        anchor: new window.naver.maps.Point(50, 50),
      };
      deliveryClustering.current = new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 10,
        map: mapRef.current,
        markers: markers,
        disableClickZoom: false,
        gridSize: 120,
        icons: [htmlMarker5, htmlMarker10, htmlMarker30, htmlMarker40],
        indexGenerator: [6, 11, 30, 40, 50],
        stylingFunction: styleClusterContainer,
      });
    };

    const checkShippingIsSelected = (
      shipping: MapShippingType,
      selectedSector?: SectorInfoProps
    ) => {
      let selected = false;
      if (shipping) {
        const sector = shipping.designated_sector || shipping.address?.sector;
        switch (shippingGroupRef.current) {
          case "area":
            selected = sector?.area == selectedSector?.area;
            break;
          case "sector":
            selected = sector?.code == selectedSector?.code;
            break;
        }
      }
      return selected;
    };

    const createClusterShipping = (markers: any[]) => {
      let shipping_count = 0,
        return_count = 0,
        complete = false;
      markers.forEach((m, index) => {
        if (m.complete) {
          complete = m.complete;
        }
        if (m.is_return) {
          return_count++;
        } else {
          shipping_count++;
        }
      });

      let bg = "var(--greyc4)";
      let size = 52;
      let className = "";
      // if (index === selectedDelivery) {
      //   className = "selected";
      //   size = 100;
      // }
      if (complete) {
        bg = "var(--grey96)";
      } else {
        if (return_count > 0) {
          if (shipping_count <= 0) {
            //only return
            bg = "var(--errorActive)";
          } else {
            //mixed
            bg = "var(--yellow)";
          }
        }
      }
      const icon = (
        <div
          id={"shipping-cluster-id"}
          className={"shipping-marker " + className}
        >
          <DeliveryMarker className={"delivery-marker-img"} fill={bg} />
          {shipping_count > 0 ? (
            <>
              <span className={"map-delivery-count body1 bold white"}>
                {shipping_count + "FFF"}
              </span>
              {return_count > 0 && (
                <span className={"map-delivery-return-count body1 bold white"}>
                  {return_count}
                </span>
              )}
            </>
          ) : (
            <span className={"map-delivery-count body1 bold white"}>
              {"R" + return_count}
            </span>
          )}
        </div>
      );

      var htmlMarker5 = {
        content: [renderToStaticMarkup(icon)].join(""),
        size: new window.naver.maps.Size(60, 60),
        anchor: new window.naver.maps.Point(30, 30),
      };

      shippingClustering.current = new MarkerClustering({
        minClusterSize: 1,
        maxZoom: 30,
        map: mapRef.current,
        markers: markers,
        disableClickZoom: false,
        gridSize: 5,
        icons: [htmlMarker5],
        indexGenerator: [20],
        stylingFunction: styleClusterShipping,
        onClusterClick: handleClickShippingCluster,
        onClusterMouseOver: handleMouseOverShippingCluster,
        onClusterMouseOut: handleMouseOutShippingCluster,
      });
    };

    /**
     * cluster 마커를 redraw한다.
     * @param markers
     */
    const redrawCluster = (clustering: any, markers: any[]) => {
      if (!!clustering) {
        clustering.setMarkers(markers);
      }
    };

    /**Styling cluster markers **/
    const styleClusterContainer = (
      clusterMarker: any,
      count: number,
      clusterMembers: any[]
    ) => {
      $(clusterMarker.getElement()).find("span:last-child").text(count);
      const image = $(clusterMarker.getElement()).find($("WhiteDropoff"));
      const container = $(clusterMarker.getElement()).find("#cluster-id");

      const { claimed, selected, assigned } = calculateContainerCount(
        clusterMembers
      );
      container.toggleClass("selected", selected);
      if (image) {
        if (claimed) {
          if (assigned) {
            image.replaceWith($("blackClaimed"));
          } else {
            image.replaceWith($("whiteClaimed"));
          }
        } else {
          if (assigned) {
            image.replaceWith($("blackDropoff"));
          } else {
            image.replaceWith($("whiteDropoff"));
          }
        }
      }
    };

    const styleClusterShipping = (
      clusterMarker: any,
      count: number,
      clusterMembers: any[]
    ) => {
      const { shipping_count, selected, return_count } = calculateShippingCount(
        clusterMembers
      );

      const image = $(clusterMarker.getElement()).find(".delivery-marker-img");
      const container = $(clusterMarker.getElement()).find(
        "#shipping-cluster-id"
      );
      if (return_count > 0) {
        if (shipping_count > 0) {
          image.attr("fill", "var(--yellow)");
          $(clusterMarker.getElement())
            .find("span.map-delivery-count")
            .text(shipping_count);
          $(clusterMarker.getElement())
            .find("span.map-delivery-return-count")
            .text(return_count);
        } else {
          image.attr("fill", "var(--errorActive)");
          $(clusterMarker.getElement())
            .find("span.map-delivery-count")
            .text(return_count);
        }
      } else {
        $(clusterMarker.getElement())
          .find("span.map-delivery-count")
          .text(shipping_count);
      }
      container.toggleClass("selected", selected);
    };

    /** update style of marker if its selected or not **/
    const updateUnitMarkers = (selectedUnitIndex?: number) => {
      unitMarkers.current &&
        unitMarkers.current.forEach((d, i) => {
          const markerSvg = $("#u-marker" + i);
          const selected = selectedUnitIndex == i;
          d.setOptions({ selected, size: selected ? 64 : 32 });
          markerSvg.toggleClass("selected", selected);
        });
    };

    const updateShippingMarkers = (
      selectedSector?: SectorInfoProps,
      selectedShippings?: MapShippingType[],
      clusterMembers?: any[]
    ) => {
      const shippings = shippingsRef.current;
      //update delivery marker style when selected marker change
      shippingMarkers.current &&
        shippingMarkers.current.forEach((d, i) => {
          const markerCntr = $("#d-marker" + i);
          const selected =
            shippings &&
            shippings.length > i &&
            checkShippingIsSelected(shippings[i], selectedSector);
          d.setOptions({ selected });
          markerCntr.toggleClass("selected", selected);
        });

      clusterMembers &&
        clusterMembers.forEach((marker) => {
          marker.setOptions({ selected: true });
        });
    };

    /** Calculation counts used in clusters **/
    function calculateContainerCount(_clusterMember: any[]) {
      var members = _clusterMember;
      let claimed = false,
        selected = false,
        assigned = false;
      for (var i = 0, ii = members.length; i < ii; i++) {
        if (members[i].claimed) {
          claimed = true;
        }
        if (members[i].selected) {
          selected = true;
        }
        if (members[i].assigned) {
          assigned = true;
        }
      }
      return { claimed, selected, assigned };
    }

    function calculateShippingCount(_clusterMember: any[]) {
      var members = _clusterMember;
      let return_count = 0,
        shipping_count = 0,
        selected = false;
      for (var i = 0, ii = members.length; i < ii; i++) {
        if (members[i].is_return) {
          return_count++;
        } else {
          shipping_count++;
        }
        if (members[i].selected) {
          selected = true;
        }
      }
      return { return_count, selected, shipping_count };
    }

    const isPositionInBounds = (position: any, map: any) => {
      var bounds = map.getBounds();
      //marker position is not inside map bounds
      return bounds.hasLatLng(position);
    };

    const closeWindowTooltip = () => {
      if (!!unitInfo.current) {
        unitInfo.current.setMap(null);
        unitInfo.current.close();
      }
    };

    const showMarkersInBounds = (markers: any[], map: any) => {
      if (markers && markers.length > 0) {
        markers.forEach((m) => {
          const position = m.getPosition();
          if (isPositionInBounds(position, map)) {
            m.setMap(map);
          } else {
            m.setMap(null);
          }
        });
      }
    };

    /**Event Handlers**/

    function handleMapBoundsChanged(e: any) {
      const map: any = mapRef.current;
      showMarkersInBounds(unitMarkers.current, map);
      showMarkersInBounds(containerMarkers.current, map);
      showMarkersInBounds(deliveryMarkers.current, map);
      showMarkersInBounds(shippingMarkers.current, map);
    }

    function handleClickDeliveryMarker(delivery: number) {
      return function (e: any) {
        !!onClickDelivery && onClickDelivery(delivery);
      };
    }

    function handleClickShippingMarker(delivery: number) {
      return function (e: any) {
        !!onClickShipping && onClickShipping(delivery);
      };
    }

    function handleMouseOverShippingMarker(delivery: number) {
      return function (e: any) {
        !!onMouseOverShipping && onMouseOverShipping(delivery);
      };
    }

    function handleClickContainerMarker(index: number) {
      return function (e: any) {
        !!onClickContainer && onClickContainer(index);
      };
    }

    const handleMouseOutShippingCluster = useCallback(
      (clusterMembers: Overlaped[]) => {
        updateShippingMarkers();
        closeWindowTooltip();
        redrawCluster(shippingClustering.current, shippingMarkers.current);
        onMouseOutShippingCluster && onMouseOutShippingCluster(clusterMembers);
      },
      [onMouseOutShippingCluster]
    );

    const handleClickShippingCluster = useCallback(
      async (clusterMembers: Overlaped[]) => {
        const selectedShippingList = getSelectedShippings(clusterMembers);
        const selectedSector = getSelectedSector(selectedShippingList);
        console.log("map handleClickShippingCluster", shippingGroupRef.current);
        if (onClickOverlappedShipping)
          onClickOverlappedShipping(
            selectedShippingList,
            selectedSector,
            shippingGroupRef.current
          );
      },
      []
    );

    const handleClickUnitMarker = (index: number) => {
      return function (e: any) {
        console.log("daasmap handleClickUnitMarker");
        const selectedUnit = getSelectedUnit(index);
        !!onClickUnit && onClickUnit(index, selectedUnit);
      }
    };

    const handleMouseOutUnitMarker = (index: number) => {
      return function (e: any) {
        console.log("daasmap handleMouseOutUnitMarker");
        !!onMouseOutUnit && onMouseOutUnit(index);
        updateUnitMarkers(index);
        closeWindowTooltip();
      }
    };

    const handleMouseOverUnitMarker = (index: number, marker: any) => {
      return async function (e: any) {
        const selectedUnit = getSelectedUnit(index);
        console.log("daasmap handleMouseOverUnitMarker", selectedUnit);
        !!onMouseOverUnit && onMouseOverUnit(index);
        updateUnitMarkers(index);
        if (
            !!getUnitInfo &&
            !!selectedUnit &&
            unitMarkers.current?.length > index
        ) {
          const unit = await getUnitInfo(selectedUnit);
          !!unit &&
          drawTooltipUnit(marker, mapRef.current, unit);
        }
      }
    }

    const handleMouseOverShippingCluster = useCallback(
      async (clusterMembers: Overlaped[]) => {
        if (clusterMembers && clusterMembers.length > 0) {
          const selectedShippingList = getSelectedShippings(clusterMembers);
          const selectedSector = getSelectedSector(selectedShippingList);
          updateShippingMarkers(
            selectedSector,
            selectedShippingList,
            clusterMembers
          );
          console.log(
            "map handleMouseOverShippingCluster",
            clusterMembers.length,
            selectedShippingList,
            selectedSector
          );
          redrawCluster(shippingClustering.current, shippingMarkers.current);
          onMouseOverShippingCluster &&
            onMouseOverShippingCluster(selectedShippingList, selectedSector);
          if (!!getSectorInfo) {
            const sector = await getSectorInfo(selectedSector);

            if (shippingGroupRef.current == "shipping") {
              drawTooltipShippings(
                clusterMembers[0],
                mapRef.current,
                selectedShippingList
              );
            } else {
              !!sector &&
                drawTooltipSector(clusterMembers[0], mapRef.current, sector);
            }
          }
        }
      },
      [onMouseOverShippingCluster]
    );

    function removeMarkers(markers: any[], info?: any) {
      for (var i = 0; i < markers.length; i++) {
        if (!!markers[i]) {
          markers[i].setMap(null);
        }
      }
      if (!!info) {
        info.setMap(null);
        info.close();
      }
      markers.splice(0, markers.length);
    }

    return (
      <div>
        {children}
        <div id="map" className={"map"} />
      </div>
    );
  }
);

export default DaasMap;
