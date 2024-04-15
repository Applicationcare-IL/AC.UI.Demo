<template>
  <div
    class="bg-gray-25 border-round-md w-full flex p-2 justify-content-between align-items-center"
  >
    <div class="flex gap-2">
      <span>{{ text }}</span>
      <span class="font-bold text-lg">{{ time }}</span>
    </div>
    <TrendingMarker v-if="quantity" :increment="quantity" />
  </div>
</template>

<script setup>
defineProps({
  text: String,
  time: String,
  quantity: Number,
});
</script>
