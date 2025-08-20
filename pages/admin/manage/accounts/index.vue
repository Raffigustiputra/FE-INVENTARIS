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
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
<template>
  <div>
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
    <Transition name="fade">
      <div
        v-if="modalCreate"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="submitCreateAccount"
          @btnClose="CloseModalCreate"
          title="Add New Account"
          :isSubmitting="isSubmitting"
        >
          <div class="w-full flex items-center gap-2">
            <InputText
              v-model="accountStore.input.name"
              class="w-1/2"
              label="Name"
              placeholder="Enter Name Here.."
            />
            <InputText
              v-model="accountStore.input.username"
              class="w-1/2"
              label="Username"
              placeholder="Enter Name Here.."
            />
          </div>
          <div class="w-full flex items-center gap-2">
            <InputSelect
              placeholder="Select Role"
              v-model="accountStore.input.role"
              class="w-1/2"
              label="Role"
            >
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </InputSelect>
            <InputText
              v-model="accountStore.input.password"
              class="w-1/2"
              label="Password"
              placeholder="Enter Password Here.."
            />
          </div>
          <InputSelect
            placeholder="Select Major"
            v-model="accountStore.input.major_id"
            class="w-full"
            label="Major"
          >
            <option
              v-for="major in majorStore.dataMajor"
              :key="major.id"
              :value="major.id"
            >
              {{ major.name }}
            </option>
          </InputSelect>
        </Modal>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="modalEdit"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="submitEditAccount"
          @btnClose="CloseModalCreate"
          title="Add New Account"
          :isSubmitting="isSubmitting"
        >
          <div class="w-full flex items-center gap-2">
            <InputText
              v-model="accountStore.input.name"
              class="w-1/2"
              label="Name"
              placeholder="Enter Name Here.."
            />
            <InputText
              v-model="accountStore.input.username"
              class="w-1/2"
              label="Username"
              placeholder="Enter Name Here.."
            />
          </div>
          <div class="w-full flex items-center gap-2">
            <InputSelect
              placeholder="Select Role"
              v-model="accountStore.input.role"
              class="w-1/2"
              label="Role"
            >
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </InputSelect>
            <InputSelect
              placeholder="Select Major"
              v-model="accountStore.input.major_id"
              class="w-1/2"
              label="Major"
            >
              <option
                v-for="major in majorStore.dataMajor"
                :key="major.id"
                :value="major.id"
              >
                {{ major.name }}
              </option>
            </InputSelect>
          </div>
        </Modal>
      </div>
    </Transition>
    <Transition name="fade">
      <div
        v-if="modalDelete"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="CloseModalCreate"
          @btnSubmit="submitDeleteAccount"
          title="Delete Account"
          :isSubmitting="isSubmitting"
        >
          <div class="w-full flex flex-col items-center py-4">
            <div class="text-red-500 mb-3"></div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">
              Confirm Deletion
            </h3>
            <p class="text-center text-gray-600">
              Are you sure you want to delete
              <span class="font-semibold">{{ accountStore.input.name }}</span>
              ?
              <br />
            </p>
          </div>
        </Modal>
      </div>
    </Transition>

    <Navbar
      :breadcrumbs="breadcrumbs"
      @breadcrumbClick="handleBreadcrumbClick"
    />
    <div class="flex items-center justify-between mt-12 mb-7">
      <h1 class="font-semibold text-2xl">List Account</h1>
      <div
        class="w-64 h-9 p-2 border-2 border-[#E0E0E0] rounded-md flex items-center gap-2"
      >
        <IconsSearchIcon class="w-6 h-6 text-gray-500" />
        <input
          type="text"
          v-model="accountStore.filter.search"
          @input="handleSearch"
          class="outline-none w-full"
          placeholder="Search Anything"
        />
      </div>
    </div>

    <!-- skeleton -->
    <TableSkeleton v-if="pending" :rows="2" :columns="2" />

    <div v-else class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
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
            v-for="user in accountStore.Accounts"
            :key="user.id"
            class="border-b border-[#EEEEEE] hover:bg-gray-50"
          >
            <td class="flex items-center gap-2 px-8 py-4">
              <IconsUserIcon />
              <span class="text-xs font-medium">{{ user.name }}</span>
            </td>
            <td class="px-4 py-4">
              <div
                :style="{
                  backgroundColor: `rgba(${parseInt(
                    user.major?.color.slice(1, 3),
                    16
                  )}, ${parseInt(
                    user.major?.color.slice(3, 5),
                    16
                  )}, ${parseInt(user.major?.color.slice(5, 7), 16)}, 0.8)`,
                }"
                class="w-24 flex justify-center rounded-md py-1"
              >
                <span
                  :style="{ color: darkenColor(user.major?.color, 70) }"
                  class="text-xs font-medium"
                >
                  {{ user.major?.name || "N/A" }}
                </span>
              </div>
            </td>
            <td align="center" class="px-4 py-4">
              <span class="text-xs font-medium">{{ user.role }}</span>
            </td>
            <td class="px-4 py-4 text-right">
              <div class="inline-flex gap-1 items-center">
                <ButtonEdit @click="openModalEdit(user)" />
                <ButtonDelete @click="openModalDelete(user)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-xs text-gray-500 mt-3 ml-2">
      Showing {{ accountStore.Accounts.length > 0 ? 1 : 0 }} to
      {{ accountStore.Accounts.length }} of
      {{ accountStore.Accounts.length }} Accounts
    </p>
  </div>
</template>

<script setup>
import {
  IconsNavbarIconsAddUser,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsManageUser,
} from "#components";
import { useAuthStore } from "@/stores/auth";

definePageMeta({
  layout: "default",
  title: "Accounts",
});

let timeoutFiltering = null;

const handleSearch = () => {
  pending.value = true;
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    fetchUsers();
  }, 500);
};

const alertError = ref(false);
const alertMessage = ref("");
const alertSuccess = ref(false);
const alertWarning = ref(false);

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

const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;
const accountStore = useAccountsStore();
const majorStore = useMajorStore();

let modalCreate = ref(false);
let modalEdit = ref(false);
let modalDelete = ref(false);

const openModalEdit = (item) => {
  modalEdit.value = true;
  accountStore.input.id = item.id;
  accountStore.input.name = item.name;
  accountStore.input.username = item.username;
  accountStore.input.role = item.role;
  accountStore.input.major_id = item.major_id;
};

const openModalDelete = (item) => {
  accountStore.input.id = item.id;
  accountStore.input.name = item.name;
  modalDelete.value = true;
};
const OpenModalCreate = () => {
  modalCreate.value = true;
  getMajor();
};

const CloseModalCreate = () => {
  modalCreate.value = false;
  modalEdit.value = false;
  modalDelete.value = false;
  accountStore.input.name = "";
  accountStore.input.username = "";
  accountStore.input.role = "";
  accountStore.input.password = "";
  accountStore.input.major_id = "";
};

const pending = ref(true);
const error = ref(null);

const GetMajor = async () => {
  setTimeout(() => setLoading(false), 5000);
  setTimeout(() => setLoading(false), 5000);
  const response = await $fetch(`${url}/major`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
      'ngrok-skip-browser-warning': true
    },
  });
  if (response.status === 200) {
    majorStore.dataMajor = response.data;
  }
};

const fetchUsers = async () => {
  const response = await $fetch(
    `${url}/user?search=${accountStore.filter.search}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    }
  );

  if (response.status === 200) {
    accountStore.Accounts = response.data;
    pending.value = false;
  }
};

const submitCreateAccount = async () => {
  if (accountStore.input.name === "") {
    showAlert("warning", "Name cannot be empty");
    return;
  } else if (accountStore.input.username === "") {
    showAlert("warning", "Username cannot be empty");
    return;
  } else if (accountStore.input.role === "") {
    showAlert("warning", "Role cannot be empty");
    return;
  } else if (accountStore.input.password === "") {
    showAlert("warning", "Password cannot be empty");
    return;
  } else if (accountStore.input.major_id === "") {
    showAlert("warning", "Major cannot be empty");
    return;
  }
  const response = await $fetch(`${url}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
    body: {
      name: accountStore.input.name,
      username: accountStore.input.username,
      role: accountStore.input.role,
      password: accountStore.input.password,
      major_id: accountStore.input.major_id,
    },
  });
  if (response.status === 200 || response.status === 201) {
    showAlert("success", "Account Successfully Created");
    fetchUsers();
    CloseModalCreate();
  } else {
    showAlert("error", "Something went wrong while creating account");
  }
};

const submitEditAccount = async () => {
  if (accountStore.input.name === "") {
    showAlert("warning", "Name cannot be empty");
    return;
  } else if (accountStore.input.username === "") {
    showAlert("warning", "Username cannot be empty");
    return;
  } else if (accountStore.input.role === "") {
    showAlert("warning", "Role cannot be empty");
    return;
  } else if (accountStore.input.major_id === "") {
    showAlert("warning", "Major cannot be empty");
    return;
  }
  const response = await $fetch(`${url}/user/${accountStore.input.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
    body: {
      name: accountStore.input.name,
      username: accountStore.input.username,
      role: accountStore.input.role,
      major_id: accountStore.input.major_id,
    },
  });
  if (response.status === 200 || response.status === 201) {
    showAlert("success", "Account Successfully Updated");
    fetchUsers();
    CloseModalCreate();
  } else {
    showAlert("error", "Something went wrong while updating account");
  }
};

const submitDeleteAccount = async () => {
  const response = await $fetch(`${url}/user/${accountStore.input.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  if (response.status === 200 || response.status === 201) {
    showAlert("success", "Account Successfully Deleted");
    fetchUsers();
    CloseModalCreate();
  } else {
    showAlert("error", "Something went wrong while deleting account");
  }
};

function darkenColor(hex, percent) {
  if (!hex) return "#000";
  let num = parseInt(hex.slice(1), 16),
    r = (num >> 16) - percent,
    g = ((num >> 8) & 0x00ff) - percent,
    b = (num & 0x0000ff) - percent;
  return (
    "#" +
    (
      0x1000000 +
      (r < 0 ? 0 : r) * 0x10000 +
      (g < 0 ? 0 : g) * 0x100 +
      (b < 0 ? 0 : b)
    )
      .toString(16)
      .slice(1)
  );
}

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
    onClick: OpenModalCreate,
  },
  {
    label: "Sort by Major",
    icon: IconsNavbarIconsFilterMajor,
  },
];

function handleBreadcrumbClick(item) {
  if (item.onClick) item.onClick();
}
</script>
