<template>
  <div class="card-container top-info-card flex-1">
    <WMServicePreviewSidebar
      :service="service"
      v-model:visible="isServicePreviewVisible"
    />
    <Card v-if="service">
      <template #title>
        <div class="flex flex-row justify-content-between">
          שירות: {{ service.service_number }}
          <Button @click="isServicePreviewVisible = true">הצג שירות</Button>
        </div>
      </template>
      <template #content>
        <div class="flex flex-auto flex-column gap-5" v-if="service">
          <div class="wm-form-row gap-5">
            <WMInput
              name="service-owner"
              type="info"
              :highlighted="true"
              :label="$t('owner')"
              :value="service.owner.name"
            />
            <WMInput
              name="contact"
              type="info-link"
              :highlighted="true"
              :label="$t('contact.contact') + ':'"
              :value="service.contact"
              :to="'/contact/' + service.contact_id"
            />
            <WMInput
              name="customer"
              type="info-link"
              :highlighted="true"
              :label="$t('customer.customer') + ':'"
              :value="service.customer"
              :to="'/customer/' + service.customer_id"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="area"
              type="info"
              :highlighted="true"
              :label="$t('classification-1') + ':'"
              :value="service.area?.value"
            />
            <WMInput
              name="type"
              type="info"
              :highlighted="true"
              :label="$t('classification-2') + ':'"
              :value="service.type?.value"
            />
            <WMInput
              name="request1"
              type="info"
              :highlighted="true"
              :label="$t('classification-3') + ':'"
              :value="service.request1?.value"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="request2"
              type="info"
              :highlighted="true"
              :label="$t('classification-4') + ':'"
              :value="service.request2?.value"
            />
            <WMInput
              name="request3"
              type="info"
              :highlighted="true"
              :label="$t('classification-5') + ':'"
              :value="service.request3?.value"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              type="text-area"
              id="description"
              name="description"
              :label="$t('service.description') + ':'"
              :value="service.description"
              disabled
            />
          </div>
        </div>
      </template>
    </Card>
    <Card v-else>
      <div>Loading Service</div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { service } = defineProps({
  service: {
    type: Object,
    required: true,
  },
});

const isServicePreviewVisible = ref(false);
</script>
