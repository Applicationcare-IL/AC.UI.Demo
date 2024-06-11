<template>
  <div class="wm-input flex flex-column">
    <label v-if="label != ''" class="wm-form-label">
      {{ label }} <span v-if="required" class="text-red-500"> *</span>
    </label>
    <template v-if="readOnly">
      <div class="input-currency" :class="inputCurrencyClasses">
        <span class="vertical-align-middle">{{ shekelFormattedNumber }}</span>
        <img
          class="input-currency__icon vertical-align-middle mr-2"
          src="/icons/shekel.svg"
          alt="shekel symbol"
        />
      </div>
    </template>
    <template v-else>
      <div :class="inputCurrencyClasses">
        <img
          class="input-currency__icon vertical-align-middle"
          src="/icons/shekel.svg"
          alt=""
        />

        <InputNumber
          v-model="modelValue"
          :name="name"
          :class="[
            {
              'wm-input-error': !!field.errorMessage,
            },
            'w-full',
          ]"
          locale="he-IL"
          :min-fraction-digits="2"
          @input="
            $emit('update:modelValue', $event.value);
            field.handleChange($event.value);
          "
        />
      </div>

      <span v-if="field.errorMessage" class="wm-validation-message">
        {{
          typeof field.errorMessage === "string"
            ? $t(field.errorMessage)
            : $t(field.errorMessage.key, field.errorMessage.values)
        }}
      </span>
    </template>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { computed, reactive } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();

// PROPS, EMITS
const modelValue = defineModel();

defineEmits(["update:modelValue"]);

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  inTable: {
    type: Boolean,
    default: false,
  },
});

// REFS

// COMPUTED
const shekelFormattedNumber = computed(() => {
  if (!modelValue.value) return "0.00";

  return modelValue.value.toLocaleString("he-IL", { minimumFractionDigits: 2 });
});

const inputCurrencyClasses = computed(() => {
  return {
    "input-currency": true,
    "input-currency--editable": !props.readOnly,
    "layout-rtl": layoutConfig.isRTL.value,
    "text-base": props.small,
    "justify-content-between": props.inTable,
  };
});

// COMPONENT METHODS AND LOGIC
const field = reactive(
  useField(props.name, undefined, {
    initialValue: modelValue.value,
  })
);

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.input-currency {
  position: relative;
  display: flex;
  gap: 0.5em;
  font-family: "Open Sans", sans-serif;

  &--editable {
    display: flex;
    align-items: center;
    gap: 10px;

    .input-currency__icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5px;
      left: auto;
    }
  }

  &.layout-rtl {
    .input-currency__icon {
      left: 5px;
      right: auto;
    }
  }
}
</style>
