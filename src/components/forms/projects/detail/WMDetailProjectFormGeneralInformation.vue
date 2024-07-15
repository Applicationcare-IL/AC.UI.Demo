<template>
  <Card>
    <template #title> {{ $t("project.general_information") }} </template>
    <template #content>
      <div class="flex flex-auto flex-column gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
            name="owner"
            type="info"
            :highlighted="true"
            :label="$t('owner') + ':'"
            :value="project.owner"
          />
          <WMInput
            name="id"
            type="info"
            :highlighted="true"
            :label="$t('team') + ':'"
            :value="project.team"
          />
        </div>
        <div v-if="project.parent" class="wm-form-row gap-5">
          <WMInput
              name="parent"
              type="info-link"
              :highlighted="true"
              :label="$t('project.parent') + ':'"
              :value="project.parent.name"
              :to="'/project/' + project.parent.id"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            name="project-name"
            :required="true"
            type="input-text"
            :label="$t('project.project_name') + ':'"
            :value="project.project_name"
            size="full"
          />
        </div>
        <div class="wm-form-row gap-5">
          <WMInput
            id="description"
            type="text-area"
            :label="$t('project.project_description') + ':'"
            name="project-description"
            :value="project.project_description"
            size="full"
          />
        </div>
        <div class="wm-form-row gap-2">
          <WMInput
            id="network-folder"
            v-model="networkFolderLink"
            type="input-text"
            :label="$t('project.link-to-network-folder') + ':'"
            name="network-folder"
            :value="networkFolderLink"
            inline
            size="full"
          />
          <WMButton
              :text="$t('buttons.open')"
              type="primary"
              size="small"
              @click="openNetworkFolderLinkInNewTab"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const networkFolderLink = ref(props.project.network_folder);

const openNetworkFolderLinkInNewTab = () => {
  window.open(networkFolderLink.value, "_blank");
};
</script>

<style scoped lang="scss"></style>
