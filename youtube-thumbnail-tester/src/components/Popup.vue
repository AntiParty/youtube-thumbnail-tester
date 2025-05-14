<template>
  <transition name="popup-slide">
    <div v-if="visible" class="popup">
      🎉 Surprise! Here's a random popup!
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
      }, 4000); // Show for 4 seconds
    }
  },
  mounted() {
    setInterval(() => {
      if (Math.random() < 0.9) { // 30% chance every 10s
        this.show();
      }
    }, 5000);
  }
};
</script>

<style>
.popup {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #222;
  color: #fff;
  padding: 14px 20px;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  font-weight: 500;
}

/* Slide + Fade Transition */
.popup-slide-enter-active,
.popup-slide-leave-active {
  transition: all 0.5s ease;
}
.popup-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.popup-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>