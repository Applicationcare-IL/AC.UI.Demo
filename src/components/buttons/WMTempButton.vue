<template>
  <Button class="wm-button align-items-center justify-content-center" :class="classes">
    <span v-if="badge" class="wm-button__badge">{{ badge }}</span>
    <i v-if="icon" class="pi" :class="icon"></i>
    <slot name="customIcon"></slot>
    <span>{{ text }}</span>
  </Button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: false,
  },
  badge: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: true,
    // validator
    validator: (value) => {
      return [
        "type-1",
        "type-3",
        "secondary",
        "type-4",
        "primary",
        "type-5",
        "save",
        "clear",
        "saved",
        "cancel",
        "new",
      ].includes(value);
    },
  },
  iconOnly: Boolean,
  size: String,
  isActive: Boolean,
  isDisabled: Boolean,
});

const classes = computed(() => {
  return `${props.type}
  ${props.isActive ? "is-active" : ""}
  ${props.isDisabled ? "is-disabled" : ""}
  ${props.text ? "gap-2" : ""}
  ${props.size ? `${props.size}` : ""}
  ${props.iconOnly ? "p-button-icon-only" : ""}
  `;
});
</script>

<style scoped lang="scss">
.wm-button :deep(svg) {
  display: flex;
  max-height: 1.3em;
}

.wm-button,
.wm-button.type-1 {
  font-weight: 700;
  background-color: var(--gray-50);
  color: var(--blue-700);
  border: none;
  position: relative;
  overflow: initial;

  &:hover {
    background-color: var(--gray-100);
    color: var(--blue-700);
  }

  &:focus {
    background-color: var(--gray-200);
    color: var(--blue-700);
    outline: 0;
    box-shadow: none;
  }

  &.is-disabled {
    background-color: var(--gray-200) !important;
    color: var(--gray-500) !important;
    cursor: not-allowed;
    outline: 0;
    box-shadow: none;

    :deep(svg path) {
      fill: var(--gray-500);
    }
  }
}

.secondary,
.type-3 {
  background-color: white;
  color: var(--blue-700);
  border: 1px solid var(--blue-700);

  :deep(svg path) {
    fill: var(--blue-700);
  }

  &:hover {
    background-color: var(--blue-50);
    color: var(--blue-700);
    border: 1px solid var(--blue-700);
  }

  &:focus {
    background-color: var(--blue-100);
    color: var(--blue-700);
  }

  &.is-active {
    border: 1px solid var(--blue-700);
  }
}

.primary,
.type-4 {
  background-color: var(--blue-600);
  color: white;
  border: none;

  :deep(svg path) {
    fill: white;
  }

  &:hover {
    background-color: var(--blue-500);
    color: white;
  }

  &:focus {
    background-color: var(--blue-700);
    color: white;
  }

  &.is-active {
    border: 1px solid var(--blue-700);
  }
}

.type-5 {
  background-color: var(--blue-100);
  color: var(--blue-700);
  border: none;

  :deep(svg path) {
    fill: var(--blue-700);
  }

  &:hover {
    background-color: var(--blue-200);
    color: var(--blue-700);
  }

  &:focus {
    background-color: var(--blue-300);
    color: var(--blue-800);
  }

  &.is-active {
    border: 1px solid var(--blue-700);
  }
}

.new {
  background-color: var(--orange-500);
  color: white;
  border: none;

  :deep(svg path) {
    fill: white;
  }

  &:hover {
    background-color: var(--orange-400);
    color: white;
  }

  &:focus {
    background-color: var(--orange-600);
    color: white;
  }
}

.save {
  background-color: var(--green-600);
  color: white;
  border: none;
  font-weight: 700;

  :deep(svg path) {
    fill: white;
  }

  &:hover,
  &:active {
    background-color: var(--green-500);
    color: white;
  }

  &:focus {
    background-color: var(--green-700);
    color: white;
  }

  &.is-disabled {
    background-color: var(--gray-200);
    color: var(--gray-500);
    cursor: not-allowed;
    outline: 0;
    box-shadow: none;

    :deep(svg path) {
      fill: var(--gray-500);
    }
  }
}

.cancel {
  background-color: white;
  color: var(--red-500);
  border: 1px solid var(--red-500);
  font-weight: 700;

  :deep(svg path) {
    fill: var(--red-500);
  }

  &:hover,
  &:active {
    background-color: var(--red-50);
    border: 1px solid var(--red-500);
    color: var(--red-500);
  }

  &:focus {
    background-color: var(--red-100);
    color: white;
    color: var(--red-500);
  }

  &.is-disabled {
    background-color: var(--gray-200);
    color: var(--gray-500);
    border-color: var(--gray-500);
    cursor: not-allowed;
    outline: 0;
    box-shadow: none;

    :deep(svg path) {
      fill: var(--gray-500);
    }
  }
}

.clear {
  background-color: transparent;
  color: var(--blue-600);

  > span {
    border-bottom: 2px solid var(--blue-600);
  }

  &:hover,
  &:focus {
    background-color: transparent;
    color: var(--orange-600);
    outline: 0;
    box-shadow: none;

    > span {
      border-bottom: 2px solid var(--orange-600);
    }
  }

  &.is-disabled {
    color: var(--gray-500);
    cursor: not-allowed;
    outline: 0;
    box-shadow: none;
  }
}

.saved {
  background-color: var(--green-50);
  color: var(--green-700);
  border: none;
  font-weight: 700;
  cursor: not-allowed;

  &:hover,
  &:focus {
    background-color: var(--green-50);
    color: var(--green-700);
    outline: 0;
    box-shadow: none;
  }

  :deep(svg path) {
    fill: var(--green-700);
  }
}

// SIZES
.wm-button.small {
  padding: 3px 6px;
  font-size: 1rem;
  height: 24px;
}

// BADGES
.wm-button__badge {
  background-color: var(--yellow-400);
  color: var(--gray-900);
  height: 18px;
  width: 18px;
  border-radius: 1rem;
  box-shadow: 0px 0px 4px 0px #00000040;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  position: absolute;
  left: 2px;
  top: 2px;
  transform: translate(-50%, -50%);
}

// ICON ONLY
.wm-button.p-button-icon-only {
  border-radius: 4px;
  width: 27px;
  height: 27px;

  :deep(svg) {
    max-height: initial;
  }
}
</style>
