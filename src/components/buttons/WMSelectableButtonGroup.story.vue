<template>
  <Story :layout="{ type: 'grid', width: '50%' }">
    <Variant title="With check symbol">
      <div class="flex gap-2">
        <WMSelectableButtonGroup
          :options="state"
          @update:selected-option="logEvent('update:selected-option', $event)"
        />
      </div>
    </Variant>
    <Variant title="No check symbol">
      <div class="flex gap-2">
        <WMSelectableButtonGroup
          :options="state"
          no-icon
          @update:selected-option="logEvent('update:selected-option', $event)"
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
