<template>
    <div id="print-area" class="print-content flex flex-wrap gap-2 justify-start items-start p-2 min-h-screen">
        <div v-for="(item, index) in selectedItems" :key="item.id" 
             :class="['print-item-container', { 'page-break': (index + 1) % 3 === 0 && index !== selectedItems.length - 1 }]">
            <div class="grid grid-cols-[230px_270px] grid-rows-[180px_130px] gap-3 mb-4">
                <!-- Card 1 -->
                <div
                class="row-span-2 w-[230px] h-[240px] bg-gradient-to-b from-blue-500 to-[#0F265F] rounded-sm p-4 flex flex-col justify-between relative text-white">
                    <div class="flex items-center justify-center mb-4">
                        <img :src="logoSrc" alt="WiKVENTORY Logo" class="h-3" />
                    </div>

                    <div class="flex justify-center">
                        <img :src="item.qrcode" alt="QR Code" class="bg-white p-[3px] rounded-sm w-26 h-26" />
                    </div>

                    <div class="text-center -mt-1">
                        <h2 class="text-[10px] font-bold">{{ item.code_unit }}</h2>
                        <p class="text-[8px] uppercase font-semibold tracking-[1.5px] text-gray-200 mb-2">{{ item?.sub_item?.item?.name }}</p>
                    </div>

                    <div class="text-[6px] space-y-0.5">
                        <p class="flex items-center gap-0.5">
                            <PropertyIcon class="w-1.5 h-1.5 text-white" />
                            <span class="leading-none align-middle">{{ item?.sub_item?.major?.name }} Property</span>
                        </p>
                        <p class="flex items-center gap-0.5">
                            <LinkIcon class="w-1.5 h-1.5 text-white" />
                            <span class="leading-none align-middle">wikventory.smkvikrama.sch.id</span>
                        </p>
                    </div>

                    <!-- Watermark -->
                    <div
                        class="absolute bottom-2 right-2 text-[70px] font-bold text-white/10 select-none leading-none rotate-[15deg]">
                        {{ item?.sub_item?.item?.code_item }}
                    </div>
                </div>

                <!-- Card 2 -->
                <div
                class="w-[260px] h-[180px] bg-gradient-to-b from-blue-500 to-[#0F265F] rounded-sm p-4 flex flex-col justify-between relative text-white">
                    <div class="flex items-center justify-between mb-4">
                        <img :src="logoSrc" alt="WiKVENTORY Logo" class="h-3" />
                    </div>

                    <div class="flex justify-between items-center mb-3">
                        <div class="text-left">
                            <p class="text-[8px] uppercase font-semibold tracking-[1.5px] text-gray-200">{{ item?.sub_item?.item?.name }}</p>
                            <h2 class="text-[20px] font-bold leading-tight" v-html="formatCodeForCard2(item)"></h2>
                        </div>

                        <img :src="item.qrcode" alt="QR Code"
                            class="absolute bottom-4 right-4 bg-white p-[3px] rounded-sm w-22 h-22" />
                    </div>

                    <div class="text-[6px] space-y-0.5">
                        <p class="flex items-center gap-0.5">
                            <PropertyIcon class="w-1.5 h-1.5 text-white" />
                            <span class="leading-none align-middle">{{ item?.sub_item?.major?.name }} Property</span>
                        </p>
                        <p class="flex items-center gap-0.5">
                            <LinkIcon class="w-1.5 h-1.5 text-white" />
                            <span class="leading-none align-middle">wikventory.smkvikrama.sch.id</span>
                        </p>
                    </div>

                    <!-- Watermark -->
                    <div class="absolute -top-1 right-6 text-[60px] font-bold text-white/10 select-none rotate-[15deg]">
                        {{ item?.sub_item?.item?.code_item }}
                    </div>
                </div>

                <!-- Card 3 -->
                <div
                class="w-[280px] h-[90px] bg-gradient-to-b from-blue-500 to-[#0F265F] rounded-sm px-2 flex justify-end items-center relative text-white">
                    <img :src="item.qrcode" alt="QR Code" class="bg-white p-[3px] rounded-sm w-18 h-18" />

                    <div class="flex-1 ml-3">
                        <p class="text-[8px] uppercase font-semibold tracking-[1.5px] text-gray-200">{{ item?.sub_item?.item?.name }}</p>
                        <h2 class="text-base font-bold">{{ item.code_unit }}</h2>
                        <div class="text-[6px] space-y-0.5 mt-3">
                            <p class="flex items-center gap-0.5">
                                <PropertyIcon class="w-1.5 h-1.5 text-white" />
                                <span class="leading-none align-middle">{{ item?.sub_item?.major?.name }} Property</span>
                            </p>
                            <p class="flex items-center gap-0.5">
                                <LinkIcon class="w-1.5 h-1.5 text-white" />
                                <span class="leading-none align-middle">wikventory.smkvikrama.sch.id</span>
                            </p>
                        </div>
                    </div>

                    <img :src="minilogoSrc" alt="WiKVENTORY Logo" class="h-2.5 absolute right-2 bottom-3 opacity-80" />
                </div>
            </div>
        </div>

        <!-- Show message if no items selected -->
        <div v-if="selectedItems.length === 0" class="text-center text-gray-500 p-8">
            <p class="text-lg">No items selected for printing</p>
        </div>
    </div>
</template>

<script setup>
import PropertyIcon from "@/components/icons/vector.vue";
import LinkIcon from "@/components/icons/global_netv.vue";

const logoSrc = "/images/WV - WHITE LANDSCAPE 1.png"
const minilogoSrc = "/images/WV - WHITE 1.png"

defineProps({
    selectedItems: {
        type: Array,
        default: () => []
    }
});

const getItemCode = (item) => {
    return item?.code_unit || item?.unit_code || item?.code || "N/A";
};

const formatCodeForCard2 = (item) => {
    const code = getItemCode(item);
    const parts = code.split('-');
    if (parts.length >= 3) {
        return `${parts[0]}` + "<br/>" + `${parts[1]}` + "<br/>" + `${parts[2]}`;
    }
    return code;
};
</script>

<style scoped>
.print-item-container {
    break-inside: avoid;
    page-break-inside: avoid;
}

.page-break {
    page-break-after: always !important;
    break-after: page !important;
}

@media print {
  .print-content {
    padding: 5mm !important;
    margin: 0 !important;
    background: white !important;
    width: 100% !important;
    height: auto !important;
    max-width: 210mm !important; /* A4 width */
  }
  
  .print-item-container {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    margin-bottom: 3mm !important;
  }
  
  /* Force page break after every 3rd item */
  .page-break {
    page-break-after: always !important;
    break-after: page !important;
  }
  
  /* Ensure all print content is visible */
  .print-content * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* A4 paper setup */
  @page {
    margin: 5mm !important;
    size: A4 !important;
  }
  
  /* Smaller layout for print */
  .grid {
    gap: 2mm !important;
  }
}
</style>