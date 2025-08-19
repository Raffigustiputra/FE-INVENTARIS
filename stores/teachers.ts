import { defineStore } from "pinia";

export const useTeacherStore = defineStore("teachers", {
  state: () => ({
    input: {
      id: "",
      name: "",
      nip: "",
      telephone: "",
    },
    filter: {
      search: "",
    },
    teachers: [],
  }),
});
