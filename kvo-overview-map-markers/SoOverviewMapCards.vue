<script setup lang="ts">
import { Map } from 'mapbox-gl'
import { onMounted } from 'vue'
import { metasFromBackend } from './mock-data'
import { CLUSTER_RADIUS, SINGLE_SO_LAYER_ID, SOURCE_ID } from './constants'
import {
  addSourceAndLayer,
  updateSourceData,
  useMarkersUpdate,
} from './helpers'

const props = defineProps<{
  map: Map
}>()

const { markersRef, updateMarkers } = useMarkersUpdate(SOURCE_ID)

onMounted(() => {
  addSourceAndLayer(props.map, SOURCE_ID, SINGLE_SO_LAYER_ID, CLUSTER_RADIUS)
  updateSourceData(props.map, SOURCE_ID, metasFromBackend)

  props.map.on('render', () => {
    if (!props.map.getSource(SOURCE_ID) || !props.map.isSourceLoaded(SOURCE_ID))
      return
    updateMarkers(props.map)
  })
})
</script>

<template>
  <Teleport to="#map1">
    <div class="map-vue-elements-container">
      <div
        v-for="item in markersRef"
        :id="item.data.id"
        :key="item.data.id"
        class="map-vue-element"
        :style="{
          transform: item.transform,
          opacity: item.opacity,
        }"
      >
        <slot name="item" v-bind="item.data" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.map-vue-elements-container {
  position: absolute;
}
.map-vue-element {
  position: absolute;
  left: 0;
  top: 0;
  transition: opacity 0.2s;
  will-change: transform;

  // background-color: #666;
  // color: #fff;
  // padding: 8px;
  // border-radius: 8px;
}
</style>
