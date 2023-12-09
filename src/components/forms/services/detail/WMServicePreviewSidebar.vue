<template>
  <Sidebar
    v-model:visible="visible"
    @update:modelValue="updateModelValue"
    class="details-sidebar w-6"
    :showCloseIcon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <h2>{{ $t("service.service") }} {{ service.service_number }}</h2>
    <Divider />
  </Sidebar>
</template>

<script setup>
import { ref } from "vue";
import { useLayout } from "@/layout/composables/layout";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  service: {
    type: Object,
    default: () => {},
  },
});

const { layoutConfig } = useLayout();

const visible = ref(false);

const updateModelValue = (value) => {
  visible.value = value;
};
</script>
