<template>
  <div
    class="highlighted-block flex flex-column justify-content-center"
    :class="styleClasses"
  >
    <div class="highlighted-block__icon">
      <PlusIcon v-if="tooltip === 'plus'" />
      <MinusIcon v-if="tooltip === 'minus'" />
    </div>
    <div v-if="label && label !== ''" class="font-bold">{{ label }}</div>
    <WMInputCurrency v-model="modelValue" :read-only="!editable" :name="name" />
  </div>
</template>

<script setup>
// IMPORTS
import { computed, watch } from "vue";

import { useLayout } from "@/layout/composables/layout";

// DEPENDENCIES
const { layoutConfig } = useLayout();

// INJECT

// PROPS, EMITS
const modelValue = defineModel();

const emit = defineEmits(["change"]);

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  editable: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Highlighted Block",
  },
  backgroundColor: {
    type: String,
    default: "white",
    validator: (value) => {
      return [
        "transparent",
        "white",
        "blue-50",
        "blue-100",
        "blue-200",
        "gray-50",
        "gray-100",
        "gray-200",
        "gray-300",
        "gray-400",
        "purple-100",
        "purple-200",
        "green-200",
        "red-200",
        "yellow-200",
      ].includes(value);
    },
  },
  size: {
    type: String,
    default: "big",
    validator: (value) => {
      return ["big", "small", "xsmall"].includes(value);
    },
  },
  tooltip: {
    type: String,
    default: "",
    validator: (value) => {
      return ["", "tooltip", "plus", "minus"].includes(value);
    },
  },
});

// REFS

// COMPUTED
const styleBackgroundColorClass = computed(() => {
  return `bg-${props.backgroundColor}`;
});

const styleClasses = computed(() => {
  const sharedClases = layoutConfig.isRTL.value ? "layout-rtl" : "";

  switch (props.size) {
    case "big":
      return `text-lg p-3 border-round-lg width-big ${styleBackgroundColorClass.value} ${sharedClases}`;
    case "small":
      return `text-sm p-2 border-round-md width-small ${styleBackgroundColorClass.value} ${sharedClases}`;
    case "xsmall":
      return `text-xs p-1 border-round-sm width-xsmall ${styleBackgroundColorClass.value} ${sharedClases}`;
    default:
      return `text-lg p-3 border-round-lg width-big ${styleBackgroundColorClass.value} ${sharedClases}`;
  }
});

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS
watch(
  () => modelValue,
  (newValue) => {
    emit("change", newValue);
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss">
.highlighted-block {
  display: flex;
  gap: 6px;
  padding: 16px;
  border-radius: 8px;
  color: var(--gray-800);
  position: relative;

  &__icon {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  &.layout-rtl {
    .highlighted-block__icon {
      left: 16px;
      right: auto;
    }
  }
}

.highlighted-block {
  :deep(.p-inputnumber-input),
  :deep(.p-inputnumber),
  :deep(.p-inputtext) {
    width: 100%;
  }
}

.highlighted-block.text-sm {
  .highlighted-block__icon {
    top: 2px;
    left: 2px;
  }
}

.width-big {
  width: 224px;
}

.width-small,
.width-xsmall {
  width: 168px;
}
</style>
