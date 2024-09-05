<template>
  <Skeleton v-if="loading" width="100%" height="600px" />
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
          :value="product?.commitment_units"
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
          :value="product?.commitment_period"
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
          :value="product?.warranty_units"
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
          :value="product?.warranty_period"
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
          :value="product?.installation_type"
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
          :value="product?.maintenance_unit"
        />

        <WMInput
          required
          :value="product?.maintenance_period"
          type="input-number"
          :label="$t('product.maintenance-period') + ':'"
          name="maintenance_period"
        />

        <WMInputCurrency
          v-model="maintenancePrice"
          required
          :label="$t('product.maintenance-price') + ':'"
          name="maintenance_price"
          :small="true"
        />
      </div>
      <div class="flex gap-5 my-3">
        <WMInput
          v-if="billingCycleUnits"
          name="maintenance_billing_cycle_unit"
          :highlighted="true"
          type="input-select"
          :label="$t('product.billing-cycle-unit') + ':'"
          :options="billingCycleUnits"
          :placeholder="$t('select', ['product.billing-cycle-unit'])"
          size="sm"
          option-set
          data-testid="product.form.billing-cycle-unit"
          required
          :value="product?.maintenance_billing_cycle_unit"
        />

        <WMInput
          v-if="billingCyclePeriods"
          name="maintenance_billing_cycle_period"
          :highlighted="true"
          type="input-select"
          :label="$t('product.billing-cycle-period') + ':'"
          :options="billingCyclePeriods"
          :placeholder="$t('select', ['product.billing-cycle-period'])"
          size="sm"
          option-set
          data-testid="product.form.billing-cycle-period"
          required
          :value="product?.maintenance_billing_cycle_period"
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
        :value="selectedQuickCode"
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
const maintenancePrice = ref(0);

const billingCycleUnits = ref([]);
const billingCyclePeriods = ref([]);

const quickCodes = ref([]);
const selectedQuickCode = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleChange: handleHasLicense } = useField("licensing_required", undefined, {
  initialValue: props.product ? props.product.licensing_required === 1 : false,
});

const { handleChange: handleHasCommitment } = useField("commitment", undefined, {
  initialValue: props.product ? props.product.commitment === 1 : false,
});

const { handleChange: handleHasWarranty } = useField("warranty", undefined, {
  initialValue: props.product ? props.product.warranty === 1 : false,
});

const { handleChange: handleHasInstallation } = useField("installation_required", undefined, {
  initialValue: props.product ? props.product.installation_required === 1 : false,
});

const { handleChange: handleHasMaintenance } = useField("maintenance_required", undefined, {
  initialValue: props.product ? props.product.maintenance_required === 1 : false,
});

const { handleChange: handleHasProvisioning } = useField("provisioning_required", undefined, {
  initialValue: props.product ? props.product.provisioning_required === 1 : false,
});

const loadFields = async () => {
  commitmentUnits.value = await optionSetsStore.getOptionSetValues("product_commitment_units");
  commitmentPeriods.value = await optionSetsStore.getOptionSetValues("product_commitment_period");

  maintenanceUnits.value = await optionSetsStore.getOptionSetValues("product_maintenance_units");
  billingCycleUnits.value = await optionSetsStore.getOptionSetValues("product_billing_cycle_unit");
  billingCyclePeriods.value = await optionSetsStore.getOptionSetValues(
    "product_maintenance_billing_cycle_period"
  );

  warrantyUnits.value = await optionSetsStore.getOptionSetValues("product_warranty_period");
  warrantyPeriods.value = await optionSetsStore.getOptionSetValues("product_warranty_period");

  installationTypes.value = await optionSetsStore.getOptionSetValues("installation_type");
  provisioningTypes.value = await optionSetsStore.getOptionSetValues("provisioning_type");

  await getQuickCodes().then((response) => {
    quickCodes.value = response.data.map((quickCode) => ({
      label: quickCode.name,
      value: quickCode.id,
      id: quickCode.id,
    }));
  });
};

const initializeFields = async (product) => {
  hasLicense.value = product.licensing_required === 1 ? true : false;
  hasCommitment.value = product.commitment === 1 ? true : false;
  hasWarranty.value = product.warranty === 1 ? true : false;
  hasInstallation.value = product.installation_required === 1 ? true : false;
  hasProvisioning.value = product.provisioning_required === 1 ? true : false;
  hasMaintenance.value = product.maintenance_required === 1 ? true : false;

  if (product.maintenance_price) {
    maintenancePrice.value = product.maintenance_price;
  }

  selectedQuickCode.value = quickCodes.value.find(
    (quickCode) => quickCode.id === product.service_quick_code.id
  );
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadFields();
  console.log("props.product", props.product);

  if (props.product) {
    await initializeFields(props.product);
  }

  loading.value = false;
});
</script>

<style scoped></style>
