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
          <div class="flex flex-column gap-5">
            <div class="flex">
              <WMInput
                name="owner"
                type="info"
                :label="$t('owner')"
                :value="sale.owner.name"
                highlighted
              />
              <WMInput
                name="customer"
                type="info-link"
                :highlighted="true"
                :label="$t('sale.customer') + ':'"
                :value="sale.customer.name"
                :to="'/customer/' + sale.customer.id"
              />
              <WMInput
                name="contact"
                type="info-link"
                :highlighted="true"
                :label="$t('sale.contact') + ':'"
                :value="sale.contact.name"
                :to="'/contact/' + sale.contact.id"
              />
            </div>
            <div class="flex">
              <WMInput
                name="sale-type"
                type="info"
                :label="$t('sale.sale-type')"
                :value="sale.sale_type.value"
                highlighted
              />
              <WMInput
                name="sale-source"
                type="info"
                :label="$t('sale.sale-source')"
                :value="sale.sale_source.value"
                highlighted
              />
              <WMInput
                name="initiator"
                type="info"
                :label="$t('sale.initiator')"
                :value="sale.sale_initiator.value"
                highlighted
              />
            </div>
            <div class="flex">
              <WMInput
                name="initiator"
                type="info"
                :label="$t('start-date')"
                :value="sale.process.opened"
                highlighted
              />
              <WMInput
                name="initiator"
                type="info"
                :label="$t('due-date')"
                :value="sale.process.due_date"
                highlighted
              />
              <div>
                <label class="wm-form-label highlighted"> SLA </label>
                <WMSLATag
                  :sla="sale.process.sla"
                  :days-for-closing="sale.process.sla.days_for_closing"
                  :state="sale.state.value"
                />
              </div>
            </div>
          </div>
        </div>
        <Divider layout="vertical" />
        <div class="flex flex-column gap-2">
          <h3 class="h3">{{ $t("sale.sale-summary") }}</h3>
          <WMInputCurrency
            :v-model="sale.deal_price_base"
            name="price_base"
            read-only
            :label="$t('sale.deal-price-base')"
          />
          <img
            class="input-currency__icon vertical-align-middle mr-2"
            src="/icons/minus.svg"
            alt="minus symbol"
            style="max-width: 0.729rem"
          />
          <WMInputCurrency
            :v-model="sale.total_discount"
            name="total_discont"
            read-only
            :label="$t('sale.total-discount')"
          />
          <Divider />
          <WMInputCurrency
            :v-model="sale.deal_price_final"
            name="price_final"
            read-only
            :label="$t('sale.deal-price-final')"
          />
        </div>
      </div>
      <Divider />
      <WMStepper :steps="stages" :current-step="currentStage" aria-label="Form Steps" />

      <Divider />
      <h3 class="h3 m-0">{{ $t("task.tasks") }}</h3>
      <WMTasksTable
        v-if="can('tasks.read')"
        related-entity="sale"
        :related-entity-id="sale.id"
        :columns="taskPreviewTableColumns"
        :multiselect="false"
        :show-header-options="false"
        :rows="5"
        table-class="compact"
        hide-title
      />
    </div>
  </Sidebar>
</template>

<script setup>
// IMPORTS
import { useDateFormat } from "@vueuse/core";
import { computed, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { can } = usePermissions();
const { layoutConfig } = useLayout();
const { getStatusConditionalStyle } = useListUtils();
const { getTaskPreviewColumns } = useListUtils();

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

const taskPreviewTableColumns = ref(getTaskPreviewColumns());

// COMPUTED
const stages = computed(() => {
  if (!props.sale.process.stages) return [];

  return props.sale.process.stages.map((stage) => ({
    label: stage.name,
    date: stage.sla.due_date ? useDateFormat(stage.sla.due_date, "DD/MM/YY") : null,
  }));
});

const currentStage = computed(() => {
  return props.sale.process.current_stage ? props.sale.process.current_stage.index : 0;
});

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
