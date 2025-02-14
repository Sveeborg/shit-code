import mapboxgl, { type LngLatLike } from 'mapbox-gl'
import { onBeforeUnmount, ref } from 'vue'
import type { KvoCard, MarkerDataMap } from './types'

// Создание источника и слоя
export const addSourceAndLayer = (
  map: mapboxgl.Map,
  sid: string,
  lid: string,
  clusterRadius: number,
) => {
  const sourceCandidate = map.getSource(sid)
  const singleSoLayerCandidate = map.getLayer(lid)

  if (!sourceCandidate) {
    map.addSource(sid, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterRadius,
      clusterProperties: {
        failure: ['any', ['get', 'failure']],
        all: ['+', ['get', 'all']],
        own: ['+', ['get', 'own']],
        violating: ['+', ['get', 'violating']],
        noPlan: ['+', ['get', 'noPlan']],
      },
    })
  }

  if (!singleSoLayerCandidate) {
    map.addLayer({
      id: lid,
      type: 'circle',
      source: sid,
      filter: ['!=', 'cluster', true],
      paint: {
        'circle-opacity': 0,
        'circle-radius': 12,
      },
    })
  }
}

// Обновление данных в слое
export const updateSourceData = (
  map: mapboxgl.Map,
  sid: string,
  data: KvoCard[],
) => {
  const source = map.getSource(sid)
  if (!source || source.type !== 'geojson') {
    return
  }

  source.setData({
    type: 'FeatureCollection',
    features: data.map((item) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: item.lngLat },
      properties: {
        id: item.uid,
        name: item.name,
        failure: item.status !== 'OPERABLE',
        ...item.droneCounts,
      },
    })),
  })
}

// Пересчёт маркеров
export const useMarkersUpdate = (sid: string) => {
  const markersRef = ref<MarkerDataMap>({})
  let markers: MarkerDataMap = {}
  let markersOnScreen: MarkerDataMap = {}

  const updateMarkers = (map: mapboxgl.Map) => {
    const newMarkers: MarkerDataMap = {}
    const features = map.querySourceFeatures(sid)

    for (const feature of features) {
      if (feature.geometry.type !== 'Point') {
        continue
      }

      const coords = feature.geometry.coordinates

      const props = feature.properties
      if (!props) {
        continue
      }

      const id = props.cluster ? props.cluster_id + '' : (props.id as string)
      let marker = markers[id]

      // Если маркера ещё нет, создать
      if (!marker) {
        marker = markers[id] = {
          marker: new mapboxgl.Marker({
            element: document.createElement('div'),
          }).setLngLat(coords as LngLatLike),
          opacity: '1',
          transform: 'unset',
          data: {
            id,
            name: props.name,
            failure: props.failure,
            pointsCount: props.point_count,
            droneCounts: {
              all: props.all,
              own: props.own,
              noPlan: props.noPlan,
              violating: props.violating,
            },
          },
        }
      }

      newMarkers[id] = marker
      // Если маркера ещё нет на карте, добавить
      if (!markersOnScreen[id]) marker.marker.addTo(map)
    }

    // Удалить маркеры, которые вышли из поля зрения
    for (const id in markersOnScreen) {
      if (!newMarkers[id]) markersOnScreen[id].marker.remove()
    }
    markersOnScreen = newMarkers

    // Получить данные позиции и прозрачности маркеров для контейнера слота
    for (const id in newMarkers) {
      newMarkers[id].opacity = newMarkers[id].marker.getElement().style.opacity
      newMarkers[id].transform =
        newMarkers[id].marker.getElement().style.transform
    }

    markersRef.value = newMarkers
  }

  onBeforeUnmount(() => {
    for (const id in markersRef.value) {
      markersRef.value[id].marker.remove()
    }

    markersRef.value = {}
    markers = {}
    markersOnScreen = {}
  })

  return { markersRef, updateMarkers }
}

// Зум при клике на маркер
export const handleZoomIn = () => {}
