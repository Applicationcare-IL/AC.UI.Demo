<template>
  <Sidebar
    v-model:visible="visible"
    class="details-sidebar w-6"
    :show-close-icon="false"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
    @update:model-value="updateModelValue"
  >
    <div class="flex justify-content-between">
      <h2 class="h2">שם של איש קשר</h2>
      <router-link
        :to="{
          name: 'contactDetail',
          params: { id: contact.id },
        }"
        class="p-2"
      >
        <Button> פתח איש קשר </Button>
      </router-link>
    </div>
    <Divider />
    <div class="flex gap-5">
      <WMInput
        name="owner"
        type="info"
        :highlighted="true"
        :label="$t('owner.owner') + ':'"
        :value="contact.name"
        width="200"
      />

      <WMInput
        name="owner"
        type="info"
        :highlighted="true"
        :label="$t('telephone') + ':'"
        :value="contact.telephone"
        width="150"
      />

      <WMInput
        name="owner"
        type="info"
        :highlighted="true"
        :label="$t('email') + ':'"
        :value="contact.email"
      />
    </div>

    <WMCustomersTable
      v-if="can('customers.read')"
      :contact-id="contact.id"
      :columns="customerPreviewTableColumns"
      :show-controls="false"
      :multiselect="false"
      :rows="5"
      table-class="compact"
    />

    <WMServicesTable
      v-if="can('services.read')"
      related-entity="contact"
      :related-entity-id="contact.id"
      :columns="servicePreviewTableColumns"
      :multiselect="false"
      :show-header-options="false"
      :rows="5"
      table-class="compact"
    />

    <WMTasksTable
      v-if="can('tasks.read')"
      related-entity="contact"
      :related-entity-id="contact.id"
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
  contact: {
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
  getCustomerPreviewColumns,
  getServicePreviewColumns,
  getTaskPreviewColumns,
} = useListUtils();

const customerPreviewTableColumns = ref(getCustomerPreviewColumns());
const servicePreviewTableColumns = ref(getServicePreviewColumns());
const taskPreviewTableColumns = ref(getTaskPreviewColumns());
</script>
