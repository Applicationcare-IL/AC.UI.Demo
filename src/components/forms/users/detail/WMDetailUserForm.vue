<template>
  USER DETAIL:
  <pre>{{ user }}</pre>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";

// DEPENDENCIES
const route = useRoute();
const { getUser } = useAdminUsers();

// INJECT

// PROPS, EMITS

// REFS
const user = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let response = await getUser(route.params.id);
  user.value = response;
};

loadLazyData();

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
