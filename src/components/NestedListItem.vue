<template>
  <div class="list-item" :style="{ backgroundColor: backgroundColor }">
    <div class="item-content" :data-id="item.id">
      <span class="handle">☰</span>
      {{ item.text }}
    </div>
    <div v-if="hasChildren" class="nested-list">
      <div class="arrow-container">
        <svg class="arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <nested-list-item
        v-for="(child, childIndex) in item.children"
        :key="child.id"
        :item="child"
        :index="childIndex"
        :depth="depth + 1"
        @reorder="handleChildReorder"
      />
    </div>
  </div>
</template>

<script setup>
import Sortable from "sortablejs";
import { computed, onMounted } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["reorder"]);

const backgroundColor = computed(() => {
  const baseColor = 240;
  const darkenAmount = props.depth * 15;
  const newColor = Math.max(baseColor - darkenAmount, 120);
  return `rgb(${newColor}, ${newColor}, ${newColor})`;
});

const hasChildren = computed(() => {
  return Array.isArray(props.item.children) && props.item.children.length > 0;
});

const handleChildReorder = (event) => {
  emit("reorder", { ...event, parentId: props.item.id });
};

onMounted(() => {
  const el = document.querySelectorAll(".nested-list")[props.index];
  if (el) {
    new Sortable(el, {
      group: "nested",
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      handle: ".handle",
      onEnd: (event) => {
        const itemId = event.item.querySelector(".item-content").dataset.id;
        emit("reorder", {
          oldIndex: event.oldIndex,
          newIndex: event.newIndex,
          from: event.from,
          to: event.to,
          itemId: itemId,
          parentId: props.item.id,
        });
      },
    });
  }
});
</script>

<style scoped>
.list-item {
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.item-content {
  display: flex;
  align-items: center;
}

.handle {
  cursor: move;
  margin-right: 10px;
}

.nested-list {
  margin-left: 20px;
  position: relative;
}

.arrow-container {
  position: absolute;
  left: -20px;
  top: 0;
  bottom: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow {
  width: 24px;
  height: 24px;
  fill: #666;
  transform: rotate(-90deg);
}
</style>
