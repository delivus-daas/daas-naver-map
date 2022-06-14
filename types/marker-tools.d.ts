/**
 * Copyright 2016 NAVER Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * 마커 클러스터링을 정의합니다.
 * @param {Object} options 마커 클러스터링 옵션
 */
declare class MarkerClustering extends window.naver.maps.OverlayView {
    DEFAULT_OPTIONS: {
        map: null;
        markers: never[];
        disableClickZoom: boolean;
        minClusterSize: number;
        maxDistance: number;
        maxZoom: number;
        gridSize: number;
        icons: never[];
        indexGenerator: number[];
        averageCenter: boolean;
        stylingFunction: () => void;
    };
    _clusters: any;
    _mapRelations: null;
    _markerRelations: any;
    onClusterClick: any;
    onClusterMouseOver: any;
    onClusterMouseOut: any;
    constructor(options: any);
    draw: any;
    onAdd(): void;
    onRemove(): void;
    /**
     * 마커 클러스터링 옵션을 설정합니다. 설정한 옵션만 반영됩니다.
     * @param {Object | string} newOptions 옵션
     */
    setOptions(newOptions: any | string, value: any): void;
    /**
     * 마커 클러스터링 옵션을 반환합니다. 특정 옵션 이름을 지정하지 않으면, 모든 옵션을 반환합니다.
     * @param {string} key 반환받을 옵션 이름
     * @return {Any} 옵션
     */
    getOptions(key: number | string): any;
    /**
     * 클러스터를 구성하는 최소 마커 수를 반환합니다.
     * @return {number} 클러스터를 구성하는 최소 마커 수
     */
    getMinClusterSize(): any;
    /**
     * 클러스터를 구성하는 최소 마커 수를 설정합니다.
     * @param {number} size 클러스터를 구성하는 최소 마커 수
     */
    setMinClusterSize(size: number): void;
    /**
     * 클러스터 마커를 노출할 최대 줌 레벨을 반환합니다.
     * @return {number} 클러스터 마커를 노출할 최대 줌 레벨
     */
    getMaxZoom(): any;
    /**
     * 클러스터 마커를 노출할 최대 줌 레벨을 설정합니다.
     * @param {number} zoom 클러스터 마커를 노출할 최대 줌 레벨
     */
    setMaxZoom(zoom: number): void;
    /**
     * 클러스터를 구성할 그리드 크기를 반환합니다. 단위는 픽셀입니다.
     * @return {number} 클러스터를 구성할 그리드 크기
     */
    getGridSize(): any;
    /**
     * 클러스터를 구성할 그리드 크기를 설정합니다. 단위는 픽셀입니다.
     * @param {number} size 클러스터를 구성할 그리드 크기
     */
    setGridSize(size: number): void;
    /**
     * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 반환합니다.
     * @return {Array | Function} 인덱스 생성기
     */
    getIndexGenerator(): any;
    /**
     * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 설정합니다.
     * @param {Array | Function} indexGenerator 인덱스 생성기
     */
    setIndexGenerator(indexGenerator: number): void;
    /**
     * 클러스터로 구성할 마커를 반환합니다.
     * @return {Array.<window.naver.maps.Marker>} 클러스터로 구성할 마커
     */
    getMarkers(): any;
    /**
     * 클러스터로 구성할 마커를 설정합니다.
     * @param {Array.<window.naver.maps.Marker>} markers 클러스터로 구성할 마커
     */
    setMarkers(markers: any[]): void;
    /**
     * 클러스터 마커 아이콘을 반환합니다.
     * @return {Array.<window.naver.maps.Marker~ImageIcon | window.naver.maps.Marker~SymbolIcon | window.naver.maps.Marker~HtmlIcon>} 클러스터 마커 아이콘
     */
    getIcons(): any;
    /**
     * 클러스터 마커 아이콘을 설정합니다.
     * @param {Array.<window.naver.maps.Marker~ImageIcon | window.naver.maps.Marker~SymbolIcon | window.naver.maps.Marker~HtmlIcon>} icons 클러스터 마커 아이콘
     */
    setIcons(icons: any[]): void;
    /**
     * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 반환합니다.
     * @return {Funxtion} 콜백함수
     */
    getStylingFunction(): any;
    /**
     * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 설정합니다.
     * @param {Function} func 콜백함수
     */
    setStylingFunction(func: () => void): void;
    /**
     * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 반환합니다.
     * @return {boolean} 줌 동작 수행 여부
     */
    getDisableClickZoom(): any;
    /**
     * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 설정합니다.
     * @param {boolean} flag 줌 동작 수행 여부
     */
    setDisableClickZoom(flag: boolean): void;
    /**
     * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 반환합니다.
     * @return {boolean} 평균 좌표로 클러스터링 여부
     */
    getAverageCenter(): any;
    /**
     * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 설정합니다.
     * @param {boolean} averageCenter 평균 좌표로 클러스터링 여부
     */
    setAverageCenter(averageCenter: number): void;
    changed(key: string, value: string): void;
    /**
     * 현재 지도 경계 영역 내의 마커에 대해 클러스터를 생성합니다.
     * @private
     */
    _createClusters(): void;
    /**
     * 클러스터의 아이콘, 텍스트를 갱신합니다.
     * @private
     */
    _updateClusters(): void;
    /**
     * 클러스터를 모두 제거합니다.
     * @private
     */
    _clearClusters(): void;
    /**
     * 생성된 클러스터를 모두 제거하고, 다시 생성합니다.
     * @private
     */
    _redraw(): void;
    /**
     * 전달된 위/경도에서 가장 가까운 클러스터를 반환합니다. 없으면 새로 클러스터를 생성해 반환합니다.
     * @param {window.naver.maps.LatLng} position 위/경도
     * @return {Cluster} 클러스터
     */
    _getClosestCluster(position: any): any;
    /**
     * 지도의 Idle 상태 이벤트 핸들러입니다.
     */
    _onIdle(): void;
    /**
     * 각 마커의 드래그 종료 이벤트 핸들러입니다.
     */
    _onDragEnd(): void;
}
export default MarkerClustering;
