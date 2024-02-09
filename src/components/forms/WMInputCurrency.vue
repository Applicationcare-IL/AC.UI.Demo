<template>
  <template v-if="readOnly">
    <div class="input-currency">
      <span class="vertical-align-middle">{{ shekelFormattedNumber }}</span>
      <img
        class="input-currency__icon vertical-align-middle mr-2"
        src="/icons/shekel.svg"
        alt="shekel symbol"
      />
    </div>
  </template>
  <template v-else>
    <div class="input-currency input-currency--editable">
      <img
        class="input-currency__icon vertical-align-middle"
        src="/icons/shekel.svg"
        alt=""
      />
      <InputNumber
        v-model="modelValue"
        :class="[
          {
            'wm-input-error': !!errorMessage,
          },
          'w-full',
        ]"
        locale="he-IL"
        :min-fraction-digits="2"
      />
    </div>

    <span v-if="errorMessage" class="wm-validation-message">
      {{
        typeof errorMessage === "string"
          ? $t(errorMessage)
          : $t(errorMessage.key, errorMessage.values)
      }}
    </span>
  </template>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { computed } from "vue";

const shekelFormattedNumber = computed(() => {
  if (!modelValue.value) return "0.00";

  return modelValue.value.toLocaleString("he-IL", { minimumFractionDigits: 2 });
});

// DEPENDENCIES

// PROPS, EMITS
const modelValue = defineModel();

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS
const { errorMessage } = useField(name, undefined, {
  initialValue: modelValue,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.input-currency {
  position: relative;

  &--editable {
    display: flex;
    align-items: center;
    gap: 10px;

    .input-currency__icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10px;
    }
  }
}
</style>
