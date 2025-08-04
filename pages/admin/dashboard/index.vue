<template>
    <div class="">
        <button-edit />
        <button-delete />

        <h1
        @click="OpenModal"
        >test buat klik modal</h1>
        <div class="w-full">
            
            <div
            v-if="modal"
            class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen backdrop-blur-sm bg-black/30"
            >
            <Modal
            @btnClose="Closemodal"
            > 
                <div class="w-full flex items-center gap-2">
                    <InputText class="w-1/2" label="Brand Name" placeholder="Enter Brand Name Here.." />
                    <InputText class="w-1/2" label="Unit Code" placeholder="Enter Unit Code Here.." />
                </div>  
                <div class="w-full flex items-center gap-2">
                    <InputDate class="w-1/2" label="Date"/>
                    <InputSelect class="w-1/2" label="type">
                    <option value="">Laptop</option>
                    <option value="">Desktop</option>
                    <option value="">Printer</option>
                    </InputSelect>
                </div>
            <InputTextarea
            label="Description"
            placeholder="Input Description Here.."
            />
        </Modal>
            </div>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "default",
    title: "Home - Inventaris"
})

let modal = ref(false)
let OpenModal = () => {
    modal.value = true
}

let Closemodal = () => {
    modal.value = false
}
</script>