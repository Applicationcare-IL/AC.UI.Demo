<template>
  <span class="p-input-icon-left lg:flex hidden">
    <i class="pi pi-search" />
    <InputText class="w-30rem" v-model="searchValue" placeholder="חיפוש" />
  </span>
</template>

<script setup>
import { ref } from "vue";
import { useMagicKeys, whenever } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();

const searchValue = ref("");

const props = defineProps({
  entity: String,
});

const keys = useMagicKeys();

whenever(keys.Enter, () => {
  router.push({
    name: "search",
    params: { query: searchValue.value },
    force: true,
  });
});
</script>
