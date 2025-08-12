<template>
  <span :style="badgeStyle" class="inline-flex items-center px-8 py-1 rounded-md font-semibold text-xs">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true, // 'status', 'condition', 'major'
  },
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})

const colorMap = {
  status: {
    available: { backgroundColor: '#D2F3D8', color: '#59AE75' },
    borrowed: { backgroundColor: '#FFF3A4', color: '#978611' },
    unavailable: { backgroundColor: '#FEBCBE', color: '#BA4042' },
  },
  condition: {
    good: { backgroundColor: '#D2F3D8', color: '#59AE75' },
    damaged: { backgroundColor: '#FEBCBE', color: '#BA4042' },
  },
  major: {
    pplg: { backgroundColor: '#A2C5FF99', color: '#1B5DCC' },
    dkv: { backgroundColor: '#FFBB6399', color: '#B06A0F' },
    tjkt: { backgroundColor: '#FFEB6799', color: '#978611' },
    mplb: { backgroundColor: '#FF484B99', color: '#AB2123' },
    pmn: { backgroundColor: '#877E3199', color: '#665D09' },
    htl: { backgroundColor: '#42A53199', color: '#1D800B' },
    kln: { backgroundColor: '#D967CA99', color: '#9E1B8D' },
  },
}

const badgeStyle = computed(() => {
  const colors = colorMap[props.type]?.[props.value.toLowerCase()] || {}
  return {
    backgroundColor: colors.backgroundColor || '#E0E0E0',
    color: colors.color || '#333',
  }
})

const label = computed(() => props.label || props.value)
</script>
