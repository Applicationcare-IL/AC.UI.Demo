<template>
  <Sidebar
    v-model:visible="visible"
    class="details-sidebar w-6"
    :show-close-icon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    @update:model-value="updateModelValue"
  >
    <div class="flex justify-content-between">
      <h2 class="h2">שם של לקוח</h2>
      <router-link
        :to="{
          name: 'customerDetail',
          params: { id: customer.id },
        }"
        class="p-2"
      >
        <Button> פתח לקוח</Button>
      </router-link>
    </div>
    <Divider />
    <div class="flex gap-5">
      <WMInput
        name="system-id"
        type="info"
        :highlighted="true"
        :label="$t('customer.system-id') + ':'"
        :value="customer.id"
        width="120"
      />

      <WMInput
        name="telephone"
        type="info"
        :highlighted="true"
        :label="$t('customer.number-abbreviation') + ':'"
        :value="customer.telephone"
        width="150"
      />

      <WMInput
        name="owner"
        type="info"
        :highlighted="true"
        :label="$t('owner') + ':'"
        :value="customer.owner.name"
        width="200"
      />
    </div>

    <WMContactsTableSection
      v-if="can('contacts.read')"
      :columns="contactPreviewTableColumns"
      :customer-id="customer.id"
      :show-header-options="false"
      :multiselect="false"
      :rows="5"
      table-class="compact"
    />

    <WMServicesTable
      v-if="can('services.read')"
      related-entity="customer"
      :related-entity-id="customer.id"
      :columns="servicePreviewTableColumns"
      :multiselect="false"
      :show-header-options="false"
      :rows="5"
      table-class="compact"
    />

    <WMTasksTable
      v-if="can('tasks.read')"
      related-entity="customer"
      :related-entity-id="customer.id"
      :columns="taskPreviewTableColumns"
      :multiselect="false"
      :show-header-options="false"
      :rows="5"
      table-class="compact"
    />
  </Sidebar>
</template>

<script setup>
import { ref } from "vue";

import { useLayout } from "@/layout/composables/layout";

const { can } = usePermissions();

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  customer: {
    type: Object,
    default: () => {},
  },
});

const { layoutConfig } = useLayout();

const visible = ref(false);

const updateModelValue = (value) => {
  visible.value = value;
};

const { getContactPreviewColumns, getServicePreviewColumns, getTaskPreviewColumns } =
  useListUtils();

const contactPreviewTableColumns = ref(getContactPreviewColumns());
const servicePreviewTableColumns = ref(getServicePreviewColumns());
const taskPreviewTableColumns = ref(getTaskPreviewColumns());
</script>
