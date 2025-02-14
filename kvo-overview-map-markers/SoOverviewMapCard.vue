<script setup lang="ts">
import type { OsData } from './types'

defineProps<{
  data: OsData
}>()

const emit = defineEmits<{
  (e: 'zoomIn', id: string): void
}>()
</script>

<template>
  <div :id="data.id" class="so_overview_map_card">
    <span v-if="data.name"> {{ data.name }}</span>
    <span v-else>ОН: {{ data.pointsCount }}</span>
    <p v-if="data.failure">Ошибка</p>
  </div>
</template>

<style scoped lang="scss">
.so_overview_map_card {
  border-radius: 6px;
  background-color: #000;
  opacity: 0.7;
  color: #fff;
  box-shadow: 0 2px 4px #3339;
  width: 105px;
  height: 72px;
  padding: 8px;
}
</style>
