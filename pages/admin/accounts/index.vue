<template>
  <div>
    <Navbar :breadcrumbs="breadcrumbs" />
    <div class="flex items-center justify-between mt-12 mb-7">
      <h1 class="font-semibold text-2xl">List Account</h1>
      <SearchBox text="Search account..." />
    </div>

    <div class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
      <table class="min-w-full text-sm text-left">
        <thead class="h-6 bg-[#F7F8F9] rounded-t-lg">
          <tr class="text-sm font-medium text-gray-700">
            <th class="px-8 py-2 w-4/12 font-semibold">Name</th>
            <th class="px-4 py-2 w-3/12 font-semibold">Major Name</th>
            <th align="center" class="px-4 py-2 w-3/12 font-semibold">Role</th>
            <th class="px-4 py-2 w-3/12 text-right font-semibold">
              <div class="mr-2">Action</div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr 
            v-for="account in accounts"
            :key="account.id"
            class="border-b border-[#EEEEEE] hover:bg-gray-50"
          >
            <!-- Name -->
            <td class="px-8 py-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-black rounded-full"></div>
                <span class="text-xs font-medium">{{ account.name }}</span>
              </div>
            </td>

            <!-- Major Badge -->
            <td class="px-4 py-4">
              <div class="flex items-center">
                <Badge type="major" :value="account.major" :label="account.major" />
              </div>
            </td>

            <!-- Role -->
            <td class="px-4 py-4 text-center">
              <span class="text-xs font-medium">{{ account.role }}</span>
            </td>

            <!-- Actions -->
            <td class="px-4 py-4 text-right">
              <div class="inline-flex gap-1 items-center">
                <ButtonEdit />
                <ButtonDelete />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {
  IconsNavbarIconsAddUser,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsManageUser,
} from "#components";
import Badge from "~/components/badges/badge.vue";

definePageMeta({
  layout: "default",
  title: "Accounts",
});

const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;

const users = ref([]);
const pending = ref(true);
const error = ref(null);

const fetchUsers = async () => {
  try {
    pending.value = true;
    const res = await $fetch(`${url}/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    });

    if (res.status === 200 && res.data) {
      users.value = res.data;
    } else {
      users.value = [];
    }
  } catch (err) {
    error.value = err;
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const breadcrumbs = [
  {
    label: "Manage Accounts",
    icon: IconsNavbarIconsManageUser,
  },
  {
    label: "Add Account",
    icon: IconsNavbarIconsAddUser,
  },
  {
    label: "Sort by Major",
    icon: IconsNavbarIconsFilterMajor,
  },
  {
    label: "Sort by Role",
    icon: IconsNavbarIconsFilterRole,
  },
];

const accounts = ref([
  { id: 1, name: 'Nama Kaprog', major: 'PPLG', role: 'Super Admin' },
  { id: 2, name: 'Kaprog DKV', major: 'DKV', role: 'Admin' },
])

const getMajorType = (major) => {
  switch (major) {
    case "PPLG":
      return "pplg";
    case "DKV":
      return "dkv";
    case "TJKT":
      return "tjkt";
    case "MPLB":
      return "mplb";
    case "PMN":
      return "pmn";
    case "HTL":
      return "htl";
    case "KLN":
      return "kln";
    default:
      return "default";
  }
};
</script>
