<template>
  <Sidebar
    v-model:visible="visible"
    @update:modelValue="updateModelValue"
    class="details-sidebar w-6"
    :showCloseIcon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
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

    <WMContactsTable
      :columns="contactPreviewTableColumns"
      :customerId="customer.id"
      :showHeaderOptions="false"
      :multiselect="false"
      :rows="5"
      table-class="compact"
    />

    <WMServicesTable
      relatedEntity="customer"
      :relatedEntityId="customer.id"
      :columns="servicePreviewTableColumns"
      :multiselect="false"
      :showHeaderOptions="false"
      :rows="5"
      table-class="compact"
    />

    <WMTasksTable
      relatedEntity="customer"
      :relatedEntityId="customer.id"
      :columns="taskPreviewTableColumns"
      :multiselect="false"
      :showHeaderOptions="false"
      :rows="5"
      table-class="compact"
    />
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

const {
  getContactPreviewColumns,
  getServicePreviewColumns,
  getTaskPreviewColumns,
} = useListUtils();

const contactPreviewTableColumns = ref(getContactPreviewColumns());
const servicePreviewTableColumns = ref(getServicePreviewColumns());
const taskPreviewTableColumns = ref(getTaskPreviewColumns());
</script>
