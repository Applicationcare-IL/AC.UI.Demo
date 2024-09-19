<template>
  <div v-if="loading" class="flex flex-column justify-content-center h-screen align-items-center">
    <ProgressSpinner />
  </div>
  <div v-else class="wm-new-form-container flex flex-auto flex-column overflow-auto gap-5">
    <div class="task-data flex flex-column gap-5">
      <h3 class="h3 mb-0">{{ $t("general-details") }}</h3>
      <div class="flex flex-row gap-5">
        <WMInput
          name="owner"
          type="info"
          :highlighted="true"
          :label="$t('sale.owner') + ':'"
          :value="'pepito'"
        />
      </div>
      <div class="flex flex-row gap-5">
        <WMInput
          name="customer"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.customer') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['sale.customer'])"
          size="sm"
          option-set
          required
          :value="product?.type"
        />
        <WMInput
          name="initiator"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.initiator') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['sale.initiator'])"
          size="sm"
          option-set
          required
          :value="product?.type"
        /><WMInput
          name="sale-type"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.sale-type') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['sale.sale-type'])"
          size="sm"
          option-set
          required
          :value="product?.type"
        /><WMInput
          name="source"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.source') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['sale.source'])"
          size="sm"
          option-set
          required
          :value="product?.type"
        />
      </div>
    </div>

    <Divider />

    <WMToggleSwitch v-model="isRecurring" :label="$t('sales.tender')">
      <div class="flex flex-column gap-5">
        <div class="flex flex-row gap-5">
          <WMInput
            name="publication-date"
            :highlighted="true"
            type="date"
            :label="$t('sale.publication-date') + ':'"
            size="sm"
          />
          <WMInput
            name="question-date"
            :highlighted="true"
            type="date"
            :label="$t('sale.question-date') + ':'"
            size="sm"
          />
          <WMInput
            name="response-date"
            :highlighted="true"
            type="date"
            :label="$t('sale.response-date') + ':'"
            size="sm"
          />
        </div>
        <div class="flex flex-row gap-5">
          <WMInput
            name="resolution-date"
            :highlighted="true"
            type="date"
            :label="$t('sale.resolution-date') + ':'"
            size="sm"
          />
          <WMInput
            name="supply-date"
            :highlighted="true"
            type="date"
            :label="$t('sale.supply-date') + ':'"
            size="sm"
          />
        </div>
      </div>
    </WMToggleSwitch>

    <Divider />

    <h3 class="h3 mt-0">{{ $t("sale.factors-in-the-organization") }}</h3>
    <div class="flex flex-row gap-5">
      <WMInput
        name="legal-adviser"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.legal-adviser') + ':'"
        :options="selectDetault"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
        option-set
        :value="product?.type"
      />
      <WMInput
        name="financial-guide"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.financial-guide') + ':'"
        :options="selectDetault"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
        option-set
        :value="product?.type"
      />
      <WMInput
        name="sales-manager"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.sales-manager') + ':'"
        :options="selectDetault"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
        option-set
        :value="product?.type"
      />
      <WMInput
        name="projects-managers"
        :highlighted="true"
        type="input-select"
        :label="$t('sale.projects-managers') + ':'"
        :options="selectDetault"
        :placeholder="$t('select', ['contact.contact'])"
        size="sm"
        option-set
        :value="product?.type"
      />
    </div>
    <Divider />

    <Divider />

    <h3 class="h3 mt-0">{{ $t("sale.customers-details") }}</h3>
    <div class="flex flex-column gap-5">
      <div class="flex flex-row gap-5">
        <WMInput
          name="customer-consultant"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.customer-consultant') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
          option-set
          :value="product?.type"
        />
        <WMInput
          name="information-technology"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.information-technology') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
          option-set
          :value="product?.type"
        />
        <WMInput
          name="business-manager"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.business-manager') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
          option-set
          :value="product?.type"
        />
        <WMInput
          name="decision-maker"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.decision-maker') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
          option-set
          :value="product?.type"
        />
      </div>
      <div class="flex flex-row gap-5">
        <WMInput
          name="budgeting-factor"
          :highlighted="true"
          type="input-select"
          :label="$t('sale.budgeting-factor') + ':'"
          :options="selectDetault"
          :placeholder="$t('select', ['contact.contact'])"
          size="sm"
          option-set
          :value="product?.type"
        />
        <WMInput
          name="budget"
          :highlighted="true"
          type="input-number"
          :label="$t('sale.budget') + ':'"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES

// INJECT

// PROPS, EMITS

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {});
</script>

<style scoped></style>
