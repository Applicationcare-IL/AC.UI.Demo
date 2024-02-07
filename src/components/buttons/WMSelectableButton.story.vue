<template>
  <Story title="SelectableButton">
    <template #controls>
      <HstText v-model="state.content" title="Label" />
      <HstCheckbox v-model="state.disabled" title="Disabled" />
    </template>
    <Variant label="Default">
      <WMSelectableButton v-model="state.disabled" label="Selectable Button" />
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

const state = reactive({
  content: "Selectable Button",
  disabled: false,
});
</script>
