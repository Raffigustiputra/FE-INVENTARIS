<template>
    <div class="tooltip-container" @mouseover="showTooltip" @mouseleave="hideTooltip">
        <slot></slot>
        <div v-if="visible" class="tooltip" :class="position">
            {{ text }}
            <span class="tooltip-arrow" :class="position"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: "TopTooltip",
    props: {
        text: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            default: "top", // Options: top, bottom, left, right
        },
    },
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        showTooltip() {
            this.visible = true;
        },
        hideTooltip() {
            this.visible = false;
        },
    },
};
</script>

<style scoped>
.tooltip-container {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

.tooltip {
    position: absolute;
    background-color: #303030;
    color: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.tooltip.top {
    bottom: 100%;
    left: 70%;
    transform: translateX(-50%);
}

.tooltip.bottom {
    top: 125%;
    left: 50%;
    transform: translateX(-50%);
}

.tooltip.left {
    right: 125%;
    top: 50%;
    transform: translateY(-50%);
}

.tooltip.right {
    left: 125%;
    top: 50%;
    transform: translateY(-50%);
}

.tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

.tooltip-arrow.top {
    bottom: -5px;
    left: 30%;
    transform: translateX(-50%);
    border-width: 5px 5px 0 5px;
    border-color: #303030 transparent transparent transparent;
}

.tooltip-arrow.bottom {
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #303030 transparent;
}

.tooltip-arrow.left {
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent #303030;
}

.tooltip-arrow.right {
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 5px 5px 0;
    border-color: transparent #303030 transparent transparent;
}

.tooltip-container:hover .tooltip {
    opacity: 1;
}
</style>