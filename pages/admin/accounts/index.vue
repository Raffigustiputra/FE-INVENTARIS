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
            <th class="px-8 py-2 w-4/12">Name</th>
            <th class="px-4 py-2 w-3/12">Major Name</th>
            <th align="center" class="px-4 py-2 w-3/12">Role</th>
            <th class="px-4 py-2 w-3/12 text-right">
              <div class="mr-2">Action</div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="i in 7"
            :key="i"
            class="border-b border-[#EEEEEE] hover:bg-gray-50"
          >
            <td class="flex items-center gap-2 px-8 py-4">
              <div class="size-6 bg-black rounded-full"></div>
              <span class="text-xs font-medium">Nama Kaprog</span>
            </td>
            <td class="px-4 py-4">
              <BadgeMajor :type="getMajorType('PPLG')" text="PPLG" />
            </td>
            <!-- <td class="px-4 py-4">
              <StatusBadge :status="getStatus('BORROWED')" />
            </td> -->
            <td align="center" class="px-4 py-4">
              <span class="text-xs font-medium">Super Admin</span>
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
  BadgeMajor,
  IconsNavbarIconsAddUser,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsManageUser,
  StatusBadge,
} from "#components";

definePageMeta({
  layout: "default",
  title: "Accounts",
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

const getStatus = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "AVAILABLE";
    case "BORROWED":
      return "BORROWED";
    case "UNAVAILABLE":
      return "UNAVAILABLE";
  }
};
</script>
