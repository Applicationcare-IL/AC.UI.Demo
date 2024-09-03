<template>
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
  </div>
  <template v-else>
    <WMToggleSwitch
      v-model="hasLicense"
      :label="$t('product.license')"
      label-size="xl"
      @update:model-value="handleHasLicense($event)"
    />
    <WMToggleSwitch
      v-model="hasCommitment"
      :label="$t('product.commitment')"
      label-size="xl"
      @update:model-value="handleHasCommitment($event)"
    >
      <div class="flex gap-5 my-3">
        <WMInput
          v-if="commitmentUnits"
          name="commitment_unit"
          :highlighted="true"
          type="input-select"
          :label="$t('product.commitment-unit') + ':'"
          :options="commitmentUnits"
          :placeholder="$t('select', ['product.commitment-unit'])"
          size="sm"
          option-set
          data-testid="product.form.commitment-unit"
          required
        />

        <WMInput
          v-if="commitmentPeriods"
          name="commitment_period"
          :highlighted="true"
          type="input-select"
          :label="$t('product.commitment-period') + ':'"
          :options="commitmentPeriods"
          :placeholder="$t('select', ['product.commitment-period'])"
          size="sm"
          option-set
          data-testid="product.form.commitment-period"
          required
        />
      </div>
    </WMToggleSwitch>
    <WMToggleSwitch
      v-model="hasWarranty"
      :label="$t('product.warranty')"
      label-size="xl"
      @update:model-value="handleHasWarranty($event)"
    >
      <div class="flex gap-5 my-3">
        <WMInput
          v-if="warrantyUnits"
          name="warranty_unit"
          :highlighted="true"
          type="input-select"
          :label="$t('product.warranty-unit') + ':'"
          :options="warrantyUnits"
          :placeholder="$t('select', ['product.warranty-unit'])"
          size="sm"
          option-set
          data-testid="product.form.warranty-unit"
          required
        />

        <WMInput
          v-if="warrantyPeriods"
          name="warranty_period"
          :highlighted="true"
          type="input-select"
          :label="$t('product.warranty-period') + ':'"
          :options="warrantyPeriods"
          :placeholder="$t('select', ['product.warranty-period'])"
          size="sm"
          option-set
          data-testid="product.form.warranty-period"
          required
        />
      </div>
    </WMToggleSwitch>
    <WMToggleSwitch
      v-model="hasInstallation"
      :label="$t('product.installation')"
      label-size="xl"
      @update:model-value="handleHasInstallation($event)"
    >
      <div class="flex gap-5 my-3">
        <WMInput
          v-if="installationTypes"
          name="installation_type"
          :highlighted="true"
          type="input-select"
          :label="$t('product.installation-types') + ':'"
          :options="installationTypes"
          :placeholder="$t('select', ['product.installation-types'])"
          size="sm"
          option-set
          data-testid="product.form.installation-types"
          required
        />
      </div>
    </WMToggleSwitch>
    <WMToggleSwitch
      v-model="hasProvisioning"
      :label="$t('product.provisioning')"
      label-size="xl"
      @update:model-value="handleHasProvisioning($event)"
    >
      <div class="flex gap-5 my-3">
        <WMInput
          v-if="provisioningTypes"
          name="provisioning_type"
          :highlighted="true"
          type="input-select"
          :label="$t('product.provisioning-types') + ':'"
          :options="provisioningTypes"
          :placeholder="$t('select', ['product.provisioning-types'])"
          size="sm"
          option-set
          data-testid="product.form.provisioning-types"
          required
        />
      </div>
    </WMToggleSwitch>
    <WMToggleSwitch
      v-model="hasMaintenance"
      :label="$t('product.maintenance')"
      label-size="xl"
      @update:model-value="handleHasMaintenance($event)"
    >
      <div class="flex gap-5 my-3">
        <WMInput
          v-if="maintenanceUnits"
          name="maintenance_unit"
          :highlighted="true"
          type="input-select"
          :label="$t('product.maintenance-unit') + ':'"
          :options="maintenanceUnits"
          :placeholder="$t('select', ['product.maintenance-unit'])"
          size="sm"
          option-set
          data-testid="product.form.maintenance-unit"
          required
        />

        <WMInput
          name="maintenance_period"
          required
          type="input-text"
          :label="$t('product.maintenance-period') + ':'"
          size="sm"
        />

        <WMInput
          v-if="maintenanceTypes"
          name="maintenance_type"
          :highlighted="true"
          type="input-select"
          :label="$t('product.maintenance-type') + ':'"
          :options="maintenanceTypes"
          :placeholder="$t('select', ['product.maintenance-type'])"
          size="sm"
          option-set
          data-testid="product.form.maintenance-type"
          required
        />
      </div>
      <div class="flex gap-5 my-3">
        <WMInput
          v-if="billingCycleUnits"
          name="billing_cycle_unit"
          :highlighted="true"
          type="input-select"
          :label="$t('product.billing-cycle-unit') + ':'"
          :options="billingCycleUnits"
          :placeholder="$t('select', ['product.billing-cycle-unit'])"
          size="sm"
          option-set
          data-testid="product.form.billing-cycle-unit"
          required
        />
        <WMInput
          name="billing_cycle_period"
          required
          type="input-text"
          :label="$t('product.billing-cycle-period') + ':'"
          size="sm"
        />
      </div>
    </WMToggleSwitch>

    <div
      v-if="hasMaintenance || hasInstallation"
      class="bg-blue-100 border-solid border-blue-300 border-round-xl p-5 w-full"
      :class="layoutConfig.isRTL.value ? 'text-right' : 'text-left'"
    >
      <span class="block font-bold text-xl pb-2"> Installation and/or provisioning process </span>
      <p class="flex flex-column">
        <span class="font-bold">
          Choose the quick code of the Installation and/or provisioning process of this product.
        </span>
        The process will start after the product is ordered.
      </p>

      <WMInput
        v-if="quickCodes"
        name="service_quick_code"
        :highlighted="true"
        type="input-select"
        :label="$t('product.quickcodes') + ':'"
        :options="quickCodes"
        :placeholder="$t('select', ['product.quickcodes'])"
        size="sm"
        data-testid="product.form.quickcodes"
        required
      />
    </div>
  </template>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const { layoutConfig } = useLayout();
const { getQuickCodes } = useServices();

// INJECT

// PROPS, EMITS
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// REFS
const loading = ref(true);

const hasLicense = ref(false);

const hasCommitment = ref(false);
const commitmentUnits = ref([]);
const commitmentPeriods = ref([]);

const hasWarranty = ref(false);
const warrantyUnits = ref([]);
const warrantyPeriods = ref([]);

const hasInstallation = ref(false);
const installationTypes = ref([]);

const hasProvisioning = ref(false);
const provisioningTypes = ref([]);

const hasMaintenance = ref(false);
const maintenanceUnits = ref([]);
const maintenanceTypes = ref([]);

const quickCodes = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleChange: handleHasLicense } = useField("licensing_required", undefined, {
  initialValue: false,
});

const { handleChange: handleHasCommitment } = useField("commitment", undefined, {
  initialValue: false,
});

const { handleChange: handleHasWarranty } = useField("warranty", undefined, {
  initialValue: false,
});

const { handleChange: handleHasInstallation } = useField("installation_required", undefined, {
  initialValue: false,
});

const { handleChange: handleHasMaintenance } = useField("maintenance_required", undefined, {
  initialValue: false,
});

const { handleChange: handleHasProvisioning } = useField("provisioning_required", undefined, {
  initialValue: false,
});

const loadFields = async () => {
  commitmentUnits.value = await optionSetsStore.getOptionSetValues("product_commitment_units");
  commitmentPeriods.value = await optionSetsStore.getOptionSetValues("product_commitment_period");

  maintenanceUnits.value = await optionSetsStore.getOptionSetValues("product_maintenance_units");
  maintenanceTypes.value = await optionSetsStore.getOptionSetValues("product_maintenance_type");

  warrantyUnits.value = await optionSetsStore.getOptionSetValues("product_warranty_period");
  warrantyPeriods.value = await optionSetsStore.getOptionSetValues("product_warranty_period");

  installationTypes.value = await optionSetsStore.getOptionSetValues("installation_type");
  provisioningTypes.value = await optionSetsStore.getOptionSetValues("provisioning_type");

  await getQuickCodes().then((response) => {
    quickCodes.value = response.data.map((quickCode) => ({
      label: quickCode.name,
      value: quickCode.name,
    }));
  });
};

const initializeFields = async (product) => {
  hasLicense.value = product.licensing_required === 1 ? true : false;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadFields();

  if (props.product) {
    await initializeFields(props.product);
  }

  loading.value = false;
});
</script>

<style scoped></style>
