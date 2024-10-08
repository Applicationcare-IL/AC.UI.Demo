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
      v-model="modelValue"
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
import { computed, onMounted, reactive, toRef, watch } from "vue";

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

// REFS
const styles = toRef(props, "class");
const name = toRef(props, "name");
const refValue = toRef(props, "value");

// COMPUTED
const classes = computed(() => {
  let commonClasses = {
    "wm-input-error": errorMessage ? true : false,
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
const { errorMessage, handleBlur, resetField } = reactive(
  useField(props.name, undefined, {
    initialValue: modelValue.value,
  })
);

// const {
//   value: inputValue,
//   errorMessage,
//   handleBlur,
//   resetField,
// } = useField(name, undefined, {
//   initialValue: props.value,
// });

// WATCHERS
watch(
  () => refValue.value,
  (newValue) => {
    resetField({
      value: newValue,
    });
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
