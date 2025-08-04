<template>
  <div>
    <button-edit />
    <button-delete />

    <h1 @click="OpenModal">test buat klik modal</h1>

    <div class="w-full">
      <!-- Tambahkan Transition di sini -->
      <Transition name="fade">
        <div
          v-if="modal"
          class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen backdrop-blur-sm bg-black/30"
        >
          <Modal @btnClose="Closemodal">
            <div class="w-full flex items-center gap-2">
              <InputText class="w-1/2" label="Brand Name" placeholder="Enter Brand Name Here.." />
              <InputText class="w-1/2" label="Unit Code" placeholder="Enter Unit Code Here.." />
            </div>
            <div class="w-full flex items-center gap-2">
              <InputDate class="w-1/2" />
              <InputSelect class="w-1/2" label="type">
                <option value="">Laptop</option>
                <option value="">Desktop</option>
                <option value="">Printer</option>
              </InputSelect>
            </div>
            <InputTextarea label="Description" placeholder="Input Description Here.." />
          </Modal>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
let modal = ref(false)
let OpenModal = () => {
  modal.value = true
}
let Closemodal = () => {
  modal.value = false
}

definePageMeta({
  layout: "default",
  title: "Home - Inventaris"
})
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
