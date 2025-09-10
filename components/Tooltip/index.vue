<template>
    <div class="tooltip-container" @mouseover="showTooltip" @mouseleave="hideTooltip" ref="container">
        <slot></slot>
        <Teleport to="body">
        <div v-if="visible" class="tooltip" :class="position" :style="tooltipStyle">
            {{ text }}
            <span class="tooltip-arrow" :class="position"></span>
        </div>
        </Teleport>
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
            default: "top", 
        },
    },
    data() {
        return {
            visible: false,
            tooltipStyle: {},
        };
    },
    methods: {
    showTooltip() {
      this.visible = true;
      // Use nextTick to ensure the container ref is available
      this.$nextTick(() => {
        const containerRect = this.$refs.container.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        let top = 0;
        let left = 0;

        // Calculate position based on the trigger element
        switch (this.position) {
          case 'right':
            top = containerRect.top + containerRect.height / 2 + scrollY;
            left = containerRect.right + 8 + scrollX; // 8px gap
            break;
          case 'left':
            top = containerRect.top + containerRect.height / 2 + scrollY;
            left = containerRect.left - 8 + scrollX; // 8px gap
            break;
          case 'bottom':
            top = containerRect.bottom + 8 + scrollY; // 8px gap
            left = containerRect.left + containerRect.width / 2 + scrollX;
            break;
          default: // top
            top = containerRect.top - 8 + scrollY; // 8px gap
            left = containerRect.left + containerRect.width / 2 + scrollX;
        }
        
        this.tooltipStyle = {
          top: `${top}px`,
          left: `${left}px`,
        };
      });
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
  display: block;
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
  z-index: 9999; 
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.tooltip.top {
    transform: translate(-50%, -100%);
}

.tooltip.bottom {
    transform: translate(-50%, 0);
}

.tooltip.left {
    transform: translate(-100%, -50%);
}

.tooltip.right {
    transform: translate(0, -50%);
}

.tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

.tooltip-arrow.top {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0 5px;
    border-color: #303030 transparent transparent transparent;
}

.tooltip-arrow.bottom {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #303030 transparent;
}

.tooltip-arrow.left {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent #303030;
}

.tooltip-arrow.right {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 5px 5px 0;
    border-color: transparent #303030 transparent transparent;
}

.tooltip-container:hover .tooltip {
    opacity: 1;
}
</style>