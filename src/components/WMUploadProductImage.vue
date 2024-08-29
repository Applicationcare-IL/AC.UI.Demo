<template>
  <div class="add-image">
    <img class="vertical-align-middle" src="/icons/add_image.svg" alt="Add image" />
    <span>{{ $t("product.upload-image-drag-the-photo-here") }}</span>
    <span
      >{{ $t("product.upload-image-or") }}
      <span class="text-blue-600 underline cursor-pointer">{{
        $t("product.upload-image-click-here")
      }}</span></span
    >
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped>
.add-image {
  height: 152px;
  width: 152px;
  border: 1px dashed var(--gray-600);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  font-weight: bold;
  line-height: 1.3em;
}
</style>
