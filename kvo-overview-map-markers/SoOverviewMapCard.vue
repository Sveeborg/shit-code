<script setup lang="ts">
import type { KVOSurveillanceCounters } from './types'

defineProps<{
  id: string
  counts: KVOSurveillanceCounters
}>()

const emit = defineEmits<{
  (e: 'zoomIn', id: string): void
}>()
</script>

<template>
  <div :id="id" class="so_overview_map_card">{{ counts.all }}</div>
</template>

<style scoped lang="scss">
.so_overview_map_card {
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 2px 4px #3339;
  width: 105px;
  height: 72px;
  padding: 8px;
}
</style>
