<template>
    <div v-if="!store.game_started">
        <div class="card home-card">
            <div class="card-body">
                <div class="d-flex flex-column justify-content-center align-items-center bg-dark text-white py-4">
                    <div class="spinner-border mb-2" role="status" />
                    <span class="fw-bold funky-text">
                        Waiting for other players...
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div v-if="store.game_started">
        <ul class="list-group">
            <li class="list-group-item bg-dark text-white">Round {{ store.round + 1 }}</li>
            <li class="list-group-item" :class="{ 'answered': hasAnswered(name) }" v-for="name in store.peer_names">
                <span class="bi bi-person-circle me-1"></span>
                <span>{{ name }}</span>
            </li>
        </ul>
    </div>

    <hostIntro ref="host_intro" @connect_as_host="connect_as_host" />
    <guestIntro ref="guest_intro" @connect_as_guest="connect_as_guest" />
    <Prompt ref="prompt" @send_answer="send_answer" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from "/js/store.js";
import { prompts } from "/assets/prompts.json";
import hostIntro from './hostIntro.vue';
import guestIntro from './guestIntro.vue';
import Prompt from './Prompt.vue';

const router = useRouter();
const host_intro = ref(null);
const guest_intro = ref(null);
const prompt = ref(null);

const guest_conn = ref(null);

function hasAnswered(name) {
    return store.answers[store.round].some((answer) => {
        return answer.name == name;
    });
}

async function round_1() {
    store.round = 0;
    let pr = prompts[Math.floor(Math.random() * prompts.length)];

    store.peer_list.forEach((peer) => {
        peer.conn.send({
            type: "prompt",
            prompt: pr,
            round: store.round,
        });
    })

    prompt.value.show(pr);
}

async function connect_as_host(name) {
    store.name = name;
    store.peer_names.push(name);
    host_intro.value.hide();

    store.peer_list.forEach((peer) => {
        peer.conn.send({
            type: "start",
            names: store.peer_names,
        });
    });
    store.game_started = true;

    await round_1();
}

async function connect_as_guest(name) {
    store.name = name;
    guest_conn.value = window.peer.connect(store.host_id);

    guest_conn.value.on('open', function () {
        guest_conn.value.send({
            type: "join",
            name: store.name
        });
    });

    guest_conn.value.on('data', (data) => {
        console.log("Received data: ", data);
        if (data.type == "start") {
            store.game_started = true;
            store.peer_names = data.names;
            return
        }

        if (data.type == "prompt") {
            store.round = data.round;
            prompt.value.show(data.prompt);
            return
        }

        if (data.type == "answered") {
            store.answers[store.round].push({
                "name": data.name,
                "answer": data.answer,
            });
            return
        }
    });
}

async function send_answer(answer) {
    if (store.role == "host") {
        store.answers[store.round].push({
            "name": store.name,
            "answer": answer,
        });
        store.peer_list.forEach((peer) => {
            peer.conn.send({
                type: "answered",
                name: store.name,
                answer: answer,
            });
        });

        // Check if round ended by host answer
        if (store.answers[store.round].length == store.peer_names.length) {
            console.log("Round ended!");
        }
        return;
    }

    guest_conn.value.send({
        type: "answer",
        name: store.name,
        answer: answer,
    });
}

onMounted(() => {
    let id = router.currentRoute.value.params.id;
    if (id) {
        store.role = "guest";
        store.host_id = id;
        guest_intro.value.show();
        return
    }

    store.role = "host";
    host_intro.value.show();
})
</script>