<template>
  <div class="wm-table-container mt-5 mx-8 flex-auto overflow-auto">
    <h2 class="mb-0">Contacts</h2>
    <DataView :value="searchResults.contact">
      <template #list="slotProps">
        <div class="col-12">
          <router-link
            v-for="(item, index) in slotProps.items"
            :key="index"
            :to="{
              name: 'contactDetail',
              params: { id: item.id },
            }"
            class="vertical-align-middle"
          >
            <div class="flex flex-row gap-4">
              <div class=" ">
                {{ item.id }}
              </div>
              <div class="">{{ item.name }} {{ item.surname }}</div>
            </div>
          </router-link>
        </div>
      </template>
    </DataView>
    <h2 class="mb-0">Customers</h2>
    <DataView :value="searchResults.customer">
      <template #list="slotProps">
        <div class="col-12">
          <router-link
            v-for="(item, index) in slotProps.items"
            :key="index"
            :to="{
              name: 'contactDetail',
              params: { id: item.id },
            }"
            class="vertical-align-middle"
          >
            <div class="flex flex-row gap-4">
              <div class=" ">
                {{ item.id }}
              </div>
              <div class="">{{ item.name }} {{ item.surname }}</div>
            </div>
          </router-link>
        </div>
      </template>
    </DataView>
    <h2 class="mb-0">Services</h2>
    <DataView :value="searchResults.service">
      <template #list="slotProps">
        <div class="col-12">
          <router-link
            v-for="(item, index) in slotProps.items"
            :key="index"
            :to="{
              name: 'serviceDetail',
              params: { id: item.id },
            }"
            class="vertical-align-middle"
          >
            <div class="flex flex-row gap-4">
              <div class=" ">
                {{ item.id }}
              </div>
            </div>
          </router-link>
        </div>
      </template>
    </DataView>
    <h2 class="mb-0">Task</h2>
    <DataView :value="searchResults.task">
      <template #list="slotProps">
        <div class="col-12">
          <template v-for="(item, index) in slotProps.items" :key="index">
            <router-link
              :to="{
                name: 'taskDetail',
                params: { id: item.id },
              }"
              class="vertical-align-middle"
            >
              <div class="flex flex-row gap-4">
                <div>
                  {{ item.id }} - {{ item.task_family[optionLabelWithLang] }} -
                  {{ item.task_type.name }}
                </div>
              </div>
            </router-link>
            <div v-if="item.entity">
              {{ $t("related-entity") }} - {{ getEntityTranslation(item.entity.type) }}:
              {{ item.entity.name ? item.entity.name : item.entity.id }}
            </div>
          </template>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

useHead({
  title: "Search page",
});

const { t } = useI18n();

const route = useRoute();
const { globalSearch } = useSearch();
const { optionLabelWithLang } = useLanguages();

const searchResults = ref([]);

const getEntityTranslation = (entity) => {
  return t(entity + "." + entity);
};

onMounted(() => {
  globalSearch({ search: route.params.query }).then((result) => {
    searchResults.value = result;
  });

  // update title
  useHead({
    title: `Searching: ${route.params.query}`,
  });
});
</script>
