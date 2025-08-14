<template>
    <div class="space-y-4 my-2 w-full">
        <div>
            <!-- Label -->
            <label :for="name" class="block ml-0.5 text-sm font-medium text-[#727272]">
                {{ label }}
                <span v-if="!required" class="text-xs ml-1 text-[#757575]">(optional)</span>
            </label>

            <!-- Date Picker -->
            <div ref="datePickerContainer" class="mt-2">
                <VueDatePicker
                    v-model="internalValue"
                    teleport="body"
                    auto-apply
                    :placeholder="placeholder"
                    :style="{
                        '--dp-background-color': '#F9FBFC',
                        '--dp-border-color': '#D2D2D2',
                        '--dp-menu-border-color': '#D2D2D2',
                        '--dp-border-color-hover': '#3B82F6',
                        '--dp-border-color-focus': '#3B82F6',
                        '--dp-text-color': '#000000',
                        '--dp-input-padding': '8px 16px',
                        '--dp-font-size': '11px' /* font lebih kecil */,
                        '--dp-cell-size': '24px' /* cell kalender lebih kecil */,
                        '--dp-month-year-row-height': '28px' /* bar bulan/tahun lebih pendek */,
                        '--dp-action-buttons-padding': '4px',
                        '--dp-menu-min-width': '220px' /* lebar minimal kalender */,
                        '--dp-menu-width': '220px' /* paksa lebar */,
                    }"
                    :min-date="allowedMinDate"
                    :max-date="allowedMaxDate"
                    :inline="false"
                    :auto-position="false"
                    :enableTimePicker="false"
                    :close-on-scroll="false"
                    @opened="onCalendarOpen"
                    @closed="onCalendarClose"
                    input-class="outline-none block w-full rounded-sm border border-[#D2D2D2] font-medium bg-[#F9FBFC] focus:border-blue-500 focus:ring focus:ring-blue-200" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';

const props = defineProps({
    name: { type: String, default: 'datepicker' },
    label: { type: String, default: 'Label here' },
    required: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Enter placeholder here' },
    modelValue: { type: String, default: '' },
    allowedMinDate: { type: String, default: null },
    allowedMaxDate: { type: String, default: null },
});

const emits = defineEmits(['update:modelValue']);

const datePickerContainer = ref(null);
let observer = null;

const updateCalendarPosition = () => {
    const calendarElement = document.querySelector('.dp__menu');
    const inputElement = datePickerContainer.value;

    if (!calendarElement || !inputElement) return;

    const inputRect = inputElement.getBoundingClientRect();
    const calendarHeight = calendarElement.offsetHeight;
    const topSpace = inputRect.top;
    const bottomSpace = window.innerHeight - inputRect.bottom;

    calendarElement.style.position = 'fixed';
    calendarElement.style.width = `${inputRect.width}px`;
    calendarElement.style.left = `${inputRect.left}px`;

    if (topSpace >= calendarHeight) {
        calendarElement.style.top = `${inputRect.top - calendarHeight}px`;
    } else {
        calendarElement.style.top = `${inputRect.bottom}px`;
    }

    calendarElement.style.zIndex = '99999'; // z-index tinggi biar di depan
};

const onCalendarOpen = () => {
    setTimeout(updateCalendarPosition, 0);
    if (datePickerContainer.value) {
        observer = new MutationObserver(updateCalendarPosition);
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }
    window.addEventListener('resize', updateCalendarPosition);
    window.addEventListener('scroll', updateCalendarPosition, true);
};

const onCalendarClose = () => {
    if (observer) observer.disconnect();
    window.removeEventListener('resize', updateCalendarPosition);
    window.removeEventListener('scroll', updateCalendarPosition, true);
};

onBeforeUnmount(() => {
    onCalendarClose();
});

const internalValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
});
</script>

<style>
:deep(.dp__menu) {
    transform: none !important;
    position: fixed !important;
    margin: 0 !important;
    z-index: 2147483647 !important; /* angka max int supaya pasti di atas */
}

:deep(.dp__outer_menu_wrap) {
    position: fixed !important;
    transform: none !important;
    z-index: 2147483647 !important;
}

:deep(.dp__overlay) {
    z-index: 2147483646 !important; /* sedikit di bawah menu */
}
</style>
