<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<template>
  <div class="">
    <div class="w-2/10 fixed h-screen bg-white border border-r border-black/10">
      <div class="flex items-center w-[189px] ml-5 mt-6 mb-4">
        <img src="../../public/images/wv-logo.png" alt="" />
      </div>
      <div class="border-b border-black/10 mx-4"></div>
      <div class="bg-[#EBEBEB] gap-2 rounded-lg py-2 px-4 flex items-center mx-4 mt-4 h-auto">
        <img v-if="$route.path.includes('/admin')" src="../../public/images/wikrama-logo.png" alt="Wikrama Logo"
          class="w-[45px]" />
        <img v-else src="../../public/images/rpl.png" alt="RPL Logo" class="w-[45px]" />
        <div class="flex-col gap-1">
          <h1 class="text-sm font-bold">SMK Wikrama Bogor</h1>
          <p class="text-xs text-black/60">Inventory Management System</p>
        </div>
      </div>
      <div class="">
        <div>
          <h1 class="font-bold text-sm mx-6 mt-4 mb-2 text-[#BAB8B8]">
            GENERAL MENU
          </h1>
        </div>
        <div>
          <template v-for="menu in allMenus" :key="menu.name">
            <div>
              <NavLink v-if="
                $route &&
                menu &&
                $route.path.split('/')[1] === menu.path.split('/')[1]
              " :childMenu="menu.childMenu" :navigationItem="menu.name" :navigateTo="menu.childMenu ? '' : menu.path"
                :isOpen="expandedMenu === menu.name" @click="
                  menu.childMenu
                    ? toggleMenu(menu.name)
                    : $router.push(menu.path)
                  ">
                <template #default="{ isActive }">
                  <div @click="
                    menu.childMenu
                      ? toggleMenu(menu.name)
                      : $router.push(menu.path)
                    "
                    class="flex justify-between items-center py-2 cursor-pointer rounded-md transition-colors duration-300">
                    <div class="flex items-center gap-2">

                      <component :is="menu.icon" :class="[
                        'size-4 transition-colors duration-300',
                        isActive ? 'fill-white' : 'fill-[#727272]',
                      ]" />
                    </div>
                  </div>
                </template>
              </NavLink>
            </div>

            <transition name="fade">
              <div v-if="expandedMenu === menu.name" class="pl-8 mt-1 space-y-1">
                <NavLink v-for="child in menu.childMenu" :key="child.name" :navigationItem="child.name"
                  :navigateTo="child.path">
                  <template #default="{ isActive }">
                    <div
                      class="flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-colors duration-300">
                      <component :class="[
                        'size-4 transition-colors duration-300',
                        isActive ? 'text-white' : 'text-[#727272]',
                      ]" :is="child.icon" />
                    </div>
                  </template>
                </NavLink>
              </div>
            </transition>
          </template>
        </div>
      </div>
      <div class="border-b border-black/10 mx-4"></div>
      <div v-if="$route.path.includes('/admin')">
        <div>
          <div class="flex justify-between items-center px-6 my-4">
            <h1 class="font-bold text-sm text-[#BAB8B8]">MAJOR</h1>
          </div>
        </div>
        <div>
          <NavMajor majorColor="bg-blue-300" majorName="PPLG" />
          <NavMajor majorColor="bg-orange-300" majorName="MPLB" />
          <NavMajor majorColor="bg-green-300" majorName="DKV" />
          <NavMajor majorColor="bg-red-300" majorName="KLN" />
        </div>
      </div>
      <div class="border-b border-black/10 mx-4"></div>
      <div>
        <IconsLogoutIcon
          class="size-4 fill-[#727272] cursor-pointer hover:fill-white transition-colors duration-300 mx-6 mt-4"
          @click="$router.push('/admin/logout')" />
      </div>
    </div>
    <div class="fixed h-16 flex items-center bottom-0 bg-white">
      <div class="mx-6"></div>
    </div>
  </div>
</template>
<script setup>
import {
  IconsAccounts,
  IconsManage,
  IconsActivity,
  IconsLogoutIcon,
  IconsBorrowed,
  IconsDashboard,
  IconsHistory,
  IconsInventory,
  NavLink,

} from "#components";

const props = defineProps({
  countKaprog: Number,
});

// menu yang ini dipake nya nanti pas udah connect api biar dinamis
// const allMenus = [
//     {
//     name: 'Dashboard',
//     path: role => `/${role}/dashboard`,
//     icon: IconsDashboard,
//     roles: ['superadmin', 'admin', 'user']
//   },
//   {
//     name: 'Accounts',
//     path: () => '/superadmin/accounts',
//     icon: IconsAccounts,
//     roles: ['superadmin']
//   },
//   {
//     name: 'Inventory',
//     path: role => `/${role}/inventory`,
//     icon: IconsInventory,
//     roles: ['superadmin', 'admin', 'user']
//   },
//   {
//     name: 'Activity',
//     path: () => '/admin/activity',
//     icon: IconsDashboard,
//     roles: ['admin', 'user']
//   }
// ];

const expandedMenu = ref(null);

function toggleMenu(name) {
  expandedMenu.value = expandedMenu.value === name ? null : name;
}

// kita pake yang static dulu
const allMenus = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: IconsDashboard,
  },
  {
    name: "Dashboard",
    path: "/kaprog/dashboard",
    icon: IconsDashboard,
  },
  {
    name: "Dashboard",
    path: "/user/dashboard",
    icon: IconsDashboard,
  },
  {
    name: "Inventory",
    path: "/admin/inventory",
    icon: IconsInventory,
  },
  {
    name: "Manage Data",
    path: "/admin/manage",
    icon: IconsManage,
    childMenu: [
      {
        name: "Accounts",
        path: "/admin/manage/accounts",
        icon: IconsAccounts,
      },
      {
        name: "Teachers",
        path: "/admin/manage/teachers",
        icon: IconsAccounts,
      },
      {
        name: "Students",
        path: "/admin/manage/students",
        icon: IconsAccounts,
      },
    ]
  },
  {
    name: "Inventory",
    path: "/kaprog/inventory",
    icon: IconsInventory,
  },
  {
    name: "Inventory",
    path: "/user/inventory",
    icon: IconsInventory,
  },
  {
    name: "Activity",
    icon: IconsActivity,
    path: "/kaprog/activity",
    childMenu: [
      {
        name: "Borrowed",
        icon: IconsBorrowed,
        path: "/kaprog/activity/borrowed",
      },
      {
        name: "History",
        icon: IconsHistory,
        path: "/kaprog/activity/history",
      },
    ],
  },
  {
    name: "Activity",
    path: "/user/activity",
    icon: IconsActivity,
  },
];
</script>
