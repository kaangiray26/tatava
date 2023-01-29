// store.js
import { reactive } from 'vue';

async function peer_opened() {
    window.dispatchEvent(new CustomEvent('peer_opened'));
}

const store = reactive({
    round: 0,
    role: null,
    name: null,
    peer_id: null,
    host_id: null,
    peer_list: [],
    peer_names: [],
    game_started: false,
    answers: [
        [],
        [],
        []
    ],
});

export { store, peer_opened }