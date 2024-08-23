<template>
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
  </div>
  <div v-else class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex gap-5 mb-5">
      <!-- <pre style="height: 200px !important">{{ values }}</pre> -->

      <div class="flex flex-1 flex-column gap-5 mb-5">
        <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

        <div class="flex flex-column gap-5">
          <div class="gap-5 flex">
            <WMTeamOwnerFields />
          </div>
          <div class="flex gap-5">
            <WMInput
              name="name"
              required
              type="input-text"
              :label="$t('product.name') + ':'"
              size="md"
            />
            <WMInput
              name="information-page"
              required
              type="input-text"
              :label="$t('product.information-page') + ':'"
              size="md"
            />
          </div>

          <div class="flex gap-5">
            <WMInput
              id="description"
              type="text-area"
              :label="$t('description') + ':'"
              name="description"
              size="lg"
              required
            />
          </div>
          <div class="flex gap-5">
            <WMInput
              v-if="units"
              name="units"
              :highlighted="true"
              type="input-select"
              :label="$t('product.units') + ':'"
              :options="units"
              :placeholder="$t('select', ['unit'])"
              size="sm"
              option-set
              data-testid="product.form.units"
              required
            />

            <WMInput
              v-if="manufacturerTypes"
              name="manufacter_type"
              :highlighted="true"
              type="input-select"
              :label="$t('product.manufacturer-type') + ':'"
              :options="manufacturerTypes"
              :placeholder="$t('select', ['product.manufacturer-type'])"
              size="sm"
              option-set
              data-testid="product.form.manufacturer-type"
              required
            />

            <WMInput
              v-if="customers"
              name="manufacturer"
              :highlighted="true"
              type="input-select"
              :label="$t('product.manufacturer') + ':'"
              :options="customers"
              :placeholder="$t('select', ['product.manufacturer'])"
              size="sm"
              data-testid="product.form.manufacturer"
              required
            />

            <WMInput
              name="existing_product"
              type="input-select-button"
              :highlighted="true"
              :label="$t('product.existing-product') + ':'"
              :options="yesNoOptions"
              :value="yesNoOptions[1]"
              width="80"
            />
          </div>
        </div>
        <Divider />
        <h2 class="h2 my-0">{{ $t("product.pricing") }}</h2>

        <div class="flex flex-column gap-5">
          <div class="flex gap-5">
            <WMInputCurrency
              required
              :label="$t('product.base-price') + ':'"
              name="base_price"
              :small="true"
            />

            <WMInput
              name="sale_discount"
              type="input-select-button"
              :highlighted="true"
              :label="$t('product.sale-discount') + ':'"
              :options="saleDiscountOptions"
              :value="saleDiscountOptions[1]"
              width="80"
            />
          </div>
        </div>

        <Divider />
        <h2 class="h2 my-0">{{ $t("product.characteristics") }}</h2>

        <div class="flex flex-column gap-5">
          <div class="flex gap-5">
            <WMInput
              v-if="productTypes"
              name="product_type"
              :highlighted="true"
              type="input-select"
              :label="$t('product.product-type') + ':'"
              :options="productTypes"
              :placeholder="$t('select', ['product.product-type'])"
              size="sm"
              option-set
              data-testid="product.form.product-type"
              required
            />

            <WMInput
              v-if="productFamilies"
              name="product_family"
              :highlighted="true"
              type="input-select"
              :label="$t('product.product-family') + ':'"
              :options="productFamilies"
              :placeholder="$t('select', ['product.product-family'])"
              size="sm"
              option-set
              data-testid="product.form.product-family"
              required
            />

            <WMInput
              v-if="productGroups"
              name="product_group"
              :highlighted="true"
              type="input-select"
              :label="$t('product.product-group') + ':'"
              :options="productGroups"
              :placeholder="$t('select', ['product.product-group'])"
              size="sm"
              option-set
              data-testid="product.form.product-group"
              required
            />

            <WMInput
              v-if="productDepartments"
              name="product_department"
              :highlighted="true"
              type="input-select"
              :label="$t('product.product-department') + ':'"
              :options="productDepartments"
              :placeholder="$t('select', ['product.product-department'])"
              size="sm"
              option-set
              data-testid="product.form.product-department"
              required
            />
          </div>
          <div class="flex gap-5">
            <WMInput
              type="date"
              :label="$t('products.valid-till') + ':'"
              name="valid_till"
              required
            />
            <WMInput type="date" :label="$t('products.eol') + ':'" name="eol" />
            <WMInput type="date" :label="$t('products.eos') + ':'" name="eos" />
          </div>
          <div class="flex gap-5">
            <WMInput
              v-if="billingTypes"
              name="billing_type"
              :highlighted="true"
              type="input-select"
              :label="$t('product.billing-type') + ':'"
              :options="productTypes"
              :placeholder="$t('select', ['product.billing-type'])"
              size="sm"
              option-set
              data-testid="product.form.billing-type"
              required
            />

            <WMInput
              v-if="renewalTypes"
              name="renewal_type"
              :highlighted="true"
              type="input-select"
              :label="$t('product.renewal-type') + ':'"
              :options="renewalTypes"
              :placeholder="$t('select', ['product.renewal-type'])"
              size="sm"
              option-set
              data-testid="product.form.renewal-type"
              required
            />

            <WMInput
              v-if="cancellationTypes"
              name="cancellation_type"
              :highlighted="true"
              type="input-select"
              :label="$t('product.cancellation-type') + ':'"
              :options="cancellationTypes"
              :placeholder="$t('select', ['product.cancellation-type'])"
              size="sm"
              option-set
              data-testid="product.form.cancellation-type"
              required
            />
          </div>
        </div>

        <Divider />
        <h2 class="h2 my-0">{{ $t("product.management-and-marketing") }}</h2>

        <div class="flex flex-column gap-5">
          <div class="flex gap-5">
            <WMInput
              v-if="customers"
              name="marketing_manager"
              :highlighted="true"
              type="input-select"
              :label="$t('product.marketing-manager') + ':'"
              :options="customers"
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
              v-if="customers"
              name="technical_manager"
              :highlighted="true"
              type="input-select"
              :label="$t('product.technical-manager') + ':'"
              :options="customers"
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
      </div>
      <Divider layout="vertical" />
      <div class="flex flex-1 flex-column gap-5 mb-5">
        <h2 class="h2 my-0">{{ $t("definitions") }}</h2>

        <div class="wm-form-row flex-column align-items-end gap-5">
          <WMToggleSwitch v-model="hasLicense" :label="$t('product.license')" label-size="xl">
          </WMToggleSwitch>
          <WMToggleSwitch v-model="hasCommitment" :label="$t('product.commitment')" label-size="xl">
            <div class="flex gap-5 my-3">
              <WMInput
                v-if="commitment"
                name="commitment_unit"
                :highlighted="true"
                type="input-select"
                :label="$t('product.commitment-unit') + ':'"
                :options="commitment"
                :placeholder="$t('select', ['product.commitment-unit'])"
                size="sm"
                option-set
                data-testid="product.form.commitment-unit"
                required
              />

              <WMInput
                name="commitment_period"
                required
                type="input-text"
                :label="$t('product.commitment-period') + ':'"
                size="sm"
              />
            </div>
          </WMToggleSwitch>
          <WMToggleSwitch v-model="hasGuarantee" :label="$t('product.guarantee')" label-size="xl">
            <div class="flex gap-5 my-3">
              <WMInput
                v-if="commitment"
                name="guarantee_unit"
                :highlighted="true"
                type="input-select"
                :label="$t('product.guarantee-unit') + ':'"
                :options="commitment"
                :placeholder="$t('select', ['product.guarantee-unit'])"
                size="sm"
                option-set
                data-testid="product.form.guarantee-unit"
                required
              />

              <WMInput
                name="guarantee_period"
                required
                type="input-text"
                :label="$t('product.guarantee-period') + ':'"
                size="sm"
              />
            </div>
          </WMToggleSwitch>
          <WMToggleSwitch
            v-model="hasInstallation"
            :label="$t('product.installation')"
            label-size="xl"
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
          >
            <div class="flex gap-5 my-3">
              <WMInput
                v-if="provisioningTypes"
                name="maintenance_unit"
                :highlighted="true"
                type="input-select"
                :label="$t('product.maintenance-unit') + ':'"
                :options="provisioningTypes"
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
                v-if="provisioningTypes"
                name="maintenance_type"
                :highlighted="true"
                type="input-select"
                :label="$t('product.maintenance-type') + ':'"
                :options="provisioningTypes"
                :placeholder="$t('select', ['product.maintenance-type'])"
                size="sm"
                option-set
                data-testid="product.form.maintenance-type"
                required
              />
            </div>
            <div class="flex gap-5 my-3">
              <WMInput
                v-if="provisioningTypes"
                name="billing_cycle_unit"
                :highlighted="true"
                type="input-select"
                :label="$t('product.billing-cycle-unit') + ':'"
                :options="provisioningTypes"
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
            <span class="block font-bold text-xl pb-2">
              Installation and/or provisioning process
            </span>
            <p class="flex flex-column">
              <span class="font-bold">
                Choose the quick code of the Installation and/or provisioning process of this
                product.
              </span>
              The process will start after the product is ordered.
            </p>
          </div>

          <Divider />
          <h2 class="h2 my-0">{{ $t("product.extra-details") }}</h2>

          <div class="flex flex-column gap-5">
            <div class="flex gap-5">
              <WMInput
                name="crm_id"
                required
                type="input-text"
                :label="$t('product.crm-id') + ':'"
                size="sm"
              />
              <WMInput
                name="erp_id"
                required
                type="input-text"
                :label="$t('product.erp-id') + ':'"
                size="sm"
              />
              <WMInput
                name="expenses_card"
                type="input-text"
                :label="$t('product.expenses-card') + ':'"
                size="sm"
              />
              <WMInput
                name="incomes_card"
                required
                type="input-text"
                :label="$t('product.incomes-card') + ':'"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";

import { useLayout } from "@/layout/composables/layout";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

const { getCustomersFromApi } = useCustomers();
const { layoutConfig } = useLayout();

// INJECT

// PROPS, EMITS

// REFS
const loading = ref(true);
const units = ref([]);
const manufacturerTypes = ref([]);
const customers = ref(null);
const yesNoOptions = ref([]);

const saleDiscountOptions = ref([
  { name: "None", value: "none" },
  { name: "Percent %", value: "percent" },
  { name: "Amount ₪", value: "amount" },
]);

const productTypes = ref(null);
const productFamilies = ref(null);
const productGroups = ref(null);
const productDepartments = ref(null);

const billingTypes = ref([]);
const renewalTypes = ref([]);
const cancellationTypes = ref([]);

const hasLicense = ref(false);
const hasCommitment = ref(false);
const commitment = ref([]);

const hasGuarantee = ref(false);
const guarantee = ref([]);

const hasInstallation = ref(false);
const installationTypes = ref([]);

const hasProvisioning = ref(false);
const provisioningTypes = ref([]);

const hasMaintenance = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { values } = useForm({
  // validationSchema: formUtilsStore.getTeamNewFormValidationSchema,
});

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  units.value = await optionSetsStore.getOptionSetValues("units");
  manufacturerTypes.value = await optionSetsStore.getOptionSetValues("manufacturer_type");
  yesNoOptions.value = await optionSetsStore.getOptionSetValues("yesNo");

  let customersData = await getCustomersFromApi({ per_page: 9999999 });
  customers.value = customersData.data.map((customer) => ({
    label: customer.name,
    value: customer.id,
  }));

  productTypes.value = await optionSetsStore.getOptionSetValues("product_type");
  productFamilies.value = await optionSetsStore.getOptionSetValues("product_family");
  productGroups.value = await optionSetsStore.getOptionSetValues("product_group");
  productDepartments.value = await optionSetsStore.getOptionSetValues("product_department");

  billingTypes.value = await optionSetsStore.getOptionSetValues("billing_type");
  renewalTypes.value = await optionSetsStore.getOptionSetValues("renewal_type");
  cancellationTypes.value = await optionSetsStore.getOptionSetValues("cancellation_type");

  commitment.value = await optionSetsStore.getOptionSetValues("commitment");
  guarantee.value = await optionSetsStore.getOptionSetValues("guarantee");
  installationTypes.value = await optionSetsStore.getOptionSetValues("installation_type");
  provisioningTypes.value = await optionSetsStore.getOptionSetValues("provisioning_type");

  loading.value = false;
});
</script>

<style scoped lang="scss"></style>
