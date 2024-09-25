<template>
  <!-- Type text -->
  <template v-if="columnData.type == 'text'">
    <div class="overflow-x-auto max-w-30rem">
      {{ modelValue ? modelValue : "" }}
    </div>
  </template>
  <!-- Type project-link -->
  <template v-if="columnData.type == 'link'">
    <router-link
      v-if="modelValue"
      :to="{
        name: columnData.routeName,
        params: { id: modelValue.id },
      }"
    >
      {{ modelValue.text }}
    </router-link>
  </template>
  <!-- Type state -->
  <template v-if="columnData.type == 'state'">
    <WMStateField :state="modelValue" />
  </template>
  <!-- Type tags -->
  <template v-if="columnData.type == 'chips'">
    <div class="flex flex-row gap-2 overflow-x-auto max-w-15rem">
      <Chip v-for="(chip, index) in modelValue" :key="index" :label="chip.name" />
    </div>
  </template>
  <!-- Type option set -->
  <template v-if="columnData.type == 'option-set'">
    <WMOptionSetValue :option-set="modelValue" />
  </template>
  <!-- Type important (used only in messages table) -->
  <template v-if="columnData.type == 'important'">
    <WMImportantState :important="modelValue" />
  </template>
  <!-- Type target (used only in messages table) -->
  <template v-if="columnData.type == 'target'">
    <WMTargetState :target="modelValue" />
  </template>
  <!-- Type date -->
  <template v-if="columnData.type == 'date'">
    {{ modelValue ? formatDateFromAPI(modelValue) : "" }}
  </template>
  <!-- Attachment type image -->
  <template v-if="columnData.type == 'attachment-image'">
    <div
      class="bg-contain bg-no-repeat bg-center border-round h-3rem w-3rem"
      :style="{
        backgroundImage: `url(${modelValue})`,
      }"
    />
  </template>
  <!-- Type currency -->
  <template v-if="columnData.type == 'currency'">
    <WMInputCurrency v-model="modelValue" :read-only="true" :name="columnData.field" />
  </template>
  <!-- Checkbox -->
  <template v-if="columnData.type == 'checkbox'">
    <div class="flex align-items-center justify-content-center">
      <img
        v-if="modelValue == 0 || !modelValue"
        src="/icons/checkbox_false.svg"
        alt=""
        class="vertical-align-middle"
      />
      <img
        v-else
        src="/icons/checkbox_true.svg"
        alt="Green checkmark"
        class="vertical-align-middle"
      />
    </div>
  </template>
  <!-- Product discount type -->
  <template v-if="columnData.type == 'product-discount-type'">
    {{ modelValue ? modelValue : "" }}
  </template>
  <!-- Product relationship type -->
  <template v-if="columnData.type == 'product-relationship-type'">
    {{ modelValue ? modelValue.label : "" }}
  </template>
  <template v-if="columnData.type == 'sla'">
    <WMSLATag
      v-if="modelValue"
      :sla="modelValue.sla"
      :days-for-closing="modelValue.days_for_closing"
      :state="modelValue.state.value"
    />
  </template>
  <template v-if="columnData.type == 'centered-number'">
    <span class="numeric w-full block">
      {{ modelValue }}
    </span>
  </template>
  <template v-if="columnData.type == 'breached-number'">
    <span :class="highlightCellClass(modelValue)" class="numeric w-full block">
      {{ modelValue }}
    </span>
  </template>
  <template v-if="columnData.type == 'status'">
    <span :class="highlightStatusClass(modelValue.toLowerCase())" class="numeric w-full block">
      {{ $t("statuses." + modelValue.toLowerCase()) }}
    </span>
  </template>
</template>
<script setup>
// IMPORTS

// DEPENDENCIES
const { formatDateFromAPI } = useDates();
const { highlightStatusClass } = useListUtils();
// INJECT

// PROPS, EMITS
defineProps({
  columnData: Object,
});

const modelValue = defineModel();

// REFS

// COMPUTED

// COMPONENT METHODS AND LOGIC
const highlightCellClass = (data) => {
  return [{ "bg-red-100 text-red-600": data > 0 }];
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
