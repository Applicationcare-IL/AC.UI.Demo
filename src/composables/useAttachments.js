import { useAttachmentStore } from "@/stores/attachmentStore";

export function useAttachments() {
  const attachmentStore = useAttachmentStore();

  const getAttachmentsFromApi = async (entityType, entityId) => {
    const params = {
      entity_type: entityType,
      entity_id: entityId,
    };

    const response = await attachmentStore.getAttachmentsFromApi(params);

    const attachments = response.data.data.map((attachment) => {
      return mapAttachment(attachment);
    });

    return attachments;
  };

  const uploadAttachment = async (formData) => {
    try {
      const response = await attachmentStore.uploadAttachment(formData);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAttachment = async (attachmentId, params) => {
    try {
      const response = await attachmentStore.deleteAttachment(
        attachmentId,
        params
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const mapAttachment = (attachment) => {
    return {
      id: attachment.id,
      name: attachment.filename,
      img_url: attachment.url,
      is_image: attachment.is_image,
      thumbnail_url: attachment.thumbnail,
      download_url: attachment.download_url,
    };
  };

  return {
    getAttachmentsFromApi,
    uploadAttachment,
    mapAttachment,
    deleteAttachment,
  };
}
