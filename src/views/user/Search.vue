<template>
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <h2>Contacts</h2>
    <DataView :value="searchResults.contact">
      <template #list="slotProps">
        <div class="col-12">
          <router-link
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            <div class="flex flex-row p-4 gap-4">
              <div class=" ">
                {{ slotProps.data.id }}
              </div>
              <div class="">
                {{ slotProps.data.name }} {{ slotProps.data.surname }}
              </div>
            </div>
          </router-link>
        </div>
      </template>
    </DataView>
    <h2>Customers</h2>
    <DataView :value="searchResults.customer">
      <template #list="slotProps">
        <div class="col-12">
          <router-link
            :to="{
              name: 'contactDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            <div class="flex flex-row p-4 gap-4">
              <div class=" ">
                {{ slotProps.data.id }}
              </div>
              <div class="">
                {{ slotProps.data.name }} {{ slotProps.data.surname }}
              </div>
            </div>
          </router-link>
        </div>
      </template>
    </DataView>
    <h2>Services</h2>
    <DataView :value="searchResults.service">
      <template #list="slotProps">
        <div class="col-12">
          <router-link
            :to="{
              name: 'serviceDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            <div class="flex flex-row p-4 gap-4">
              <div class=" ">
                {{ slotProps.data.id }}
              </div>
            </div>
          </router-link>
        </div>
      </template>
    </DataView>
    <h2>Task</h2>
    <DataView :value="searchResults.task">
      <template #list="slotProps">
        <div class="col-12">
          <router-link
            :to="{
              name: 'taskDetail',
              params: { id: slotProps.data.id },
            }"
            class="vertical-align-middle"
          >
            <div class="flex flex-row p-4 gap-4">
              <div class=" ">
                {{ slotProps.data.id }}
              </div>
            </div>
          </router-link>
        </div>
      </template>
    </DataView>
    <!-- {{ searchResults.customer }} -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { globalSearch } = useSearch();

const searchResults = ref([]);

onMounted(() => {
  globalSearch({ search: route.params.query }).then((result) => {
    console.log(result);
    searchResults.value = result;
  });
});
</script>
