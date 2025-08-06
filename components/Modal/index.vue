<template>
    <div class="border bg-white border-[#D2D2D2] w-5/12 rounded-sm">
        <div class="border-b bg-white rounded-sm border-[#D2D2D2] py-2 px-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div>
                        <svg
                            class="size-5"
                            viewBox="0 0 23 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.6677 17.9861C2.09988 17.9861 1.61378 17.7661 1.20942 17.3261C0.805062 16.8861 0.602882 16.3572 0.602882 15.7394V2.25894C0.602882 1.64109 0.805062 1.11217 1.20942 0.672186C1.61378 0.2322 2.09988 0.012207 2.6677 0.012207H8.86215L10.927 2.25894H19.1862C19.7541 2.25894 20.2402 2.47894 20.6445 2.91892C21.0489 3.35891 21.2511 3.88783 21.2511 4.50568V8.21279C20.9241 8.06301 20.5843 7.96472 20.2316 7.91791C19.8788 7.8711 19.5304 7.87578 19.1862 7.93195V4.50568H10.0752L8.01042 2.25894H2.6677V15.7394H11.0302L10.927 15.8517V17.9861H2.6677ZM12.9918 20.2328V16.7785L18.6959 10.5999C18.8507 10.4314 19.0228 10.3097 19.2121 10.2349C19.4013 10.16 19.5906 10.1225 19.7799 10.1225C19.9864 10.1225 20.1842 10.1646 20.3735 10.2489C20.5628 10.3332 20.7349 10.4595 20.8897 10.628L21.8447 11.6671C21.9824 11.8357 22.0899 12.0229 22.1673 12.2288C22.2448 12.4348 22.2835 12.6407 22.2835 12.8467C22.2835 13.0526 22.2491 13.2633 22.1802 13.4786C22.1114 13.6939 21.9996 13.8858 21.8447 14.0543L16.1664 20.2328H12.9918ZM14.5404 18.5478H15.5212L18.6442 15.1215L18.1796 14.5879L17.6893 14.0824L14.5404 17.4806V18.5478ZM18.1796 14.5879L17.6893 14.0824L18.6442 15.1215L18.1796 14.5879Z"
                                fill="black" />
                        </svg>
                    </div>
                    <label class="font-medium">{{ title }}</label>
                </div>
                <div>
                    <svg
                        @click="$emit('btnClose')"
                        class="size-3 hover:cursor-pointer"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.19994 12L-6.10352e-05 10.8L4.79994 6L-6.10352e-05 1.2L1.19994 0L5.99994 4.8L10.7999 0L11.9999 1.2L7.19994 6L11.9999 10.8L10.7999 12L5.99994 7.2L1.19994 12Z"
                            fill="black" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="pt-2 pb-4 px-4 max-h-96 min-h-32 rounded-sm overflow-y-auto">
            <slot></slot>
        </div>
        <div 
            v-if="showActions"
            class="border-t w-full justify-end flex gap-3 px-4 py-2 bg-white rounded-sm border-[#D2D2D2]">
            <button 
            @click="$emit('btnClose')"
            class="border-2 hover:cursor-pointer hover:bg-black/10 duration-200 border-[#D2D2D2] px-3 py-1 text-sm rounded-md font-medium">Cancel</button>
            <button
            @click="$emit('btnSubmit')"
            class="bg-[#3A6CC2] hover:cursor-pointer duration-200 hover:bg-[#335fac] text-white px-3 py-1 text-sm rounded-md font-medium">Submit</button>
        </div>
    </div>
</template>
<script setup>
const emits = defineEmits([
    'btnClose',
    'btnSubmit'

]);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true  // default tetap tampil
  }
})
</script>