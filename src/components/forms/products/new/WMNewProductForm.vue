<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex gap-5 mb-5">
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
              :label="$t('units') + ':'"
              :options="units"
              :placeholder="$t('select', ['unit'])"
              size="sm"
              option-set
              data-testid="product.form.units"
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
            />
          </div>
        </div>
      </div>
      <Divider layout="vertical" />
      <div class="flex flex-1 flex-column gap-5 mb-5">
        <h2 class="h2 my-0">{{ $t("definitions") }}</h2>

        <div class="wm-form-row flex-column align-items-end gap-5">
          <WMToggleSwitch v-model="hasLicense" :label="$t('product.license')" label-size="xl">
            Content
          </WMToggleSwitch>
          <WMToggleSwitch v-model="hasCommitment" :label="$t('product.commitment')" label-size="xl">
            Content
          </WMToggleSwitch>
          <WMToggleSwitch v-model="hasGuarantee" :label="$t('product.guarantee')" label-size="xl">
            Content
          </WMToggleSwitch>
          <WMToggleSwitch
            v-model="hasInstallation"
            :label="$t('product.installation')"
            label-size="xl"
          >
            Content
          </WMToggleSwitch>
          <WMToggleSwitch
            v-model="hasProvisioning"
            :label="$t('product.provisioning')"
            label-size="xl"
          >
            Content
          </WMToggleSwitch>
          <WMToggleSwitch
            v-model="hasMaintenance"
            :label="$t('product.maintenance')"
            label-size="xl"
          >
            Content
          </WMToggleSwitch>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
const units = ref([]);
const manufacturerTypes = ref([]);

const hasLicense = ref(false);
const hasCommitment = ref(false);
const hasGuarantee = ref(false);
const hasInstallation = ref(false);
const hasProvisioning = ref(false);
const hasMaintenance = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  units.value = await optionSetsStore.getOptionSetValues("units");
  manufacturerTypes.value = await optionSetsStore.getOptionSetValues("manufacturer_type");
});
</script>

<style scoped lang="scss"></style>
