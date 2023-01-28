// store.js
import { reactive } from 'vue';

async function peer_opened() {
    window.dispatchEvent(new CustomEvent('peer_opened'));
}

const store = reactive({
    peer: null,
    peerId: null,
    peerList: [],
});

export { store, peer_opened }