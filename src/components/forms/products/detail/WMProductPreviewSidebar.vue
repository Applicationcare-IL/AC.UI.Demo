<template>
  <Sidebar
    v-if="product"
    v-model:visible="visible"
    class="details-sidebar w-4"
    :show-close-icon="false"
    @update:model-value="updateModelValue"
  >
    <div class="flex flex-auto flex-column overflow-auto w-full px-2">
      <div class="flex justify-content-between">
        <h2 class="h2">{{ product.name }}</h2>
        <router-link
          :to="{
            name: 'productDetail',
            params: { id: product.id },
          }"
          class="p-2"
        >
          <Button>Edit</Button>
        </router-link>
      </div>
      <Divider />

      <pre>{{ product }}</pre>
    </div>
  </Sidebar>
</template>

<script setup>
// IMPORTS
import { onMounted, ref } from "vue";

// DEPENDENCIES
const { getProduct } = useProducts();

// INJECT

// PROPS, EMITS
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: Number,
    required: true,
  },
});

// REFS
const visible = ref(false);
const product = ref({});

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  product.value = await getProduct(props.productId);
});
</script>

<style scoped></style>
