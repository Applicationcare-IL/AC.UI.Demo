<template>
  <Sidebar
    v-model:visible="visible"
    class="details-sidebar w-6"
    :show-close-icon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    @update:model-value="updateModelValue"
  >
    <div class="flex justify-content-between">
      <div class="flex gap-2">
        <h2 class="h2">{{ $t("sale.sale") + ": " + sale.id }}</h2>
        <WMInput
          name="state"
          type="info"
          :highlighted="true"
          :value="sale.state.value"
          :class="statusClass(sale.state.value)"
          class="capitalize p-1"
        />
      </div>
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
    <div class="task-data flex flex-auto flex-column gap-5">
      <div class="flex">
        <div class="flex flex-column mb-0">
          <h3 class="h3">{{ $t("general-details") }}</h3>
          <div class="flex flex-column">
            <span>aa</span>
            <span>aa</span>
            <span>aa</span>
          </div>
        </div>
        <Divider layout="vertical" />
        <span>aa</span>
      </div>
    </div>

    {{ sale }}
  </Sidebar>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

import WMInput from "../../WMInput.vue";

// DEPENDENCIES
const { can } = usePermissions();
const { layoutConfig } = useLayout();
const { getStatusConditionalStyle } = useListUtils();

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

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
