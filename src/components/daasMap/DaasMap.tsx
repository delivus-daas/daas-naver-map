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
  MapDeliveryType,
} from "./daasMap.type";
declare global {
  interface Window {
    naver: any;
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
      isDeliveryVisible,
      onClickOverlappedContainer,
      onClickDelivery,
      onClickContainer,
      deliveries,
    }: DaasMapProps,
    ref
  ) => {
    const mapRef = useRef<any>();
    const deliveryMarkers = useRef(new Array());
    const deliveryPreviewMarkers = useRef(new Array());
    const containerMarkers = useRef(new Array());
    const deliveryClustering = useRef<any>();
    const containerClustering = useRef<any>();
    const mypositionMarker = useRef<any>();

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

    const createMyPositionMarker = useCallback((currentPosition: any) => {
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

    useImperativeHandle(
      ref,
      () => ({
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
              drawDeliveryPreview(d, index, recommendIdx);
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
        createContainerCluster(containerMarkers.current);
        createDeliveryCluster(deliveryMarkers.current);

        window.naver.maps.Event.addListener(
          mapRef.current,
          "click",
          onClickMap
        );
      }
    }, []);

    useEffect(() => {
      if (!mypositionMarker.current) {
        //if my my position marker isn't initialized then create one.
        createMyPositionMarker(currentPosition);
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
        createMyPositionMarker(currentPosition);
      }
    }, [compassSupported]);

    useEffect(() => {
      removeMarkers(containerMarkers.current);
      console.log(
        "map mdrawcontaienrs",
        containers,
        isContainerVisible,
        isVisibleMarkers,
        mapRef.current
      );
      if (isContainerVisible && isVisibleMarkers && !!mapRef.current) {
        //배송 목록 있을 떼 업무 목록 표시안
        if (containers && containers?.length > 0) {
          containers.map((container, index) => {
            drawContainer(container, index);
          });
        }
      }
      reDrawCluster(containerClustering.current, containerMarkers.current);
    }, [containers, isContainerVisible, isVisibleMarkers, selectedContainer]);

    useEffect(() => {
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
          drawDelivery(d, index, recommendIdx);
        });
      }
      reDrawCluster(deliveryClustering.current, deliveryMarkers.current);
    }, [deliveries, isVisibleMarkers, isDeliveryVisible]);

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

    /**
     * cluster 마커를 redraw한다.
     * @param markers
     */
    const reDrawCluster = (clustering: any, markers: any[]) => {
      console.log("reDrawCluster", clustering);
      if (!!clustering) {
        clustering.setMarkers(markers);
      }
    };

    const styleContainerCluster = (
      clusterMarker: any,
      count: number,
      {
        claimed,
        selected,
        assigned,
      }: { claimed: boolean; selected: boolean; assigned: boolean }
    ) => {
      $(clusterMarker.getElement()).find("span:last-child").text(count);
      const image = $(clusterMarker.getElement()).find($("WhiteDropoff"));
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

    const createDeliveryCluster = (markers: any[]) => {
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
        stylingFunction: styleContainerCluster,
      });
    };

    const createContainerCluster = (markers: any[]) => {
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
        stylingFunction: styleContainerCluster,
      });
    };

    const drawContainer = (container: MapContainerType, index: number) => {
      console.log("map drawContainer", container, !!window.naver.maps);
      if (
        !!window.naver.maps &&
        !!container?.unit_location?.lat &&
        !!container?.unit_location?.lng
      ) {
        const position = new window.naver.maps.LatLng(
          container.unit_location.lat,
          container.unit_location.lng
        );
        let size = 32,
          Svg,
          className = "";

        const selected =
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
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size / 2),
          },
        };
        const orderMarker = new window.naver.maps.Marker(markerOptions);
        containerMarkers.current.push(orderMarker);
        if (
          selectedContainer.length <= 0 &&
          selectedDelivery < 0 &&
          index == 0
        ) {
          mapRef.current.setCenter(position);
        }
        window.naver.maps.Event.addListener(
          orderMarker,
          "click",
          handleClickContainerMarker(index)
        );
      }
    };

    const drawDelivery = (
      delivery: MapDeliveryType,
      index: number,
      recommendIdx: number
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
          map,
          icon: {
            content: [renderToStaticMarkup(icon)].join(""),
            size: new window.naver.maps.Size(size, size),
            anchor: new window.naver.maps.Point(size / 2, size / 2),
          },
        };
        const marker = new window.naver.maps.Marker(markerOptions);
        deliveryMarkers.current.push(marker);

        if (selectedDelivery === index) {
          map.setCenter(position);
        }
        window.naver.maps.Event.addListener(
          marker,
          "click",
          handleClickDeliveryMarker(index)
        );
      }
    };

    const drawDeliveryPreview = (
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
          map,
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

    function handleClickDeliveryMarker(delivery: number) {
      return function (e: any) {
        onClickDelivery(delivery);
      };
    }

    function handleClickContainerMarker(index: number) {
      return function (e: any) {
        onClickContainer(index);
      };
    }

    function removeMarkers(markers: any[]) {
      for (var i = 0; i < markers.length; i++) {
        if (!!markers[i]) {
          markers[i].setMap(null);
        }
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
