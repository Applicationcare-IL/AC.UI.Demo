<template>
  <InputGroup>
    <InputGroupAddon>
      <img src="/icons/shekel.svg" alt="" class="vertical-align-middle" />
    </InputGroupAddon>
    <InputText
      v-model="modelValue"
      :class="[
        {
          'wm-input-error': !!errorMessage,
        },
      ]"
    />
  </InputGroup>

  <span v-if="errorMessage" class="wm-validation-message">
    {{
      typeof errorMessage === "string"
        ? $t(errorMessage)
        : $t(errorMessage.key, errorMessage.values)
    }}
  </span>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";

// DEPENDENCIES

// PROPS, EMITS
const modelValue = defineModel();

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  name: {
    type: String,
    required: false,
    default: "",
  },
  required: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  valid: {
    type: Boolean,
    default: true,
    required: false,
  },
  validationMessage: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  width: {
    type: String,
    default: "120",
  },
  inline: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: "",
  },
  optionSet: {
    type: Boolean,
    default: false,
  },
});

// REFS

// COMPUTED

// COMPONENT METHODS
const { value: inputValue, errorMessage } = useField(name, undefined, {
  initialValue: props.value,
});

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
