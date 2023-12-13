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
      :currentStep="currentStage"
      aria-label="Form Steps"
    />

    <WMTasksTable
      relatedEntity="service"
      :relatedEntityId="service.id"
      :columns="taskPreviewTableColumns"
      :multiselect="false"
      :showHeaderOptions="false"
      :rows="5"
      table-class="compact"
    />

    <h4 class="h4">יומן</h4>
    <WMJournalDataView class="mb-5" />
  </Sidebar>
</template>

<script setup>
import { ref, computed } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useDateFormat } from "@vueuse/core";

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
