import { nextTick, useTemplateRef } from "vue";

// export default function useScrollToBottom(container) {
//     // const chatContainer = useTemplateRef(refId);
export default function useScrollToBottom(refId) {
    const container = useTemplateRef(refId);

    async function moveScrollToBottom() {
        await nextTick();
        container.value.scrollTop = container.value.scrollHeight;
    }

    return {
        moveScrollToBottom,
    }
}