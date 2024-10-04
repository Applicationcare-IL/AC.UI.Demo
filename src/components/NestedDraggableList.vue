<template>
  <div class="nested-list">
    <h2>{{ title }}</h2>
    <nested-list-item
      v-for="(item, index) in items"
      :key="item.id"
      :item="item"
      :index="index"
      :depth="0"
      @reorder="handleReorder"
    />
  </div>
</template>

<script setup>
import Sortable from "sortablejs";
import { onMounted, ref } from "vue";

import NestedListItem from "./NestedListItem.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Nested Draggable List",
  },
  initialItems: {
    type: Array,
    default: () => [],
  },
});

const items = ref(props.initialItems);

const findItemById = (items, id) => {
  for (const item of items) {
    if (item.id === id) {
      return { item, parent: null };
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      const result = findItemById(item.children, id);
      if (result.item) {
        return { item: result.item, parent: result.parent || item };
      }
    }
  }
  return { item: null, parent: null };
};

const removeItemById = (items, id) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return items.splice(i, 1)[0];
    }
    if (Array.isArray(items[i].children) && items[i].children.length > 0) {
      const removed = removeItemById(items[i].children, id);
      if (removed) {
        if (items[i].children.length === 0) {
          delete items[i].children;
        }
        return removed;
      }
    }
  }
  return null;
};

const handleReorder = (event) => {
  const { oldIndex, newIndex, from, to, itemId, parentId } = event;

  if (from === to) {
    // Reordering within the same list
    const { item: parent } = parentId
      ? findItemById(items.value, parentId)
      : { item: { children: items.value } };
    if (parent && Array.isArray(parent.children)) {
      const [movedItem] = parent.children.splice(oldIndex, 1);
      parent.children.splice(newIndex, 0, movedItem);
    }
  } else {
    // Moving between different lists
    const movedItem = removeItemById(items.value, itemId);
    if (movedItem) {
      const newParent = to.closest(".list-item");
      if (newParent) {
        const newParentId = newParent.querySelector(".item-content").dataset.id;
        const { item: parent } = findItemById(items.value, newParentId);
        if (parent) {
          if (!Array.isArray(parent.children)) parent.children = [];
          parent.children.splice(newIndex, 0, movedItem);
        }
      } else {
        // Moving to the root level
        items.value.splice(newIndex, 0, movedItem);
      }
    }
  }
};

onMounted(() => {
  new Sortable(document.querySelector(".nested-list"), {
    group: "nested",
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: handleReorder,
  });
});
</script>

<style scoped>
.nested-list {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
}
</style>
