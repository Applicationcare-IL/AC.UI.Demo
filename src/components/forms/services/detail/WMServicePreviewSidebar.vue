<template>
  <Sidebar
    v-model:visible="visible"
    class="details-sidebar w-6"
    :show-close-icon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    @update:model-value="updateModelValue"
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
        <Button> {{ $t("service.open-service") }} </Button>
      </router-link>
    </div>

    <Divider />

    <div class="flex gap-5">
      <WMInput
        name="contact"
        type="info"
        :highlighted="true"
        :label="$t('contact.contact') + ':'"
        :value="service.contact"
        width="120"
      />

      <WMInput
        name="owner"
        type="info"
        :highlighted="true"
        :label="$t('owner') + ':'"
        :value="service.owner.name"
        width="200"
      />
    </div>

    <h4 class="h4">
      {{ $t("classification") }}
    </h4>

    <Breadcrumb :model="items" class="mb-5">
      <template #item="{ item }">
        {{ item.name }}
      </template>
      <template #separator> / </template>
    </Breadcrumb>

    <WMStepper
      :steps="stages"
      :current-step="currentStage"
      aria-label="Form Steps"
    />

    <WMTasksTable
      v-if="can('tasks.read')"
      related-entity="service"
      :related-entity-id="service.id"
      :columns="taskPreviewTableColumns"
      :multiselect="false"
      :show-header-options="false"
      :rows="5"
      table-class="compact"
    />

    <h4 class="h4">{{ $t("journal") }}</h4>
    <WMJournalDataView entity-type="service" :entity-id="service.id" />
  </Sidebar>
</template>

<script setup>
import { useDateFormat } from "@vueuse/core";
import { computed, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

const { can } = usePermissions();

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

const { getTaskPreviewColumns } = useListUtils();

const taskPreviewTableColumns = ref(getTaskPreviewColumns());

const items = ref([
  { name: "ארנונה" },
  { name: "בקשה להנחה" },
  { name: "נכס ריק למגורים ועסקים" },
  { name: "סיווג רביעי" },
  { name: "סיווג חמישי" },
]);

const stages = computed(() => {
  return props.service.stages.map((stage) => ({
    label: stage.name,
    date: useDateFormat(stage.sla.due_date, "DD/MM/YY"),
  }));
});

const currentStage = computed(() => {
  return props.service.current_stage?.order - 1;
});
</script>
