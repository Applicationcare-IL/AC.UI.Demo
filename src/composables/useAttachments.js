import { useAttachmentStore } from "@/stores/attachmentStore";

export function useAttachments() {
  const attachmentStore = useAttachmentStore();

  const getAttachmentsFromApi = async (entityType, entityId) => {
    const params = {
      entity_type: entityType,
      entity_id: entityId,
    };

    const response = await attachmentStore.getAttachmentsFromApi(params);

    return response.data.data;
  };

  const uploadAttachment = async (formData) => {
    try {
      const response = await attachmentStore.uploadAttachment(formData);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  //   const mapAttachment = (attachment) => {
  //     return {
  //       id: attachment.id,

  //       name: attachment.name,
  //       url: attachment.url,
  //     };

  //     id: 1,
  // //     img_url: "https://placehold.co/600x400/EEE/31343C",
  // //     name: "File 1",
  //   };

  return {
    getAttachmentsFromApi,
    uploadAttachment,
  };
}
