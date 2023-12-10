<template>
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
  <div class="flex flex-row align-items-baseline gap-3">
    <Dropdown
      editable
      :options="variables"
      optionLabel="value"
      placeholder="Add variable"
      class="w-full md:w-14rem"
      @change="addVariableToEditor"
    />
    <span>To add a variable, write + or click on the Add variable button.</span>
  </div>

  <QuillEditor
    theme="snow"
    toolbar="#my-toolbar"
    :options="options"
    :modules="modules"
    v-model:content="content"
    ref="myQuillEditor"
    :class="editorClasses"
  >
    <template #toolbar>
      <div id="my-toolbar" :class="toolbarClass">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-attach" @click="attachDocument()">attach</button>
      </div>
    </template>
  </QuillEditor>
</template>

<script setup>
import { ref, computed } from "vue";
import QuillMention from "quill-mention";

const attachDocument = () => {
  console.log("attachDocument");
};

const addVariableToEditor = (selectedOption) => {
  myQuillEditor.value.getQuill().getModule("mention").insertItem(
    {
      denotationChar: "+",
      value: selectedOption.value.value,
    },
    true
  );
};

const props = defineProps({
  hideToolbar: {
    type: Boolean,
    default: false,
  },
});

const editorClasses = computed(() => {
  return props.hideToolbar ? "toolbar-hidden" : "";
});

const toolbarClass = computed(() => {
  return props.hideToolbar ? "hidden" : "";
});

const variables = [
  { id: 1, value: "Variable 1" },
  { id: 2, value: "Variable 2" },
];

const myQuillEditor = ref();

const options = {
  modules: {
    toolbar: "#toolbar",
  },
};

const modules = [
  {
    name: "mention",
    module: QuillMention,
    options: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["+"],
      source: function (searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === "+") {
          values = variables;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
  },
];

const logContent = () => {
  console.log(myQuillEditor.value.getHTML());
  console.log(myQuillEditor.value.getText());
  console.log(myQuillEditor.value.getContents());
};

const content = ref("");
</script>

<style>
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
</style>
