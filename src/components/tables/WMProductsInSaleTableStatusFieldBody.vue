<template>
  <div
    class="w-full p-dropdown p-component p-inputwrapper p-inputwrapper-filled"
    :class="`p-dropdown-sale-product-status p-dropdown-sale-product-status--${modelValue.value}`"
  >
    <span class="p-dropdown-label p-inputtext cursor-text">
      {{ modelValue[optionLabelWithLang] }}
    </span>
  </div>
</template>

<script setup>
// IMPORTS

// DEPENDENCIES
const { optionLabelWithLang } = useLanguages();

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
