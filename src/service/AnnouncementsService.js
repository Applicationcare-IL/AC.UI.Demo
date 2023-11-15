import axiosConfig from "@/service/axiosConfig";

export const AnnouncementsService = {
  getAnnouncements(params) {
    return axiosConfig
      .get("/messages", { params })
      .then((response) => {
        const data = response.data.data;
        return { data };
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
