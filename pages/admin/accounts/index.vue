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
            v-for="user in users"
            :key="user.id"
            class="border-b border-[#EEEEEE] hover:bg-gray-50"
          >
            <td class="flex items-center gap-2 px-8 py-4">
                <IconsUserIcon />
              <span class="text-xs font-medium">{{ user.name }}</span>
            </td>
            <td class="px-4 py-4">
              <div class="bg-blue-300 w-24 flex justify-center rounded-md py-1">
                <span class="text-white text-xs font-medium">{{
                  user.major?.name || "N/A"
                }}</span>
              </div>
            </td>
            <td align="center" class="px-4 py-4">
              <span class="text-xs font-medium">{{ user.role }}</span>
            </td>
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
import { useAuthStore } from "@/stores/auth";

definePageMeta({
  layout: "default",
  title: "Accounts",
});

const authStore = useAuthStore();
const url = useRuntimeConfig().public.localUrl;

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
</script>
