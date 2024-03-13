<template>
  <div class="status-label white-space-nowrap" :class="statusClasses">
    <WMOptionSetValue :option-set="props.status" />
  </div>
</template>

<script setup>
import { computed } from "vue";

const { getStatusConditionalStyle } = useListUtils();

const props = defineProps({
  status: String,
});

const statusClasses = computed(() => {
  return getStatusConditionalStyle(props.status);
});
</script>

<style scoped lang="scss">
.status-tag {
  font-weight: 700;
}
</style>
