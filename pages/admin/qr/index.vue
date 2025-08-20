<template>
    <div class="flex flex-wrap gap-8 justify-center items-center p-30 bg-gray-900 min-h-screen">
        <div class="grid grid-cols-[320px_380px] grid-rows-[250px_160px] gap-8">
            <!-- Card 1 -->
            <div
                class="row-span-2 w-[320px] h-[350px] bg-gradient-to-br from-blue-500 to-[#0F265F] rounded-sm p-5 flex flex-col justify-between relative text-white">
                <div class="flex items-center justify-center mb-7">
                    <img :src="logoSrc" alt="WiKVENTORY Logo" class="h-5" />
                </div>

                <div class="flex justify-center ">
                    <img :src="qrSrc" alt="QR Code" class="bg-white p-2 rounded-lg w-40 h-40" />
                </div>

                <div class="text-center">
                    <h2 class="text-base font-bold">PPLG-LENO-103</h2>
                    <p class="text-xs text-gray-200">LAPTOP</p>
                </div>

                <div class="text-[8px] space-y-1">
                    <p class="flex items-center gap-2">
                        <PropertyIcon class="w-2 h-2 text-white" />PPLG Property
                    </p>
                    <p class="flex items-center gap-2">
                        <LinkIcon class="w-2 h-2 text-white" />wikventory.smkvikrama.sch.id
                    </p>
                </div>

                <!-- Watermark -->
                <div class="absolute bottom-3 right-3 text-[100px] font-bold text-white/10 select-none rotate-[15deg]">
                    3
                </div>
            </div>

            <!-- Card 2 -->
            <div
                class="w-[350px] h-[250px] bg-gradient-to-br from-blue-500 to-[#0F265F] rounded-sm p-5 flex flex-col justify-between relative text-white">
                <div class="flex items-center justify-between mb-10">
                    <img :src="logoSrc" alt="WiKVENTORY Logo" class="h-5" />
                </div>

                <div class="flex justify-between items-center mb-6">
                    <div class="text-left">
                        <p class="text-xs">LAPTOP</p>
                        <h2 class="text-xl font-bold leading-tight">PPLG <br>LENO <br>103</h2>
                    </div>

                    <img :src="qrSrc" alt="QR Code"
                        class="absolute bottom-3 right-3 bg-white p-2 rounded-lg w-28 h-28" />
                </div>

                <div class="text-[8px] space-y-1">
                    <p class="flex items-center gap-2">
                        <PropertyIcon class="w-2 h-2 text-white" /> PPLG Property
                    </p>
                    <p class="flex items-center gap-2 ">
                        <LinkIcon class="w-2 h-2 text-white" /> wikventory.smkvikrama.sch.id
                    </p>
                </div>

                <!-- Watermark -->
                <div class="absolute right-3 text-[85px] font-bold text-white/10 select-none rotate-[15deg]">
                    3
                </div>
            </div>

            <!-- Card 3 -->
            <div
                class="w-[420px] h-[160px] bg-gradient-to-br from-blue-500 to-[#0F265F] rounded-sm p-4 flex justify-end items-center relative text-white">
                <img :src="qrSrc" alt="QR Code" class="bg-white p-2 rounded-lg w-30 h-30" />

                <div class="flex-1 ml-4">
                    <p class="text-xs">LAPTOP</p>
                    <h2 class="text-lg font-bold">PPLG-LENO-103</h2>
                    <div class="text-[8px] mt-1 space-y-1 mt-9">
                        <p class="flex items-center gap-1">
                            <PropertyIcon class="w-2 h-2 text-white" />
                            <span>PPLG Property</span>
                        </p>
                        <p class="flex items-center gap-1">
                            <LinkIcon class="w-2 h-2 text-white" />
                            <span>wikventory.smkvikrama.sch.id</span>
                        </p>
                    </div>
                </div>

                <img :src="minilogoSrc" alt="WiKVENTORY Logo" class="h-3 absolute right-3 bottom-3 opacity-80" />
            </div>
        </div>
    </div>
</template>

<script setup>
import PropertyIcon from "@/components/icons/vector.vue";
import LinkIcon from "@/components/icons/global_netv.vue";

const qrSrc = "/images/PPLG-LENO-003.png"
const logoSrc = "/images/WV - WHITE LANDSCAPE 1.png"
const minilogoSrc = "/images/WV - WHITE 1.png"
</script>