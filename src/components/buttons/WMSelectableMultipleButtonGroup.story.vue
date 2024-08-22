<template>
  <Story :layout="{ type: 'grid', width: '50%' }">
    <Variant title="With check symbol">
      <div class="flex gap-2">
        <WMSelectableMultipleButtonGroup
          :options="state"
          @update:selected-options="logEvent('update:selected-options', $event)"
        />
      </div>
    </Variant>
    <Variant title="No check symbol">
      <div class="flex gap-2">
        <WMSelectableMultipleButtonGroup
          :options="state"
          no-icon
          @update:selected-options="logEvent('update:selected-options', $event)"
        />
      </div>
    </Variant>
  </Story>
</template>
<script setup>
import { logEvent } from "histoire/client";
import { ref } from "vue";

const state = ref([
  {
    label: "User",
    value: "user",
  },
  {
    label: "Team",
    value: "team",
  },
  {
    label: "Role",
    value: "role",
  },
]);
</script>
