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
import { ShippingMarker } from "../../assets/svgs/MarkerShipping";
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
      children,
      onClickMap,
      selectedDelivery,
      isVisibleMarkers,
      isContainerVisible,
      isUnitVisible,
      isDeliveryVisible,
      isShippingVisible,
      onClickContainerCluster,
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
      isShowInfoWindow,
    }: DaasMapProps,
    ref
  ) => {
    const mapRef = useRef<any>();
    const deliveryMarkers = useRef<any[]>(new Array());
    const shippingMarkers = useRef<any[]>(new Array());
    const deliveryPreviewMarkers = useRef(new Array());
    const containerMarkers = useRef(new Array());
    const unitMarkers = useRef(new Array());
    const unitInfo = useRef<any>();
    const shippingsRef = useRef<MapShippingType[]>();
    const containersRef = useRef<MapContainerType[]>();
    const deliveriesRef = useRef<MapDeliveryType[]>();
    const unitsRef = useRef<MapUnitType[]>();
    const shippingGroupRef = useRef<MetricType>("area");
    const selectedDeliveryIdx = useRef(0);
    const deliveryClustering = useRef<any>();
    const shippingClustering = useRef<any>();
    const containerClustering = useRef<any>();
    const mypositionMarker = useRef<any>();

    const getSelectedUnit = (index: number) => {
      const units = unitsRef.current;
      return units?.length && units?.length > index ? units[index] : undefined;
    };

    const getSelectedShippings = (clusters: Overlaped[], data?: any[]) => {
      const selected: any[] = [];
      clusters &&
        clusters.forEach((m) => {
          if (data && m.index >= 0 && data.length > m.index) {
            selected.push(data[m.index]);
          }
        });
      return selected;
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
        drawContainerMarkers: drawMarkersContainers,
        drawDeliveriesMarkers: drawMarkersDeliveries,
        drawUnitMarkers: drawMarkersUnits,
        setMetric,
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
        removePreviewMarkers: () => {
          removeMarkers(deliveryPreviewMarkers.current);
        },
        drawPreviewMarkers: (deliveries: any[]) => {
          removeMarkers(deliveryPreviewMarkers.current);
          if (deliveries && deliveries?.length > 0 && !!window.naver.maps) {
            let recommendIdx = -1;
            deliveries.map((d, index) => {
              console.log("drawPreviewMarkers", d);
              if (!d.complete && recommendIdx === -1) {
                recommendIdx = index;
              }
              drawMarkerDeliveryPreview(d, index, recommendIdx);
            });
          }
        },
      }),
      [currentPosition]
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
        // createClusterShipping(shippingMarkers.current);

        window.naver.maps.Event.addListener(
          mapRef.current,
          "click",
          onClickMap
        );

        window.naver.maps.Event.addListener(
          mapRef.current,
          "zoom_changed",
          function () {
            //containers and shippings use clustering even if map is zoomed maximum. clustering does this feature
            showMarkersInBounds(unitMarkers.current, mapRef.current);
            showMarkersInBounds(deliveryMarkers.current, mapRef.current);
            showMarkersInBounds(shippingMarkers.current, mapRef.current);
            showMarkersInBounds(deliveryPreviewMarkers.current, mapRef.current);
          }
        );

        window.naver.maps.Event.addListener(
          mapRef.current,
          "dragend",
          function () {
            showMarkersInBounds(unitMarkers.current, mapRef.current);
            showMarkersInBounds(deliveryMarkers.current, mapRef.current);
            showMarkersInBounds(shippingMarkers.current, mapRef.current);
            showMarkersInBounds(deliveryPreviewMarkers.current, mapRef.current);
          }
        );
      }
    }, []);

    useEffect(() => {
      if (!mypositionMarker.current) {
        //if my my position marker isn't initialized then create one.
        drawMarkerMyPosition(currentPosition);
      } else {
        //if my position marker is initialized then change its position.
        changeCurrentPosition(currentPosition);
      }
    }, [currentPosition]);

    useEffect(() => {
      if (isVisibleMarkers && isContainerVisible) {
        drawMarkersContainers(containersRef.current);
      } else {
        removeMarkers(containerMarkers.current);
      }
      redrawCluster(containerClustering.current, containerMarkers.current);
    }, [isVisibleMarkers, isContainerVisible]);

    useEffect(() => {
      if (isVisibleMarkers && isDeliveryVisible) {
        drawMarkersDeliveries(deliveriesRef.current);
      } else {
        removeMarkers(deliveryMarkers.current);
      }
      redrawCluster(deliveryClustering.current, deliveryMarkers.current);
    }, [isVisibleMarkers, isDeliveryVisible]);

    useEffect(() => {
      if (isVisibleMarkers && isUnitVisible) {
        drawMarkersUnits(unitsRef.current);
      } else {
        removeMarkers(unitMarkers.current);
      }
    }, [isVisibleMarkers, isUnitVisible]);

    useEffect(() => {
      if (isVisibleMarkers && isShippingVisible) {
        drawMarkersShippings(shippingGroupRef.current, shippingsRef.current);
      } else {
        removeMarkers(shippingMarkers.current);
      }
      redrawCluster(shippingClustering.current, shippingMarkers.current);
    }, [isVisibleMarkers, isShippingVisible]);

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
          const selectedMarker = $(d.getElement()).find("#d-marker" + i);
          selectedMarker.toggleClass("selected", i === selectedDelivery);
          console.log("selectedDelivery", i === selectedDelivery, d);
        });
    }, [selectedDelivery]);

    /**Draw markers**/
    const drawMarkersUnits = (units?: MapUnitType[]) => {
      if (!!units) unitsRef.current = units;

      removeMarkers(unitMarkers.current, unitInfo.current);
      if (!!mapRef.current) {
        if (units && units?.length > 0) {
          units.map((unit, index) => {
            drawMarkerUnit(unit, index, isUnitVisible && isVisibleMarkers);
          });
        }
      }
    };

    const drawMarkersContainers = (containers?: MapContainerType[]) => {
      console.log("drawMarkerContainer", containers);
      if (!!containers) containersRef.current = containers;
      removeMarkers(containerMarkers.current);
      if (!!mapRef.current) {
        //배송 목록 있을 떼 업무 목록 표시안
        if (containers && containers?.length > 0) {
          containers.map((container, index) => {
            drawMarkerContainer(
              container,
              index,
              !!isContainerVisible && !!isVisibleMarkers
            );
          });
        }
      }
      redrawCluster(containerClustering.current, containerMarkers.current);
    };

    const drawMarkersDeliveries = (deliveries?: MapDeliveryType[]) => {
      if (!!deliveries) deliveriesRef.current = deliveries;
      removeMarkers(deliveryMarkers.current);
      if (deliveries && deliveries?.length > 0 && !!window.naver.maps) {
        let recommendIdx = -1;
        deliveries.map((d, index) => {
          if (!d.complete && recommendIdx === -1) {
            recommendIdx = index;
          }
          drawMarkerDelivery(
            d,
            index,
            recommendIdx,
            !!isVisibleMarkers && !!isDeliveryVisible
          );
        });
      }
      redrawCluster(deliveryClustering.current, deliveryMarkers.current);
    };

    const setMetric = (metric: MetricType) => {
      shippingGroupRef.current = metric;
    };

    const drawMarkersShippings = (
      metric?: MetricType,
      shippings?: MapShippingType[]
    ) => {
      if (!!metric) shippingGroupRef.current = metric;
      if (!!shippings) shippingsRef.current = shippings;

      removeMarkers(shippingMarkers.current);
      if (
        isVisibleMarkers &&
        isShippingVisible &&
        shippingsRef.current &&
        shippingsRef.current?.length > 0 &&
        !!window.naver.maps
      ) {
        shippingsRef.current.map((d, index) => {
          drawMarkerShipping(d, index);
        });
      }
      redrawCluster(shippingClustering.current, shippingMarkers.current);
    };
    /** Draw marker **/

    const drawMarkerUnit = (
      unit: MapUnitType,
      index: number,
      visible?: boolean
    ) => {
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
          <Svg
            id={"u-marker" + index}
            className={"order-marker-img " + className}
          />
        );
        var markerOptions = {
          index,
          position,
          map: isPositionInBounds(position, map) && visible ? map : null,
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
      visible: boolean
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

        const icon = (
          <Svg
            id={"u-marker" + index}
            className={"order-marker-img " + className}
          />
        );

        var markerOptions = {
          index,
          selected: false,
          claimed: container.status === "CLAIMED",
          assigned: container.container_class !== "WHITE",
          position,
          map: isPositionInBounds(position, map) && visible ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size / 2),
          },
        };
        const orderMarker = new window.naver.maps.Marker(markerOptions);
        containerMarkers.current.push(orderMarker);
        if (selectedDelivery && selectedDelivery < 0 && index == 0) {
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
      visible?: boolean
    ) => {
      if (!!delivery?.address?.lat && !!delivery?.address?.lng) {
        const position = new window.naver.maps.LatLng(
          delivery.address.lat,
          delivery.address.lng
        );
        const map: any = mapRef.current;
        let bg = "var(--primary)";
        let width = 26;
        let height = 30;
        let className = "";
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
            <DeliveryMarker style={{ width, height }} fill={bg} />
            {index == recommendIdx ? (
              <div className={"map-delivery-center"} />
            ) : delivery.shipping_count > 0 ? (
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
            )}
          </div>
        );
        var markerOptions = {
          position,
          map: isPositionInBounds(position, map) && visible ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(width, height),
            anchor: new window.naver.maps.Point(width / 2, height), //가운데 아래
          },
        };
        const marker = new window.naver.maps.Marker(markerOptions);
        deliveryMarkers.current.push(marker);

        if (selectedDeliveryIdx.current === index) {
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
        let width = 26,
          height = 30;
        let className = "";
        if (index === recommendIdx) {
          className = "selected";
        }
        const icon = (
          <div
            id={"d-marker" + index}
            className={"delivery-marker " + className}
          >
            <DeliveryMarker style={{ width, height }} fill={"var(--dark)"} />
            {index == recommendIdx ? (
              <div className={"map-delivery-center"} />
            ) : (
              <EyesSvg className={"eye-img"} />
            )}
          </div>
        );
        var markerOptions = {
          position,
          map: isPositionInBounds(position, map) ? map : null,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(width, height),
            anchor: new window.naver.maps.Point(width / 2, height),
          },
        };
        if (0 === index) {
          map.setCenter(position);
        }
        const marker = new window.naver.maps.Marker(markerOptions);
        deliveryPreviewMarkers.current.push(marker);
      }
    };

    const drawMarkerShipping = (delivery: MapShippingType, index: number) => {
      if (!!delivery?.address?.lat && !!delivery?.address?.lng) {
        const position = new window.naver.maps.LatLng(
          delivery.address.lat,
          delivery.address.lng
        );
        const map: any = mapRef.current;
        let bg = "var(--greyc4)",
          size = 52,
          opacity = 0.7;
        if (delivery.complete) {
          bg = "var(--grey96)";
        } else if (delivery.is_return) {
          //only return
          bg = "var(--errorActive)";
        }

        const icon = (
          <div id={"d-marker" + index} className={"shipping-marker "}>
            <ShippingMarker
              id={"d-marker-img"}
              className={"delivery-marker-img"}
              fill={bg}
              opacity={opacity}
            />
            <span className={"map-delivery-count small bold white"}>
              {!delivery.is_return ? 1 : "R1"}
            </span>
          </div>
        );
        const markerOptions = {
          index,
          selected: false,
          is_return: delivery.is_return,
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
          handleClickShippingMarker(marker)
        );

        window.naver.maps.Event.addListener(
          marker,
          "mouseover",
          handleMouseOverShippingMarker(marker)
        );

        window.naver.maps.Event.addListener(
          marker,
          "mouseout",
          handleMouseOutShippingMarker(marker)
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
        onClusterClick: handleClickContainerCluster,
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

    const checkShippingIsInSector = (
      shipping: MapShippingType,
      selectedSector?: SectorInfoProps
    ) => {
      let selected = false;
      if (shipping) {
        const sector = shipping.designated_sector || shipping.address?.sector;
        switch (shippingGroupRef.current) {
          case "area":
            selected = sector?.area === selectedSector?.area;
            break;
          case "sector":
            selected = sector?.code === selectedSector?.code;
            break;
        }
      }
      return selected;
    };

    const createClusterShipping = (markers: any[]) => {
      const icon = (
        <div id={"d-marker"} className={"shipping-marker"}>
          <div id={"d-marker-round"} className={"shipping-marker-round"} />
          <ShippingMarker
            id={"d-marker-img"}
            className={"delivery-marker-img"}
          />
          <span className={"map-delivery-count small bold white"}>{""}</span>
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

      const { claimed, selected, assigned } = calculateContainerCount(
        clusterMembers
      );
      const container = $(clusterMarker.getElement()).find("#cluster-id");
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
      updateShippingMarker(
        clusterMarker,
        selected,
        return_count,
        shipping_count
      );
    };

    const updateShippingMarker = (
      clusterMarker: any,
      selected: boolean,
      return_count?: number,
      shipping_count?: number
    ) => {
      const image = $(clusterMarker.getElement()).find("#d-marker-img");
      if (return_count && return_count > 0) {
        if (shipping_count && shipping_count > 0) {
          const icon = (
            <ShippingMarker
              fill={"var(--yellow)"}
              opacity={selected ? 1 : 0.7}
              selected={selected}
            />
          );
          image.replaceWith($([renderToStaticMarkup(icon)].join("")));
          image.toggleClass("selected", selected);
          $(clusterMarker.getElement())
            .find("span.map-delivery-count")
            .text(return_count + shipping_count);
        } else {
          const icon = (
            <ShippingMarker
              fill={"var(--errorActive"}
              opacity={selected ? 1 : 0.7}
              selected={selected}
            />
          );
          image.replaceWith($([renderToStaticMarkup(icon)].join("")));
          image.toggleClass("selected", selected);
          $(clusterMarker.getElement())
            .find("span.map-delivery-count")
            .text("R" + return_count);
        }
      } else {
        const icon = (
          <ShippingMarker opacity={selected ? 1 : 0.7} selected={selected} />
        );
        image.replaceWith($([renderToStaticMarkup(icon)].join("")));
        image.toggleClass("selected", selected);
        $(clusterMarker.getElement())
          .find("span.map-delivery-count")
          .text(shipping_count || "");
      }
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

    const updateContainerMarkers = (clusterMembers?: any[]) => {
      containerMarkers.current &&
        containerMarkers.current.forEach((d, i) => {
          const markerSvg = $("#u-marker" + i);
          d.setOptions({ selected: false, size: 32 });
          markerSvg.toggleClass("selected", false);
        });
      clusterMembers &&
        clusterMembers.forEach((marker) => {
          marker.setOptions({ selected: true });
        });
    };

    const updateShippingMarkers = (selectedSector?: SectorInfoProps) => {
      const shippings = shippingsRef.current;
      let shipping_count = 0,
        return_count = 0;
      //update delivery marker style when selected marker change
      shippingMarkers.current &&
        shippingMarkers.current.forEach((d, i) => {
          let selected = false;
          if (
            // shippingGroupRef.current !== "shipping" &&
            !!shippings &&
            shippings.length > i
          ) {
            selected = checkShippingIsInSector(
              shippings[d.index],
              selectedSector
            );

            if (shippings[d.index].is_return) {
              return_count = 1;
            } else {
              shipping_count = 1;
            }
          }
          updateShippingMarker(d, selected, return_count, shipping_count);
        });

      // if (shippingGroupRef.current === "shipping") {
      //   clusterMembers &&
      //     clusterMembers.forEach((marker) => {
      //       styleClusterShipping(marker, 1, [marker]);
      //       marker.setOptions({ selected: true });
      //     });
      // }
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
            showMarker(map, m);
          } else {
            hideMarker(m);
          }
        });
      }
    };

    function showMarker(map: any, marker: any) {
      if (marker.setMap()) return;
      marker.setMap(map);
    }

    function hideMarker(marker: any) {
      if (!marker.setMap()) return;
      marker.setMap(null);
    }

    /**Event Handlers**/
    function handleClickDeliveryMarker(delivery: number) {
      return function (e: any) {
        !!onClickDelivery && onClickDelivery(delivery);
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
        redrawCluster(shippingClustering.current, shippingMarkers.current);
        closeWindowTooltip();
        onMouseOutShippingCluster && onMouseOutShippingCluster(clusterMembers);
      },
      [onMouseOutShippingCluster]
    );

    const handleClickContainerCluster = useCallback(
      async (clusterMembers: Overlaped[]) => {
        const selectedContainerList = getSelectedShippings(
          clusterMembers,
          containersRef.current
        );
        updateContainerMarkers(clusterMembers);
        redrawCluster(containerClustering.current, containerMarkers.current);
        if (onClickContainerCluster)
          onClickContainerCluster(selectedContainerList);
      },
      []
    );

    const handleClickShippingCluster = useCallback(
      async (clusterMembers: Overlaped[]) => {
        const selectedShippingList = getSelectedShippings(
          clusterMembers,
          shippingsRef.current
        );
        const selectedSector = getSelectedSector(selectedShippingList);
        if (onClickOverlappedShipping)
          onClickOverlappedShipping(
            selectedShippingList,
            selectedSector,
            shippingGroupRef.current
          );
      },
      []
    );

    function handleClickShippingMarker(marker: any) {
      return function (e: any) {
        handleClickShippingCluster([marker]);
      };
    }

    const handleClickUnitMarker = (index: number) => {
      return function (e: any) {
        const selectedUnit = getSelectedUnit(index);
        !!onClickUnit && onClickUnit(index, selectedUnit);
      };
    };

    const handleMouseOutUnitMarker = (index: number) => {
      return function (e: any) {
        !!onMouseOutUnit && onMouseOutUnit(index);
        updateUnitMarkers(-1);
        closeWindowTooltip();
      };
    };

    const handleMouseOverUnitMarker = (index: number, marker: any) => {
      return async function (e: any) {
        const selectedUnit = getSelectedUnit(index);
        !!onMouseOverUnit && onMouseOverUnit(index);
        updateUnitMarkers(index);
        if (
          !!getUnitInfo &&
          !!selectedUnit &&
          unitMarkers.current?.length > index
        ) {
          const unit = await getUnitInfo(selectedUnit);
          !!unit && drawTooltipUnit(marker, mapRef.current, unit);
        }
      };
    };

    const handleMouseOutShippingMarker = (marker: any) => {
      return function (e: any) {
        handleMouseOutShippingCluster([marker]);
      };
    };

    function handleMouseOverShippingMarker(marker: any) {
      return function (e: any) {
        handleMouseOverShippingCluster([marker]);
      };
    }

    const handleMouseOverShippingCluster = useCallback(
      async (clusterMembers: Overlaped[]) => {
        if (clusterMembers && clusterMembers.length > 0) {
          const selectedShippingList = getSelectedShippings(
            clusterMembers,
            shippingsRef.current
          );
          const selectedSector = getSelectedSector(selectedShippingList);
          updateShippingMarkers(selectedSector);
          redrawCluster(shippingClustering.current, shippingMarkers.current);
          onMouseOverShippingCluster &&
            onMouseOverShippingCluster(selectedShippingList, selectedSector);
          if (shippingGroupRef.current == "shipping") {
            drawTooltipShippings(
              clusterMembers[0],
              mapRef.current,
              selectedShippingList
            );
          } else {
            if (!!getSectorInfo) {
              const sector = await getSectorInfo(
                selectedSector,
                shippingGroupRef.current
              );
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
