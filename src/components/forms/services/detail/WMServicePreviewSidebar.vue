<template>
  <Sidebar
    v-model:visible="visible"
    @update:modelValue="updateModelValue"
    class="details-sidebar w-6"
    :showCloseIcon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div class="flex justify-content-between">
      <h2 class="h2">
        {{ $t("service.service") }} {{ service.service_number }}
      </h2>
      <router-link
        :to="{
          name: 'serviceDetail',
          params: { id: service.id },
        }"
        class="p-2"
      >
        <Button> פתח לקוח</Button>
      </router-link>
    </div>

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
