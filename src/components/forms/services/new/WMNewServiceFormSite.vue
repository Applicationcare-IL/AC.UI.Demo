<template>
  <div class="service-site-details flex flex-auto flex-column gap-5">
    <h2 class="h2 mb-0">פרטי אתר</h2>
    <div class="wm-form-row gap-5">
      <WMInputSearch
        name="site-name"
        :label="$t('site.name') + ':'"
        width="152"
        :options="sites"
        :option-set="true"
        :highlighted="true"
      />
      <WMInputSearch
        name="site-type"
        placeholder="ציבורי"
        type="input-search"
        :label="$t('site.type') + ':'"
        width="152"
        :options="siteTypes"
        :option-set="true"
        :highlighted="true"
      />
    </div>
    <div class="wm-form-row gap-5">
      <div class="wm-form-row align-items-end gap-5">
        <div class="flex flex-row gap-1 align-items-end">
          <WMInputSearch
            name="site-contact"
            type="input-search"
            :placeholder="$t('select', ['contact'])"
            :label="$t('site.contact') + ':'"
            width="152"
            :highlighted="true"
            :search-function="searchSiteContact"
          />
        </div>
        <WMInputSearch
          name="site-contact-role"
          placeholder="בחירת תפקיד"
          type="input-search"
          :label="$t('site.contact_role') + ':'"
          width="152"
          :options="siteRoles"
          :option-set="true"
          :highlighted="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const sites = ref(optionSetsStore.optionSets["service_site"]);
const siteTypes = ref(optionSetsStore.optionSets["service_site_type"]);
const siteRoles = ref(
  optionSetsStore.optionSets["service_site_contact_relationship_role"]
);

const { getContactsFromApi } = useContacts();

const searchSiteContact = (query) => {
  return getContactsFromApi({ search: query });
};
</script>
