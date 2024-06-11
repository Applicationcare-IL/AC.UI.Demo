<template>
  <DataView :value="entries">
    <template #list="slotProps">
      <div
        v-for="(item, index) in slotProps.items"
        :key="index"
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
              :src="`/icons/journal/${item.type}.svg`"
              :alt="item.name"
              style="width: 16px; height: 16px"
            />
          </div>

          <div>
            <span class="mr-2">{{ item.hour }}</span>
            <strong> {{ item.date }}</strong>
          </div>
          <div v-if="item.caused_by" class="mr-4">
            <strong
              >{{ item.caused_by.name + " " + item.caused_by.surname }}:</strong
            >
          </div>
          <div v-if="item.task">
            <strong>{{ $t("task") }} {{ item.task.id }}</strong>
          </div>
          <div v-if="item.data?.assigned_to">
            <strong>המשימה הוקצתה ל {{ item.data.assigned_to.name }}</strong>
          </div>
          <div>{{ item.content }}</div>
        </div>
      </div>
    </template>
  </DataView>

  <div class="flex flex-row mt-5">
    <Button @click="onSendJorunal">Send</Button>
    <span class="journal-input">
      <img
        :src="`/icons/journal/blue_post.svg`"
        style="width: 16px; height: 16px"
      />
      <InputText
        v-model="newJournal"
        placeholder="כתיבת עדכון..."
        @keyup.enter="onSendJorunal"
      />
    </span>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

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
