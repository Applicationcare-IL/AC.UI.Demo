<template>
  <Story title="ToggleSwitch">
    <template #controls>
      <HstText v-model="state.label" title="Label" />
      <HstText v-model="state.content" title="Content" />
      <HstCheckbox v-model="state.active" title="Active" />
    </template>
    <Variant label="Default">
      <div class="flex gap-5">
        <WMToggleSwitch v-model="state.active" label="Recurring task">
          {{ state.content }}
        </WMToggleSwitch>
      </div>
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

const state = reactive({
  label: "Recurring task",
  content: "Example content",
  active: false,
});
</script>
