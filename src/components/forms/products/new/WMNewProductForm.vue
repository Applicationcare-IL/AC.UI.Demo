<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex gap-5 mb-5">
      <div class="flex flex-1 flex-column gap-5 mb-5">
        <h2 class="h2 my-0">{{ $t("general-details") }}</h2>

        <div class="wm-form-row align-items-end gap-5">
          <div class="wm-form-row gap-5">
            <WMTeamOwnerFields />
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
import { ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS
const hasLicense = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
