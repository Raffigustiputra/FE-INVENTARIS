<style scoped>
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

.alert-enter-to,
.alert-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.alert-enter-active,
.alert-leave-active {
  transition: all 350ms ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-text-enter-active,
.fade-text-leave-active {
  transition: opacity 0.1s ease;
}

.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
}
</style>

<template>
  <transition name="alert">
    <AlertError
      class="z-50"
      v-if="alertError"
      :title="alertMessage"
      @hide="alertError = false"
    />
  </transition>
  <transition name="alert">
    <AlertSuccess
      class="z-50"
      v-if="alertSuccess"
      :title="alertMessage"
      @hide="alertSuccess = false"
    />
  </transition>
  <transition name="alert">
    <AlertWarning class="z-50" v-if="alertWarning" :title="alertMessage" />
  </transition>

  <div
    :class="[
      'fixed top-0 left-0 z-5 h-screen flex flex-col justify-between bg-white border-r border-black/10 overflow-y-auto transition-all duration-300 ease-in-out',
      sidebarStore.isCollapsed ? 'w-25' : 'w-[320px]',
    ]"
  >
    <!-- SIDEBAR -->
    <div>
      <div
        :class="[
          'select-none flex items-center justify-between ml-5 mt-6 mr-4',
          sidebarStore.isCollapsed ? 'mb-3' : 'mb-4',
        ]"
      >
        <img
          v-if="!sidebarStore.isCollapsed"
          src="../../public/images/wv-logo.png"
          alt="Logo"
          class="w-[200px]"
        />
        <img
          v-else
          src="../../public/images/wv-blue.png"
          alt="Logo"
          class="w-[50px] mx-auto mb-2.5"
        />
      </div>
      <div class="border-b border-black/10 mx-4"></div>

      <!-- HEADER SMK -->
      <div
        v-if="createModal"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          title="Add New Major"
          @btnSubmit="submitCreateMajor"
          @btnClose="closeCreateModal"
        >
          <div class="w-full flex items-center gap-2">
            <InputText
              class="w-2/12"
              v-model="majorStore.input.name"
              label="Major Name"
              placeholder="Enter Major Name Here.."
            />
            <div class="w-9/12">
              <label
                for="file"
                class="block ml-0.5 text-sm font-medium text-[#727272]"
              >
                Major Logo
              </label>

              <!-- wrapper untuk input & teks -->
              <label
                for="file"
                class="relative block mt-2 w-full px-4 py-2 rounded-sm text-sm border border-[#D2D2D2] font-medium bg-[#F9FBFC] cursor-pointer"
              >
                <span
                  id="fileName"
                  class="text-[#727272] flex items-center gap-2"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.6875 9.75V3.12813L3.575 5.24063L2.4375 4.0625L6.5 0L10.5625 4.0625L9.425 5.24063L7.3125 3.12813V9.75H5.6875ZM1.625 13C1.17812 13 0.795573 12.8409 0.477344 12.5227C0.159115 12.2044 0 11.8219 0 11.375V8.9375H1.625V11.375H11.375V8.9375H13V11.375C13 11.8219 12.8409 12.2044 12.5227 12.5227C12.2044 12.8409 11.8219 13 11.375 13H1.625Z"
                      fill="#545454"
                    />
                  </svg>

                  Upload File
                </span>
                <input
                  @change="handleFileUpload($event)"
                  type="file"
                  id="file"
                  name="file"
                  class="hidden"
                  onchange="document.getElementById('fileName').textContent = this.files.length ? this.files[0].name : 'Upload File'"
                />
              </label>
            </div>
            <div class="w-16">
              <h1 class="text-sm mb-2 font-medium text-[#727272] ml-0.5">
                Color
              </h1>
              <input
                v-model="majorStore.input.color"
                type="color"
                name=""
                id=""
                class="size-[2.3rem] w-full rounded-sm p-0.5 border border-[#D2D2D2]"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  </div>

  <div
    :class="[
      'fixed top-0 left-0 z-5 h-screen flex flex-col justify-between bg-white border-r border-black/10 overflow-y-auto transition-all duration-300 ease-in-out',
      sidebarStore.isCollapsed ? 'w-25' : 'w-[320px]',
    ]"
  >
    <!-- SIDEBAR -->
    <div>
      <div
        class="select-none flex items-center justify-between ml-5 mt-6 mb-4 mr-4"
      >
        <img
          v-if="!sidebarStore.isCollapsed"
          src="../../public/images/wv-logo.png"
          alt="Logo"
          class="w-[200px]"
        />
        <img
          v-else
          src="../../public/images/wv-blue.png"
          alt="Logo"
          class="w-[50px] mx-auto mb-2.5"
        />
      </div>
      <div class="border-b border-black/10 mx-4"></div>

      <!-- HEADER SMK -->
      <div
        class="select-none bg-[#EBEBEB] gap-2 rounded-lg py-2 px-4 flex items-center mx-4 mt-4 h-auto"
      >
        <img
          v-if="
            $route.path.includes('/admin') && authStore?.userInfo?.major?.icon
          "
          :src="`${storageUrl}/${authStore.userInfo.major.icon}`"
          alt="Wikrama Logo"
          class="select-none rounded-full w-[40px]"
        />

        <!-- Kalau non-admin -->
        <img
          v-else-if="authStore?.userInfo?.major?.icon"
          :src="`${storageUrl}/${authStore.userInfo.major.icon}`"
          alt="RPL Logo"
          class="w-[45px] rounded-full"
        />

        <!-- Fallback kalau nggak ada icon -->
        <img
          v-else
          src="../../public/images/wikrama-logo.png"
          alt="Default Logo"
          class="w-[45px] rounded-full"
        />
        <Transition name="fade-text">
          <div v-if="!sidebarStore.isCollapsed" class="flex-col gap-1">
            <h1 class="text-sm font-bold whitespace-nowrap">
              SMK Wikrama Bogor
            </h1>
            <p class="text-xs text-black/60 whitespace-nowrap">
              Inventory Management System
            </p>
          </div>
        </Transition>
      </div>

      <!-- MENU -->
      <div v-if="menuByRole[authStore.role]" class="">
        <Transition name="fade-text">
          <h1
            v-if="!sidebarStore.isCollapsed"
            class="select-none font-bold text-sm mx-6 mt-4 mb-2 text-[#BAB8B8]"
          >
            GENERAL MENU
          </h1>
        </Transition>
        <div>
          <template v-for="menu in menuByRole[authStore.role]" :key="menu.path">
            <div>
              <Tooltip
                v-if="sidebarStore.isCollapsed"
                :text="menu.name"
                position="right"
              >
                <NavLink
                  v-if="
                    $route &&
                    menu &&
                    $route.path.split('/')[1] === menu.path.split('/')[1]
                  "
                  :is-collapsed="sidebarStore.isCollapsed"
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
                      class="flex justify-center items-center py-2 cursor-pointer rounded-md transition-colors duration-300"
                    >
                      <div class="flex justify-center items-center gap-2">
                        <component
                          :is="menu.icon"
                          :class="[
                            'size-4 transition-colors duration-300',
                            isActive && !menu.childMenu
                              ? 'text-white fill-white'
                              : 'fill-[#727272]',
                          ]"
                        />
                      </div>
                    </div>
                  </template>
                </NavLink>
              </Tooltip>

              <!-- Else -->
              <NavLink
                v-else
                :is-collapsed="sidebarStore.isCollapsed"
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
                          isActive && !menu.childMenu
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
            <!-- <transition name="fade"> -->
            <div
              v-if="expandedMenu === menu.path && !sidebarStore.isCollapsed"
              class="pl-8 mt-1 space-y-1"
            >
              <NavLink
                v-for="child in menu.childMenu"
                :key="child.path"
                :navigationItem="child.name"
                :navigateTo="child.path"
                :is-collapsed="sidebarStore.isCollapsed"
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
            <!-- </transition> -->
          </template>
        </div>
      </div>

      <!-- MAJOR SECTION -->
      <div v-if="authStore.role === 'superadmin'">
        <div class="flex justify-between items-center px-6 my-4">
          <Transition name="fade-text">
            <h1
              v-if="!sidebarStore.isCollapsed"
              class="font-bold text-sm text-[#BAB8B8]"
            >
              MAJOR
            </h1>
          </Transition>
          <Transition name="fade-text">
            <div
              :class="[
                'font-semibold cursor-pointer text-[#BAB8B8] hover:text-[#9e9e9e] transition-colors duration-300',
                sidebarStore.isCollapsed ? 'mx-auto' : '',
              ]"
              @click="openCreateModal"
            >
              +
            </div>
          </Transition>
        </div>
        <div v-for="major in majorStore.dataMajor" :key="major.id">
          <Transition name="fade-text">
            <NavMajor
              :majorColor="major.color"
              :majorName="major.name"
              :isSidebarCollapsed="sidebarStore.isCollapsed"
            />
          </Transition>
        </div>
      </div>
    </div>

    <!-- LOGOUT -->
    <div>
      <div class="border-b border-black/10 mx-4"></div>
      <div
        class="px-2 mb-4 mt-4 w-fit"
        :class="{ 'flex justify-center w-full': sidebarStore.isCollapsed }"
      >
        <Tooltip v-if="!sidebarStore.isCollapsed" text="Logout" position="top">
          <IconsLogoutIcon
            class="size-6 fill-[#8e8e8e] hover:fill-[#5c5c5c] cursor-pointer transition-colors duration-300 mx-6 mb-4 mt-4"
            @click="submitLogout"
          />
        </Tooltip>

        <Tooltip v-else text="Logout" position="right">
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
  IconsInventorySA,
} from "#components";

import Tooltip from "@/components/Tooltip/index.vue";
import { useSidebarStore } from "~/stores/sidebar"; // Import the store

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;
const storageUrl = useRuntimeConfig().public.storageUrl;
const router = useRouter();
const majorStore = useMajorStore();

const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");

const form = ref({
  name: "",
  icon: "",
  color: "",
});

const showAlert = (type, message) => {
  alertMessage.value = message;

  if (type === "error") {
    alertError.value = true;
    setTimeout(() => {
      alertError.value = false;
      alertMessage.value = "";
    }, 3000);
  } else if (type === "warning") {
    alertWarning.value = true;
    setTimeout(() => {
      alertWarning.value = false;
      alertMessage.value = "";
    }, 2500);
  } else if (type === "success") {
    alertSuccess.value = true;
    setTimeout(() => {
      alertSuccess.value = false;
      alertMessage.value = "";
    }, 2500);
  } else {
    alert(message);
  }
};

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

const emit = defineEmits(["logout"]);

const props = defineProps({
  countKaprog: Number,
});

const GetMajor = async () => {
  const response = await $fetch(`${url}/major`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
      "ngrok-skip-browser-warning": true,
    },
  });
  if (response.status === 200) {
    majorStore.dataMajor = response.data;
  }
};

const getUser = async () => {
  const response = await $fetch(`${url}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
      "ngrok-skip-browser-warning": true,
    },
  });
  if (response.status === 200) {
    authStore.userInfo = response.data;
    console.log(authStore.userInfo);
  }
};

// const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     majorStore.input.icon = file.name; // hasilnya "gambar.png"
// };

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  majorStore.input.icon = file;
};

const submitCreateMajor = async () => {
  if (!majorStore.input.name) {
    showAlert("warning", "Major name cannot be empty!");
    return;
  }
  if (!majorStore.input.icon) {
    showAlert("warning", "Major icon cannot be empty!");
    return;
  }
  if (!majorStore.input.color) {
    showAlert("warning", "Major color cannot be empty!");
    return;
  }

  const formData = new FormData();
  formData.append("icon", majorStore.input.icon); // file
  formData.append("name", majorStore.input.name);
  formData.append("color", majorStore.input.color);

  const response = await $fetch(`${url}/major`, {
    method: "POST",
    headers: {
      // ❌ jangan pakai Content-Type json
      Authorization: `Bearer ${authStore.token}`,
    },
    body: formData, // kirim formData
  });

  if (response.status === 200 || response.status === 201) {
    showAlert("success", "Major created successfully!");
    closeCreateModal();
    GetMajor();
  } else {
    showAlert("error", "Major failed to create!");
  }

  majorStore.$patch({ name: "" });
};

const submitLogout = async () => {
  try {
    emit("logout", true);
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
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    emit("logout", false);
  }
};

const expandedMenu = ref(null);

function toggleMenu(path) {
  if (sidebarStore.isCollapsed) {
    sidebarStore.toggle();
    return;
  }
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
      icon: IconsInventorySA,
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
      icon: IconsInventorySA,
      childMenu: [
        {
          name: "Reusable",
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
  getUser();
  GetMajor();
});
</script>
