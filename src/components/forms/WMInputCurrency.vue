<template>
  <template v-if="readOnly">
    <div class="input-currency">
      <img
        class="input-currency__icon vertical-align-middle"
        src="/icons/shekel.svg"
        alt="shekel symbol"
      />
      <span class="vertical-align-middle">{{ modelValue }}</span>
    </div>
  </template>
  <template v-else>
    <div class="input-currency">
      <img
        class="input-currency__icon vertical-align-middle"
        src="/icons/shekel.svg"
        alt=""
      />
      <InputText
        v-model="modelValue"
        :class="[
          {
            'wm-input-error': !!errorMessage,
          },
          'w-full',
        ]"
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

  .input-currency__icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
  }
}
</style>
