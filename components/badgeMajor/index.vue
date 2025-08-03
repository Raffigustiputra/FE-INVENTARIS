<template>
  <span :style="badgeStyle" class="inline-flex items-center px-8 py-1 rounded-md font-semibold text-xs">
    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['pplg', 'dkv', 'tjkt', 'mplb', 'pmn', 'htl', 'kln'].includes(value),
  },
  text: {
    type: String,
    required: true, 
  },
});

const colorMap = {
  pplg: {
    backgroundColor: '#A2C5FF99',
    color: '#1B5DCC',
  },
  dkv: {
    backgroundColor: '#FFBB6399',
    color: '#B06A0F',
  },
  tjkt: {
    backgroundColor: '#FFEB6799',
    color: '#978611',
  },
  mplb: {
    backgroundColor: '#FF484B99',
    color: '#AB2123',
  },
  pmn: {
    backgroundColor: '#877E3199',
    color: '#665D09',
  },
  htl: {
    backgroundColor: '#42A53199',
    color: '#1D800B',
  },
  kln: {
    backgroundColor: '#D967CA99',
    color: '#9E1B8D',
  },
};

const badgeStyle = computed(() => {
  const colors = colorMap[props.type] || {};
  return {
    backgroundColor: colors.backgroundColor,
    color: colors.color,
  };
});
</script>