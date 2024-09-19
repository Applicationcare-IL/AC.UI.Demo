<template>
  <span class="p-input-icon-left lg:flex hidden">
    <i class="pi pi-search" />
    <InputText v-model="searchValue" class="w-30rem" placeholder="חיפוש" />
  </span>
</template>

<script setup>
import { useMagicKeys, whenever } from "@vueuse/core";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const searchValue = ref("");

defineProps({
  entity: String,
});

const keys = useMagicKeys();

whenever(keys.Enter, () => {
  if (!searchValue.value) return;

  router.push({
    name: "search",
    params: { query: searchValue.value },
    force: true,
  });
});
</script>
