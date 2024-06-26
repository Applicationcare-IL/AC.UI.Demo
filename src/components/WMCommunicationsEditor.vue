<template>
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
  <!-- <div class="flex flex-row align-items-baseline gap-3">
    <Dropdown
      editable
      :options="variables"
      optionLabel="value"
      placeholder="Add variable"
      class="w-full md:w-14rem"
      @change="addVariableToEditor"
    />
    <span>To add a variable, write + or click on the Add variable button.</span>
  </div> -->

  <WMInput
    v-if="!hideSubject"
    v-model="subject"
    type="input-text"
    name="subject"
    label="Subject"
    @change="emit('update:subject', subject)"
  />
  <QuillEditor
    ref="myQuillEditor"
    v-model:content="content"
    theme="snow"
    toolbar="#my-toolbar"
    :options="options"
    :modules="modules"
    :class="editorClasses"
  >
    <template #toolbar>
      <div id="my-toolbar" :class="toolbarClass">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <input
          ref="fileInput"
          style="display: none"
          type="file"
          multiple
          @change="handleFileChange"
        />

        <div
          v-if="hasAttachments"
          class="p-button-only-icon p-orange-button cursor-pointer"
          @click="openUploadDocument"
        >
          <div class="p-button-svg" v-html="AddFileIcon" />
        </div>
      </div>
    </template>
  </QuillEditor>

  <div v-if="attachmentList.length > 0" class="flex flex-column gap-2 mt-3">
    <div class="flex w-full gap-3 flex-column">
      <div
        v-for="file in attachmentList"
        :key="file.id"
        class="attachment flex w-full justify-content-between pl-3 align-items-center justify-content-center"
      >
        <span class="font-semibold">
          {{ file.name }}
        </span>
        <Button link @click="removeAttachment(file.id)"
          ><svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="p-icon p-dialog-header-close-icon"
            aria-hidden="true"
            data-pc-section="closebuttonicon"
          >
            <path
              d="M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z"
              fill="black"
            ></path></svg
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
// import QuillMention from "quill-mention";
import { computed, ref, watch, onMounted } from "vue";

import AddFileIcon from "/icons/menu/add_file.svg?raw";

const { addAttachmentToEmail, deleteAttachment } = useCommunications();

const fileInput = ref(null);
const files = ref();
const attachmentList = ref([]);

const openUploadDocument = () => {
  fileInput.value.click();
};

const handleFileChange = () => {
  files.value = Array.from(fileInput.value.files);

  uploadAttachmentToAPI();
};

const removeAttachment = (id) => {
  attachmentList.value = attachmentList.value.filter((file) => file.id !== id);

  deleteAttachment(id);
};

const uploadAttachmentToAPI = () => {
  files.value.forEach((file) => {
    const formData = new FormData();

    formData.append("file", file);

    addAttachmentToEmail(formData).then((response) => {
      attachmentList.value.push({
        id: response.data.id,
        name: file.name,
      });
    });
  });
};

const emit = defineEmits(["update:modelValue", "update:attachments", "update:subject"]);

// const addVariableToEditor = (selectedOption) => {
//   myQuillEditor.value.getQuill().getModule("mention").insertItem(
//     {
//       denotationChar: "+",
//       value: selectedOption.value.value,
//     },
//     true
//   );
// };

const props = defineProps({
  hideToolbar: {
    type: Boolean,
    default: false,
  },
  hideSubject: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  hasAttachments: {
    type: Boolean,
    default: true,
  },
});

const content = ref(props.modelValue);
const subject = ref("");

const editorClasses = computed(() => {
  return props.hideToolbar ? "toolbar-hidden" : "";
});

const toolbarClass = computed(() => {
  return props.hideToolbar ? "hidden" : "";
});

// const variables = [
//   { id: 1, value: "Variable 1" },
//   { id: 2, value: "Variable 2" },
// ];

const myQuillEditor = ref();

const options = {
  modules: {
    toolbar: "#toolbar",
  },
};

const modules = [
  // {
  //   name: "mention",
  //   module: QuillMention,
  //   options: {
  //     allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  //     mentionDenotationChars: ["+"],
  //     source: function (searchTerm, renderList, mentionChar) {
  //       let values;
  //       if (mentionChar === "+") {
  //         values = variables;
  //       }
  //       if (searchTerm.length === 0) {
  //         renderList(values, searchTerm);
  //       } else {
  //         const matches = [];
  //         for (let i = 0; i < values.length; i++)
  //           if (
  //             ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
  //           )
  //             matches.push(values[i]);
  //         renderList(matches, searchTerm);
  //       }
  //     },
  //   },
  // },
];

// const logContent = () => {
// console.log(myQuillEditor.value.getHTML());
// console.log(myQuillEditor.value.getText());
// console.log(myQuillEditor.value.getContents());
// };

watch(
  () => content.value,
  () => {
    emit("update:modelValue", myQuillEditor.value.getText());
  }
);

watch(
  () => attachmentList.value,
  () => {
    emit("update:attachments", attachmentList.value);
  },
  { deep: true }
);

onMounted(() => {
  if (props.modelValue) {
    myQuillEditor.value.setText(props.modelValue);
  }
});
</script>

<style lang="scss">
.ql-container .ql-editor {
  resize: vertical;
  overflow-y: scroll;
}

.ql-container.ql-snow {
  background: #fff;
}

.ql-toolbar.ql-snow + .toolbar-hidden.ql-container.ql-snow {
  border-radius: 8px;
  border: 1px solid var(--gray-300) !important;
}

.ql-mention-list-container {
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(30, 30, 30, 0.08);
  overflow: auto;
  width: 270px;
  z-index: 9001;
}
.ql-mention-loading {
  font-size: 16px;
  line-height: 44px;
  padding: 0 20px;
  vertical-align: middle;
}
.ql-mention-list {
  list-style: none;
  margin: 0;
  overflow: hidden;
  padding: 0;
}
.ql-mention-list-item {
  cursor: pointer;
  font-size: 16px;
  line-height: 44px;
  padding: 0 20px;
  vertical-align: middle;
}
.ql-mention-list-item.disabled {
  cursor: auto;
}
.ql-mention-list-item.selected {
  background-color: #d3e1eb;
  text-decoration: none;
}
.mention {
  background-color: #d3e1eb;
  border-radius: 6px;
  height: 24px;
  margin-right: 2px;
  padding: 3px 0;
  user-select: all;
  width: 65px;
}
.mention > span {
  margin: 0 3px;
}

.attachment {
  border: 1px solid #dee2e6;

  background: #f8f9fa;
  color: #495057;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
</style>
