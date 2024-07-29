<template>
  <div
    class="wm-input flex"
    :class="{
      'flex-row align-items-center gap-2': inline,
      'flex-column': !inline,
      'w-full': size === 'full',
    }"
  >
    <label
      v-if="label != ''"
      class="wm-form-label"
      :class="[
        {
          highlighted: props.highlighted,
        },
      ]"
    >
      {{ label }} <span v-if="required" class="text-red-500"> *</span>
    </label>

    <Checkbox
      v-model="inputValue"
      :name="name"
      :binary="true"
      :class="classes"
      @blur="handleBlur"
    />

    <span v-if="errorMessage" class="wm-validation-message">
      {{
        typeof errorMessage === "string"
          ? $t(errorMessage)
          : $t(errorMessage.key, errorMessage.values)
      }}
    </span>
    <slot></slot>
  </div>
</template>

<script setup>
// IMPORTS
import { useField } from "vee-validate";
import { computed, onMounted, toRef, watch } from "vue";

// DEPENDENCIES

// PROPS, EMITS

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
  customOptionLabel: {
    type: String,
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) =>
      [
        "xs", // 60px
        "sm", // 152px
        "md", // 336px
        "lg", // 520px
        "xl", // 704px
        "full", // 100%
      ].includes(value),
  },
});

const emit = defineEmits(["update:value", "update:selectedItem", "update:modelValue"]);

// REFS
const styles = toRef(props, "class");
const name = toRef(props, "name");
const refValue = toRef(props, "value");
const refOptions = toRef(props, "options");

// COMPUTED
const classes = computed(() => {
  let commonClasses = {
    "wm-input-error": errorMessage.value ? true : false,
  };

  let widthClass = `wm-input-${props.size}`;

  if (props.size === "full") {
    widthClass = "w-full";
  }

  if (styles.value) {
    commonClasses = {
      ...commonClasses,
      [styles.value]: true,
    };
  }

  return {
    ...commonClasses,
    [widthClass]: true,
  };
});

// COMPONENT METHODS AND LOGIC
const {
  value: inputValue,
  errorMessage,
  handleBlur,
} = useField(name, undefined, {
  initialValue: props.value,
});

// WATCHERS
/**
 * Set the first option as the default value when prop value is empty
 */
watch(
  () => refOptions.value,
  (options) => {
    if (!options) return;
    if (props.value) return;

    inputValue.value = options[0];
  }
);

watch(
  () => refValue.value,
  (newValue) => {
    inputValue.value = newValue;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  if (props.value) {
    inputValue.value = props.value;
  }
});
</script>

<style scoped lang="scss"></style>
