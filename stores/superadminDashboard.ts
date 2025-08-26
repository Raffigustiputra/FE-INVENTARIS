import { defineStore } from "pinia";
import dayjs from "dayjs";
export const useSuperadminDashboardStore = defineStore("superadminDashboard", {
    state: () => ({
        filter : {
            from : dayjs().startOf('year').format('YYYY-MM-DD'),
            to : dayjs().endOf('year').format('YYYY-MM-DD'),
        },
        majorLoans : [],
        latestActivityRecords : [],
        cardsData : [],
        mostBorrowed : [],
    })
});