<template>
    <div class="space-y-4 my-2 w-full">
        <label for="" class="text-sm font-medium text-[#727272]">{{ props.label }}</label>
        <div
            class="flex flex-col gap-3  items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition"
            @click="triggerFileInput">
            <!-- Icon upload -->
            <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13.125 22.5V7.21875L8.25 12.0938L5.625 9.375L15 0L24.375 9.375L21.75 12.0938L16.875 7.21875V22.5H13.125ZM3.75 30C2.71875 30 1.83594 29.6328 1.10156 28.8984C0.367188 28.1641 0 27.2812 0 26.25V20.625H3.75V26.25H26.25V20.625H30V26.25C30 27.2812 29.6328 28.1641 28.8984 28.8984C28.1641 29.6328 27.2812 30 26.25 30H3.75Z"
                    fill="#545454" />
            </svg>

            <!-- Text -->
            <p class="mt-2 text-sm text-gray-600 text-center">
                Drag & Drop or
                <span class="text-blue-500 underline">Choose File</span>
                to upload
            </p>

            <!-- Hidden input file -->
            <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" />
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    label: String,
});
const fileInput = ref(null);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log('Selected file:', file.name);
    }
};
</script>
