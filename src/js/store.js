// store.js
import { reactive } from 'vue';

async function peer_opened() {
    window.dispatchEvent(new CustomEvent('peer_opened'));
}

async function is_round_finished() {
    if (store.answers[store.round].length == store.peer_names.length * 2) {
        window.dispatchEvent(new CustomEvent('round_finished'));
    }
}

async function is_voting_finished() {
    if (store.voted == (store.peer_names.length * (store.peer_names.length - 2))) {
        window.dispatchEvent(new CustomEvent('voting_finished'));
    }
}

function notify_peers(obj) {
    store.peer_list.forEach((peer) => {
        if (peer.name != store.name) {
            peer.conn.send(obj);
        }
    });
}

const store = reactive({
    round: 0,
    voted: 0,
    role: null,
    name: null,
    winner: null,
    peer_id: null,
    host_id: null,
    peer_list: [],
    peer_names: [],
    game_started: false,
    groups: [],
    answered: [],
    answers: [
        [],
        [],
        []
    ]
});

export { store, peer_opened, is_round_finished, notify_peers, is_voting_finished }