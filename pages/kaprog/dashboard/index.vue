<template>
    <Navbar />
    <div>
        <!-- welome and time secion -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-xl font-semibold">Welcome Back, {{ authStore.getName }}</h1>
                <p class="text-[#B0B0B0] text-sm font-light">
                    Here’s a summary of your dashboard for today
                </p>
            </div>
            <div class="flex items-center gap-3">
                <p class="font-medium text-sm">{{ today }}</p>
                <div class="flex items-center rounded-full bg-[#EBEBEB] p-2.5 justify-center">
                    <svg
                        class="size-4"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6 14.5C5.3 14.5 4.70833 14.2583 4.225 13.775C3.74167 13.2917 3.5 12.7 3.5 12C3.5 11.3 3.74167 10.7083 4.225 10.225C4.70833 9.74167 5.3 9.5 6 9.5C6.7 9.5 7.29167 9.74167 7.775 10.225C8.25833 10.7083 8.5 11.3 8.5 12C8.5 12.7 8.25833 13.2917 7.775 13.775C7.29167 14.2583 6.7 14.5 6 14.5ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z"
                            fill="#1D1D1D" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="flex w-full">
            <div class="w-9/12">
                <div
                    class="border-b mt-3 flex py-4 items-center border-[#D9D9D9] border-t border-r">
                    <SkeletonCardSkeleton v-for="i in 3" v-if="loadingCards"  />
                    <div
                    v-else
                    class="flex justify-between pr-20 pl-2 items-start w-full">
                        <div class="flex items-center gap-3">
                            <div
                                class="bg-[#D9D9D9] flex items-center justify-center p-3 rounded-full">
                                <svg
                                    class="size-5"
                                    viewBox="0 0 17 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.1111 0C15.6306 0 16.0752 0.186507 16.4451 0.559523C16.815 0.932539 17 1.38095 17 1.90476V11.4286C17 11.9524 16.815 12.4008 16.4451 12.7738C16.0752 13.1468 15.6306 13.3333 15.1111 13.3333H11.3333V11.4286H15.1111V1.90476H1.88889V11.4286H5.66667V13.3333H1.88889C1.36944 13.3333 0.924768 13.1468 0.554861 12.7738C0.184954 12.4008 0 11.9524 0 11.4286V1.90476C0 1.38095 0.184954 0.932539 0.554861 0.559523C0.924768 0.186507 1.36944 0 1.88889 0H15.1111ZM8.5 4.7619L12.2778 8.57143L10.9556 9.90476L9.44444 8.40476V20H7.55556V8.40476L6.04444 9.90476L4.72222 8.57143L8.5 4.7619Z"
                                        fill="black" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Reuseable</p>
                                <p class="text-xs">
                                    {{
                                        adminDashboardStore.cardsData
                                            ? adminDashboardStore.cardsData.totalUnitItems
                                            : '0'
                                    }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="bg-[#D9D9D9] flex items-center justify-center p-3 rounded-full">
                                <svg
                                    class="size-5"
                                    viewBox="0 0 17 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.88889 19.9995C1.36944 19.9995 0.924769 19.813 0.554861 19.44C0.184954 19.067 0 18.6186 0 18.0947V8.57094C0 8.04713 0.184954 7.59872 0.554861 7.2257C0.924769 6.85269 1.36944 6.66618 1.88889 6.66618H5.66667V8.57094H1.88889V18.0947H15.1111V8.57094H11.3333V6.66618H15.1111C15.6306 6.66618 16.0752 6.85269 16.4451 7.2257C16.815 7.59872 17 8.04713 17 8.57094V18.0947C17 18.6186 16.815 19.067 16.4451 19.44C16.0752 19.813 15.6306 19.9995 15.1111 19.9995H1.88889ZM8.5 15.2376L4.72222 11.4281L6.04444 10.0948L7.55556 11.5948V-0.000488281H9.44444V11.5948L10.9556 10.0948L12.2778 11.4281L8.5 15.2376Z"
                                        fill="black" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Consumable</p>
                                <p class="text-xs">
                                    {{
                                        adminDashboardStore.cardsData
                                            ? adminDashboardStore.cardsData.totalConsumables
                                            : '0'
                                    }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div
                                class="bg-[#D9D9D9] flex items-center justify-center p-3 rounded-full">
                                <svg
                                    class="size-5"
                                    viewBox="0 0 19 19"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2.85 19C2.3275 19 1.88021 18.814 1.50812 18.4419C1.13604 18.0698 0.95 17.6225 0.95 17.1V6.38875C0.665 6.21458 0.435417 5.98896 0.26125 5.71187C0.0870833 5.43479 0 5.11417 0 4.75V1.9C0 1.3775 0.186042 0.930208 0.558125 0.558125C0.930208 0.186042 1.3775 0 1.9 0H17.1C17.6225 0 18.0698 0.186042 18.4419 0.558125C18.814 0.930208 19 1.3775 19 1.9V4.75C19 5.11417 18.9129 5.43479 18.7388 5.71187C18.5646 5.98896 18.335 6.21458 18.05 6.38875V17.1C18.05 17.6225 17.864 18.0698 17.4919 18.4419C17.1198 18.814 16.6725 19 16.15 19H2.85ZM2.85 6.65V17.1H16.15V6.65H2.85ZM1.9 4.75H17.1V1.9H1.9V4.75ZM6.65 11.4H12.35V9.5H6.65V11.4Z"
                                        fill="black" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-medium">Total Items</p>
                                <p class="text-xs">
                                    {{
                                        adminDashboardStore.cardsData
                                            ? adminDashboardStore.cardsData.total
                                            : '0'
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- main Sections -->
                <div class="flex">
                    <!-- left section -->
                    <div class="w-full border-r border-[#D9D9D9] h-auto overflow-y-auto">
                        <!-- over view Section -->
                        <div class="mt-2 mr-2 px-2">
                            <div class="flex items-center justify-between">
                                <h1 class="font-semibold text-md">Overview</h1>
                                <div class="flex items-center gap-2">
                                    <p class="text-xs text-[#B0B0B0]">Select Years -</p>
                                    <div>
                                        <VueDatePicker
                                            v-model="adminDashboardStore.filter.from"
                                            year-picker
                                            placeholder="YYYY"
                                            teleport="body"
                                            :clearable="false"
                                            style="
                                                /* Warna dasar */
                                                --dp-background-color: #fff;
                                                --dp-text-color: #212121;
                                                --dp-border-color: #ddd;
                                                --dp-hover-color: #f3f3f3;
                                                --dp-hover-text-color: #212121;

                                                /* Warna utama */
                                                --dp-primary-color: #1976d2;
                                                --dp-primary-text-color: #fff;

                                                /* Styling input */
                                                --dp-border-radius: 6px;
                                                --dp-font-size: 12px;
                                                --dp-input-padding: 4px 6px;

                                                /* Ukuran compact */
                                                width: 70px;
                                                height: 28px;
                                                font-size: 12px;
                                                border-radius: 6px;
                                            " />
                                    </div>
                                    <p class="text-xs font-medium">-</p>
                                    <div>
                                        <VueDatePicker
                                            v-model="adminDashboardStore.filter.to"
                                            year-picker
                                            placeholder="YYYY"
                                            teleport="body"
                                            :clearable="false"
                                            style="
                                                /* Warna dasar */
                                                --dp-background-color: #fff;
                                                --dp-text-color: #212121;
                                                --dp-border-color: #ddd;
                                                --dp-hover-color: #f3f3f3;
                                                --dp-hover-text-color: #212121;

                                                /* Warna utama */
                                                --dp-primary-color: #1976d2;
                                                --dp-primary-text-color: #fff;

                                                /* Styling input */
                                                --dp-border-radius: 6px;
                                                --dp-font-size: 12px;
                                                --dp-input-padding: 4px 6px;

                                                /* Ukuran compact */
                                                width: 70px;
                                                height: 28px;
                                                font-size: 12px;
                                                border-radius: 6px;
                                            " />
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white p-4 rounded-lg">
                                <SkeletonBarChartSkeleton v-if="loadingBar" />
                                <apexchart
                                    v-else
                                    type="bar"
                                    :options="chartOptions"
                                    :series="series"></apexchart>
                            </div>
                        </div>

                        <!-- last Activity Section -->
                        <SkeletonLatestActivitySkeleton v-if="loadingLatestActivity" />
                        <div
                        v-else
                        class="mt-2 border-t border-[#D9D9D9]">
                            <h1 class="font-semibold mt-4 text-md">Latest Activity</h1>

                            <div class="mt-4 mr-2">
                                <table
                                    class="min-w-full text-xs text-left rounded-t-lg overflow-hidden">
                                    <thead class="h-6 bg-[#F7F8F9]">
                                        <tr class="font-semibold text-gray-700">
                                            <th class="px-6 py-1 w-2/12">Type</th>
                                            <th align="center" class="px-3 py-1 w-3/12">
                                                Unit Code
                                            </th>
                                            <th align="center" class="px-3 py-1 w-2/12">Brand</th>
                                            <th align="center" class="px-3 py-1 w-3/12">
                                                Date Time
                                            </th>
                                            <th align="center" class="px-3 py-1 w-3/12">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white">
                                        <tr
                                            v-for="i in adminDashboardStore.lastActivityRecords"
                                            :key="i"
                                            class="border-b border-[#EEEEEE]">
                                            <td class="flex items-center gap-2 px-6 py-4">
                                                <span class="text-xs font-medium">
                                                    {{ i.item_name }}
                                                </span>
                                            </td>
                                            <td align="center" class="px-3 py-2">
                                                <span class="text-xs font-medium">
                                                    {{ i.unit_code }}
                                                </span>
                                            </td>
                                            <td align="center" class="px-3 py-2">
                                                <span class="text-xs font-medium">
                                                    {{ i.merk }}
                                                </span>
                                            </td>
                                            <td align="center" class="px-3 py-2">
                                                <span class="text-xs">
                                                    {{
                                                        dayjs(i.borrowed_at).format(
                                                            'YYYY-MM-DD | HH:mm'
                                                        )
                                                    }}
                                                </span>
                                            </td>
                                            <td align="center" class="px-3 py-2">
                                                <span
                                                    class="text-[0.7rem] font-medium py-1 px-2.5 rounded-md"
                                                    :class="
                                                        i.status
                                                            ? 'bg-yellow-100 text-yellow-900'
                                                            : 'bg-green-100 text-green-900'
                                                    ">
                                                    {{ i.status ? 'BORROWED' : 'RETURNED' }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-3/12">
                <div class="w-full mt-3 h-[28.5rem] border-b border-[#D9D9D9] border-t">
                    <div class="w-full flex justify-center my-4">
                        <h1 class="font-semibold text-md">Most Of Borrowing</h1>
                    </div>
                    <div>
                        <SkeletonPieChartSkeleton v-if="loadingDonut" />
                        <apexchart
                            v-else
                            type="donut"
                            height="270"
                            :options="donutOptions"
                            :series="donutSeries" />
                    </div>
                </div>
                <div class="w-full">
                    <div class="my-4 flex justify-center">
                        <h1 class="font-semibold text-md">Latest Item</h1>
                    </div>
                    <SkeletonLatestItemsSkeleton v-if="loadingLatestItems" />
                    <div
                    v-else
                    class="flex flex-col ml-3 gap-3">
                        <div
                            v-for="i in adminDashboardStore.latestItems"
                            class="bg-[#F7F8F9] flex items-center rounded-md justify-between px-2 py-2">
                            <div>
                                <h1 class="text-xs font-medium w-32 truncate">
                                    {{ i.item }} -
                                    <span class="truncate">{{ i.merk }}</span>
                                </h1>
                                <h1 class="text-[0.55rem]">
                                    {{ dayjs(i.created_at).format('DD MMMM YYYY') }}
                                </h1>
                            </div>
                            <div class="py-0.5 px-2 rounded-md bg-[#A2C5FF]">
                                <p class="text-[0.65rem] text-[#1a4da5] font-medium">
                                    {{ i.code }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- upper sections -->
        <!-- right sections -->
    </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
definePageMeta({
    title: 'Dashboard',
});

const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();
const superadminDashboardStore = useSuperadminDashboardStore();
const adminDashboardStore = useAdminDashboardStore();

let loadingDonut = ref(true);
let loadingBar = ref(true);
let loadingLatestActivity = ref(true);
let loadingLatestItems = ref(true);
let loadingCards = ref(true);

const now = new Date();

const getReport = async () => {
    loadingBar.value = true;
    const response = await $fetch(
        `${url}/dashboard/loan-report?from=${adminDashboardStore.filter.from}&to=${adminDashboardStore.filter.to}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.token}`,
            },
        }
    );

    if (response.status === 200 || response.status === 201) {
        adminDashboardStore.data = response.data;
        loadingBar.value = false;

        // Convert object ke array sesuai urutan bulan
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const values = months.map((m) => adminDashboardStore.data[m] ?? 0);

        // update chart
        series.value = [
            {
                name: 'Total Borrowed',
                data: values,
            },
        ];
    }
};
const chartOptions = {
    chart: {
        type: 'bar',
        height: 350,
        toolbar: {
            show: false,
        },
        background: '#fff',
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '45%',
            endingShape: 'flat',
            borderRadius: 0,
            dataLabels: {
                position: 'top',
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: false,
    },
    colors: ['#2157AD'],
    states: {
        hover: {
            filter: {
                type: 'none',
            },
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none',
            },
        },
    },
    xaxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
            style: {
                colors: '#666',
                fontSize: '12px',
                fontWeight: '500',
            },
        },
    },
    yaxis: {
        min: 0,
        // max lo bisa bikin dinamis, kalau mau fix bisa tentuin angka misalnya 120
        tickAmount: 6,
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
            style: {
                colors: '#666',
                fontSize: '12px',
            },
        },
    },
    grid: {
        show: true,
        borderColor: '#e0e0e0',
        strokeDashArray: 0,
        xaxis: {
            lines: {
                show: false,
            },
        },
        yaxis: {
            lines: {
                show: true,
            },
        },
    },
    legend: {
        show: false,
    },
    tooltip: {
        enabled: true,
        theme: 'light',
    },
};

const donutSeries = ref([]);
const donutOptions = ref({
    chart: {
        type: 'donut',
        toolbar: { show: false },
    },
    labels: [], // bakal diisi dari API
    colors: ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6'],
    legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
        labels: { colors: '#374151' },
        formatter: function (val, opts) {
            const value = opts.w.globals.series[opts.seriesIndex];
            return `<div style="display:flex; justify-content:space-between; width:180px; justify-items:center">
                <span>${val}</span>
                <span><b>${value}x</b></span>
              </div>`;
        },
    },
    dataLabels: {
        enabled: false,
        formatter: (val) => val.toFixed(1) + '%',
        style: { fontSize: '12px', fontWeight: 'bold', colors: ['#fff'] },
    },
    tooltip: {
        y: { formatter: (val) => `${val}x dipinjam` },
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['#fff'],
    },
    plotOptions: {
        pie: {
            donut: {
                size: '65%',
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: 'Total',
                        fontSize: '14px',
                        fontWeight: 600,
                        formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + 'x',
                    },
                },
            },
        },
    },
});

const getLastActivity = async () => {
    loadingLatestActivity.value = true;
    const response = await $fetch(`${url}/dashboard/admin-user/latest-activity`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
    });

    if (response.status === 200) {
        adminDashboardStore.lastActivityRecords = response.data;
        loadingLatestActivity.value = false;
    }
    adminDashboardStore.lastActivityRecords.forEach((item) => {
        item.created_at = new Date(item.created_at).toLocaleString();
    });
};

const getLastItems = async () => {
    loadingLatestItems.value = true;
    const response = await $fetch(`${url}/dashboard/admin-user/items-loans-history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
    });

    if (response.status === 200) {
        adminDashboardStore.latestItems = response.data;
        loadingLatestItems.value = false;
    }
};

const getCardsData = async () => {
    loadingCards.value = true;
    const response = await $fetch(`${url}/dashboard/admin-user/card`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
    });

    if (response.status === 200) {
        adminDashboardStore.cardsData = response.data;
        loadingCards.value = false;
    }
};

const getMostBorrowed = async () => {
    try {
        loadingDonut.value = true;
        const response = await $fetch(`${url}/dashboard/admin-user/most-borrowed-percentage`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.token}`,
            },
        });

        if (response.status === 200) {
            loadingDonut.value = false;
            adminDashboardStore.mostBorrowed = response.data;

            // update chart data langsung
            donutSeries.value = response.data.map((item) => item.total_borrowed);
            donutOptions.value.labels = response.data.map((item) => item.name);
        }
    } catch (err) {
        loadingDonut.value = false;
        console.error('Error fetching most borrowed:', err);
    }
};

// CSS that you need to add to your stylesheet for hover effects

const series = ref([
    {
        name: 'Total Borrowed',
        data: [],
    },
]);

const options = {
    weekday: 'short', // Thu
    day: '2-digit', // 31
    month: 'long', // July
    year: 'numeric', // 2025
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // AM/PM
};

const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
// contoh hasil asli: "Thu, July 31, 2025, 07:30 AM"

const parts = formattedDate.replace(',', '').split(' ');
// parts = ['Thu', 'July', '31', '2025', '07:30', 'AM']

onMounted(() => {
    getMostBorrowed();
    getCardsData();
    getLastActivity();
    getLastItems();
    watchEffect(() => {
        if (adminDashboardStore.filter.from && adminDashboardStore.filter.to) {
            getReport();
        }
    });
});

const today = `${parts[0]}, ${parts[2]} ${parts[1]} ${parts[3]} - ${parts[4]} ${parts[5]}`;
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1); /* spring-like easing */
}
</style>
