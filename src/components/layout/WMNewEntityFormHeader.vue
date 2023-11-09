<template>
  <div class="m-3">
    <div class="flex flex-row justify-content-between align-content-center">
      <h1 class="h1 mb-0">{{ $t("new", [`${entity}.${entity}`]) }}</h1>
      <router-link :to="{ name }" class="p-2">
        <img src="@/assets/icons/fullScreen.svg" alt="fullScreen" />
      </router-link>
    </div>
    <Divider />
  </div>
</template>

<script setup>
const props = defineProps({
  entity: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
});
</script>

<style scoped lang="scss"></style>
