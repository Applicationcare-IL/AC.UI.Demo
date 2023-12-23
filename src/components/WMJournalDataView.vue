<template>
  <DataView :value="entries">
    <!-- <template #header>
      <div
        class="flex flex-row justify-content-between align-items-center gap-4"
      >
        <div class="flex justify-content-start gap-2">
          <div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText class="" :placeholder="$t('search')" />
            </span>
          </div>
          <WMButtonSort sortUpLabel="Sort Up" sortDownLabel="Sort Down">
            Sort
          </WMButtonSort>
          <WMButton name="filter" icon="filter" @click="onAttachClick">
            Attach
          </WMButton>
        </div>
      </div>
    </template> -->
    <template #list="slotProps">
      <div
        v-for="item in slotProps.items"
        class="flex flex-row align-items-center justify-content-between"
        style="height: 40px"
      >
        <div
          class="px-2 flex flex-row justify-items-start align-items-center gap-2"
        >
          <div
            class="border-circle bg-gray-50 flex flex-column align-items-center justify-content-center"
            style="width: 28px; height: 28px"
          >
            <img
              class="mx-2 border-round-sm"
              :src="`icons/journal/${item.type}.svg`"
              :alt="item.name"
              style="width: 16px; height: 16px"
            />
          </div>
          <div>{{ item.date }}</div>
          <!-- <div>{{ item.hour }}</div> -->
          <div>{{ item.content }}</div>
        </div>
        <!-- <div class="flex flex-row justify-items-end align-items-center gap-2">
          <WMButton
            @click="toggle"
            aria-haspopup="true"
            name="kebab"
            aria-controls="overlay_menu"
            icon="kebab"
          />
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
            <template #item="slotProps">
              <button
                @click="profileClick"
                class="p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround gap-2"
              >
                <img :src="slotProps.item.image" />
                <div class="flex flex-column align">
                  {{ slotProps.item.label }}
                </div>
              </button>
            </template>
          </Menu>
        </div> -->
      </div>
    </template>
  </DataView>

  <div class="flex flex-row mt-5">
    <Button @click="onSendJorunal">Send</Button>
    <span class="journal-input">
      <img :src="`icons/journal/post.svg`" style="width: 16px; height: 16px" />
      <InputText v-model="newJournal" placeholder="כתיבת עדכון..." />
    </span>
  </div>

  <!-- <WMButton class="my-3" name="attach" icon="attach" @click="onAttachClick">Attach</WMButton> -->
  <!-- <div v-if='uploadedFiles.length > 0'>
        <span>Uploaded Files</span>
        <div v-for="(file, index) of uploadedFiles" class="flex flex-row justify-content-between align-items-center gap-4">
            {{ file.name }}
        </div>
    </div> -->
</template>

<script setup>
import { ref, onMounted } from "vue";

const newJournal = ref("");

const props = defineProps({
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
    required: true,
  },
});

const { getJournalFromApi, postJournalInApi, mapJournal } = useJournal();

const getJournalData = async () => {
  const data = await getJournalFromApi(props.entityType, props.entityId);
  entries.value = data.map((item) => mapJournal(item));
};

onMounted(() => {
  getJournalData();

  // setTimeout(function () {
  //   getJournalSmall().then((data) => (entries.value = data.slice(0, 10)));
  // }, 1000);
});

const onSendJorunal = () => {
  postJournalInApi(props.entityType, props.entityId, newJournal.value).then(
    () => {
      newJournal.value = "";
      getJournalData();
    }
  );
};

const onAttachClick = () => {
  document.querySelector(".p-fileupload-choose").click();
};

const entries = ref();

const menu = ref();
const menu2 = ref();
const items = ref([
  {
    label: "View",
    image: new URL("/icons/menu/view.svg", import.meta.url).href,
  },
  {
    label: "Share",
    image: new URL("/icons/menu/share.svg", import.meta.url).href,
  },
  {
    label: "Download",
    image: new URL("/icons/menu/download.svg", import.meta.url).href,
  },
]);

const onGridRightClick = (event) => {
  menu2.value.show(event);
};

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style scoped>
.journal-input {
  position: relative;
  img {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}

:deep(.p-fileupload-buttonbar) {
  display: none;
}

:deep(.p-fileupload-content) {
  padding: 0px;
}
</style>
```
