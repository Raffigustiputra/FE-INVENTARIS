import { defineStore } from "pinia";
import dayjs from "dayjs";

export const useAdminDashboardStore = defineStore("adminDashboard", {
    state: () => ({
        filter : {
            from : dayjs().startOf('year').format('YYYY'),
            to : dayjs().endOf('year').format('YYYY'),
        },
        data : []
    }),
});