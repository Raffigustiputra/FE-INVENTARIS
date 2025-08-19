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
  <Transition name="fade">
    <div
      v-if="createModal"
      class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen backdrop-blur-sm bg-black/30"
    >
      <Modal
        title="Add New Major"
        @btnSubmit="submitCreateMajor"
        @btnClose="closeCreateModal"
      >
        <div class="w-full flex items-center gap-2">
          <InputText
            class="w-8/12"
            v-model="majorStore.input.name"
            label="Major Name"
            placeholder="Enter Major Name Here.."
          />
          <div class="w-4/12">
            <h1 class="text-sm mb-2 font-medium text-[#727272] ml-0.5">
              Major Color
            </h1>
            <input
              v-model="majorStore.input.color"
              type="color"
              name=""
              id=""
              class="size-10 w-full rounded-sm p-1 border border-[#D2D2D2]"
            />
          </div>
        </div>
      </Modal>
    </div>
  </Transition>

  <div class="">
    <!-- SIDEBAR -->
    <div
      class="w-2/10 fixed h-screen flex flex-col justify-between bg-white border border-r border-black/10 overflow-y-auto"
    >
      <div>
        <!-- LOGO ATAS -->
        <div class="select-none flex items-center w-[189px] ml-5 mt-6 mb-4">
          <img src="../../public/images/wv-logo.png" alt="" />
        </div>
        <div class="border-b border-black/10 mx-4"></div>

        <!-- HEADER SMK -->
        <div
          class="select-none bg-[#EBEBEB] gap-2 rounded-lg py-2 px-4 flex items-center mx-4 mt-4 h-auto"
        >
          <img
            v-if="$route.path.includes('/admin')"
            src="../../public/images/wikrama-logo.png"
            alt="Wikrama Logo"
            class="select-none w-[45px]"
          />
          <img
            v-else
            src="../../public/images/rpl.png"
            alt="RPL Logo"
            class="w-[45px]"
          />
          <div class="flex-col gap-1">
            <h1 class="text-sm font-bold">SMK Wikrama Bogor</h1>
            <p class="text-xs text-black/60">Inventory Management System</p>
          </div>
        </div>

        <!-- MENU -->
        <div v-if="menuByRole[authStore.role]" class="">
          <div>
            <h1
              class="select-none font-bold text-sm mx-6 mt-4 mb-2 text-[#BAB8B8]"
            >
              GENERAL MENU
            </h1>
          </div>
          <div>
            <template
              v-for="menu in menuByRole[authStore.role]"
              :key="menu.path"
            >
              <div>
                <NavLink
                  v-if="
                    $route &&
                    menu &&
                    $route.path.split('/')[1] === menu.path.split('/')[1]
                  "
                  :childMenu="menu.childMenu"
                  :navigationItem="menu.name"
                  :navigateTo="menu.childMenu ? '' : menu.path"
                  :isOpen="expandedMenu === menu.path"
                  @click="
                    menu.childMenu
                      ? toggleMenu(menu.path)
                      : $router.push(menu.path)
                  "
                >
                  <template #default="{ isActive }">
                    <div
                      @click="
                        menu.childMenu
                          ? toggleMenu(menu.path)
                          : $router.push(menu.path)
                      "
                      class="flex justify-between items-center py-2 cursor-pointer rounded-md transition-colors duration-300"
                    >
                      <div class="flex items-center gap-2">
                        <component
                          :is="menu.icon"
                          :class="[
                            'size-4 transition-colors duration-300',
                            isActive
                              ? 'text-white fill-white'
                              : 'fill-[#727272]',
                          ]"
                        />
                      </div>
                    </div>
                  </template>
                </NavLink>
              </div>

              <!-- CHILD MENU -->
              <transition name="fade">
                <div
                  v-if="expandedMenu === menu.path"
                  class="pl-8 mt-1 space-y-1"
                >
                  <NavLink
                    v-for="child in menu.childMenu"
                    :key="child.path"
                    :navigationItem="child.name"
                    :navigateTo="child.path"
                  >
                    <template #default="{ isActive }">
                      <div
                        class="flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-colors duration-300"
                      >
                        <component
                          :class="[
                            'size-4 transition-colors duration-300',
                            isActive ? 'fill-white' : 'fill-[#727272]',
                          ]"
                          :is="child.icon"
                        />
                      </div>
                    </template>
                  </NavLink>
                </div>
              </transition>
            </template>
          </div>
        </div>

        <!-- MAJOR SECTION -->
        <div v-if="authStore.role === 'superadmin'">
          <div class="flex justify-between items-center px-6 my-4">
            <h1 class="font-bold text-sm text-[#BAB8B8]">MAJOR</h1>
            <div
              class="font-semibold cursor-pointer text-[#BAB8B8] hover:text-[#9e9e9e] transition-colors duration-300"
              @click="openCreateModal"
            >
              +
            </div>
          </div>
          <div v-for="major in majorStore.dataMajor" :key="major.id">
            <NavMajor :majorColor="major.color" :majorName="major.name" />
          </div>
        </div>
      </div>

      <!-- LOGOUT -->
      <div>
        <div class="border-b border-black/10 mx-4"></div>
        <Tooltip text="Logout" position="top" class="">
          <IconsLogoutIcon
            class="size-6 fill-[#8e8e8e] hover:fill-[#5c5c5c] cursor-pointer transition-colors duration-300 mx-6 mb-4 mt-4"
            @click="submitLogout"
          />
        </Tooltip>
      </div>
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
  NavMajor,
  IconsBorrowable,
  IconsConsumable,
} from "#components";

import Tooltip from "@/components/Tooltip/index.vue";

const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;
const router = useRouter();
const majorStore = useMajorStore();

const createModal = ref(false);
const openCreateModal = () => {
  createModal.value = true;
};
const closeCreateModal = () => {
  createModal.value = false;
  majorStore.input.name = "";
  majorStore.input.icon = "";
  majorStore.input.color = "";
};

const props = defineProps({
  countKaprog: Number,
});

const GetMajor = async () => {
  const response = await $fetch(`${url}/major`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  if (response.status === 200) {
    majorStore.dataMajor = response.data;
  }
};

const submitCreateMajor = async () => {
  const response = await $fetch(`${url}/major`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
    body: {
      name: majorStore.input.name,
      icon: majorStore.input.icon,
      color: majorStore.input.color,
    },
  });
  if (response.status === 200) {
    GetMajor();
    closeCreateModal();
  }
  majorStore.$patch({
    name: "",
  });
};

const submitLogout = async () => {
  const response = await $fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  if (response.status === 200) {
    authStore.$reset();
    localStorage.clear();
    router.push("/");
  }
};

const expandedMenu = ref(null);

function toggleMenu(path) {
  expandedMenu.value = expandedMenu.value === path ? null : path;
}

// Menu dinamis berdasarkan role
const menuByRole = {
  superadmin: [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
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
      ],
    },
  ],
  admin: [
    {
      name: "Dashboard",
      path: "/kaprog/dashboard",
      icon: IconsDashboard,
    },
    {
      name: "Inventory",
      path: "/kaprog/inventory",
      icon: IconsInventory,
      childMenu: [
        {
          name: "Borrowable",
          path: "/kaprog/inventory/borrowable",
          icon: IconsBorrowable,
        },
        {
          name: "Consumable",
          path: "/kaprog/inventory/consumable",
          icon: IconsConsumable,
        },
      ],
    },
    {
      name: "Activity",
      path: "/kaprog/activity",
      icon: IconsActivity,
      childMenu: [
        {
          name: "Borrowed",
          path: "/kaprog/activity/borrowed",
          icon: IconsBorrowed,
        },
        {
          name: "History",
          path: "/kaprog/activity/history",
          icon: IconsHistory,
        },
      ],
    },
  ],
  user: [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: IconsDashboard,
    },
    {
      name: "Activity",
      path: "/user/activity",
      icon: IconsActivity,
      childMenu: [
        {
          name: "Borrowed",
          path: "/user/activity/borrowed",
          icon: IconsBorrowed,
        },
        {
          name: "History",
          path: "/user/activity/history",
          icon: IconsHistory,
        },
      ],
    },
  ],
};

onMounted(() => {
  GetMajor();
});
</script>
