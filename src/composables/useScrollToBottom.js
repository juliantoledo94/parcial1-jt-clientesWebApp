// useScrollToBottom.js
import { nextTick } from 'vue';

export default function useScrollToBottom(containerRef) {
  async function moveScrollToBottom() {
    await nextTick();
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight;
    } else {
      console.warn("containerRef aún es null");
    }
  }

  return {
    moveScrollToBottom,
  }
}
