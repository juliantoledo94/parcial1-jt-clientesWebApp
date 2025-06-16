import { nextTick, useTemplateRef } from "vue";

export default function useScrollToBottomToBottom(refId) {
    const container = useTemplateRef(refId)

    async function moveScroll() {
        await nextTick();
        container.value.scrollTop = container.value.scrollHeight;
    }

    return {
        useScrollToBottomToBottom,
    }
}