<template>
  <Sidebar
    v-model:visible="visible"
    class="details-sidebar w-6"
    :show-close-icon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    @update:model-value="updateModelValue"
  >
    <div class="flex justify-content-between">
      <h2 class="h2">{{ $t("sale.sale") + ": " + sale.id }}</h2>
      <router-link
        :to="{
          name: 'saleDetail',
          params: { id: sale.id },
        }"
        class="p-2"
      >
        <Button>{{ $t("edit") }}</Button>
      </router-link>
    </div>
    <Divider />
    {{ sale }}
  </Sidebar>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { can } = usePermissions();
const { layoutConfig } = useLayout();

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  sale: {
    type: Object,
    default: () => {},
  },
});

// REFS
const visible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const updateModelValue = (value) => {
  visible.value = value;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
