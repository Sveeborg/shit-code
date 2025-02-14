<template>
  <SoOverviewMapCards v-if="mapRef" :map="mapRef">
    <template #item="data">
      <SoOverviewMapCard :data="data" />
    </template>
  </SoOverviewMapCards>
</template>
