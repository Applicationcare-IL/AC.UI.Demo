<template>
  <div class="trending-area-list">
    <div v-for="item in data" :key="item.id" class="trending-item">
      <div class="trending-item__info">
        <span>{{ item.area_value }}</span>
        <span class="font-bold trending-item__number">{{ item.actual }}</span>
      </div>

      <TrendingMarker :increment="item.increment" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.trending-area-list {
  display: flex;
  gap: 8px;
  width: 100%;
  flex-direction: column;
}

.trending-item {
  padding: 8px;
  gap: 4px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  opacity: 0px;
  background: var(--gray-50);
  color: var(--gray-900);
  width: 100%;

  &__info {
    display: flex;
    gap: 4px;
    font-size: 1em;
    font-family: "Open Sans", sans-serif;
  }

  &__number {
    font-size: 1.1em;
  }
}
</style>
