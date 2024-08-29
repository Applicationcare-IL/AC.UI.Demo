<template>
  <Skeleton v-if="loading" width="100%" height="120px" />
  <div v-else class="flex flex-column gap-5">
    <div class="flex gap-5">
      <WMInput
        v-if="employees"
        name="marketing_manager"
        :highlighted="true"
        type="input-select"
        :label="$t('product.marketing-manager') + ':'"
        :options="employees"
        :placeholder="$t('select', ['product.marketing-manager'])"
        size="sm"
        data-testid="product.form.marketing-manager"
        required
      />
      <WMInput
        name="marketing_info"
        required
        type="input-text"
        :label="$t('product.marketing-info') + ':'"
        size="md"
      />
    </div>

    <div class="flex gap-5">
      <WMInput
        v-if="employees"
        name="technical_manager"
        :highlighted="true"
        type="input-select"
        :label="$t('product.technical-manager') + ':'"
        :options="employees"
        :placeholder="$t('select', ['product.technical-manager'])"
        size="sm"
        data-testid="product.form.technical-manager"
        required
      />
      <WMInput
        name="technical_info"
        required
        type="input-text"
        :label="$t('product.technical-info') + ':'"
        size="md"
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { OwnersService } from "@/service/OwnersService";

// DEPENDENCIES

// INJECT

// PROPS, EMITS
defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

// REFS
const loading = ref(true);

const employees = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  let employeeResponse = await OwnersService.getOwnersFromApi({ per_page: 9999999 }, "employee");
  employees.value = employeeResponse.data.map((contact) => ({
    label: contact.name,
    value: contact.id,
  }));

  loading.value = false;
});
</script>

<style scoped></style>
