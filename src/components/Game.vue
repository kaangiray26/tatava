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
            <li class="list-group-item bg-dark">
                <h5 class="funky-text fw-bold text-white mb-0">Round {{ store.round + 1 }}</h5>
            </li>
            <li class="list-group-item" :class="{ 'answered': hasAnswered(name) }" v-for="name in store.peer_names">
                <div class="d-inline-flex bg-dark text-white rounded px-1">
                    <span class="bi bi-person-circle me-1"></span>
                    <span>{{ name }}</span>
                </div>
            </li>
        </ul>
    </div>

    <hostIntro ref="host_intro" @connect_as_host="connect_as_host" />
    <guestIntro ref="guest_intro" @connect_as_guest="connect_as_guest" />
    <Prompt ref="prompt" @send_answer="send_answer" />
    <Vote ref="vote" @send_vote="send_vote" />
    <Score ref="score" @closed="score_closed" />
    <NextRound ref="next_round" @start_next_round="start_next_round" />
    <Finish ref="finish" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store, is_round_finished, notify_peers, is_voting_finished } from "/js/store.js";
import { single, triple } from "/assets/prompts.json";

import hostIntro from './hostIntro.vue';
import guestIntro from './guestIntro.vue';
import Prompt from './Prompt.vue';
import Vote from './Vote.vue';
import Score from './Score.vue';
import NextRound from './NextRound.vue';
import Finish from './Finish.vue';

const router = useRouter();

const host_intro = ref(null);
const guest_intro = ref(null);

const prompt = ref(null);
const vote = ref(null);
const score = ref(null);
const next_round = ref(null);
const finish = ref(null);

const guest_conn = ref(null);

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

function createGroups(prompts) {
    store.groups = [];
    store.peer_names = store.peer_list.map(peer => peer.name);
    shuffle(store.peer_names);

    for (let i = 0; i < store.peer_names.length - 1; i++) {
        let pr = prompts[Math.floor(Math.random() * prompts.length)];
        store.groups.push({
            "peers": [store.peer_names[i], store.peer_names[i + 1]],
            "prompt": pr,
            "index": i,
            "votes": [0, 0]
        })
    }

    let pr = prompts[Math.floor(Math.random() * prompts.length)];
    store.groups.push({
        "peers": [store.peer_names[store.peer_names.length - 1], store.peer_names[0]],
        "prompt": pr,
        "index": store.peer_names.length - 1,
        "votes": [0, 0]
    })
}

function hasAnswered(name) {
    if (store.answered.filter(answered => answered.name == name).length == 2) {
        return true;
    }
    return false;
}

async function round_1() {
    console.log(store);
    // Reset
    notify_peers({
        type: "reset",
    })
    reset_round();

    // Create groups for the first round
    createGroups(single);

    // Send prompts to group members
    for (let i = 0; i < store.groups.length; i++) {
        let group = store.groups[i];
        for (let j = 0; j < 2; j++) {
            // Skip if peer is the host
            if (group.peers[j] == store.name) {
                prompt.value.add_prompt(group.prompt, group.index);
                continue;
            }
            // Find peer and send prompt
            let peer = store.peer_list.find(peer => peer.name == group.peers[j]);
            peer.conn.send({
                type: "prompt",
                prompt: group.prompt,
                round: store.round,
                index: group.index
            })
        }
    }
    notify_peers({
        type: "show_prompts",
    });
    prompt.value.show();
}

async function round_2() {
    round_1();
}

async function round_3() {
    round_1();
    // // Reset
    // notify_peers({
    //     type: "reset",
    // })
    // reset_round();

    // // Create groups for the first round
    // createGroups(triple);

    // // Send prompts to group members
    // for (let i = 0; i < store.groups.length; i++) {
    //     let group = store.groups[i];
    //     for (let j = 0; j < 2; j++) {
    //         // Skip if peer is the host
    //         if (group.peers[j] == store.name) {
    //             prompt.value.add_prompt(group.prompt, group.index);
    //             continue;
    //         }
    //         // Find peer and send prompt
    //         let peer = store.peer_list.find(peer => peer.name == group.peers[j]);
    //         peer.conn.send({
    //             type: "prompt",
    //             prompt: group.prompt,
    //             round: store.round,
    //             index: group.index
    //         })
    //     }
    // }
    // notify_peers({
    //     type: "show_prompts",
    // });
    // prompt.value.show();
}

async function connect_as_host(name) {
    store.name = name;
    store.peer_list.unshift({
        "name": store.name,
        "conn": null,
        "score": 0,
    });

    store.peer_names = store.peer_list.map(peer => peer.name);
    notify_peers({
        type: "start",
        names: store.peer_names,
    })

    store.round = 0;
    store.game_started = true;
    round_1();
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
        if (data.type == "start") {
            store.game_started = true;
            store.peer_names = data.names;
            return
        }

        if (data.type == "reset") {
            reset_round();
            return
        }

        if (data.type == "prompt") {
            store.round = data.round;
            prompt.value.add_prompt(data.prompt, data.index);
            return
        }

        if (data.type == "show_prompts") {
            prompt.value.show();
            return
        }

        if (data.type == "vote") {
            vote.value.add_vote(data.index, data.prompt, data.answers);
            return
        }

        if (data.type == "show_votes") {
            vote.value.show();
            return
        }

        if (data.type == "scores") {
            score.value.set_scores(data.scores);
            score.value.show();
            return
        }

        if (data.type == "answered") {
            store.answered.push({
                "name": data.name,
            });
            return
        }

        if (data.type == "finished") {
            finish.value.show();
            return
        }
    });
}

async function send_answer(answer) {
    if (store.role == "host") {
        store.answers[store.round].push({
            "name": store.name,
            "answer": answer.answer,
            "index": answer.index
        });
        store.answered.push({
            "name": store.name,
        });

        notify_peers({
            type: "answered",
            name: store.name,
        })

        // Check if round ended
        is_round_finished();
        return;
    }

    guest_conn.value.send({
        type: "answer",
        name: store.name,
        answer: answer
    });
}

async function send_vote(vote) {
    if (store.role == "host") {
        let group = store.groups[vote.index];
        let index = group.peers.findIndex(name => name == vote.name);
        group.votes[index] += 1;
        store.voted += 1;

        // Check if voting ended
        is_voting_finished();
        return;
    }

    guest_conn.value.send({
        type: "vote",
        vote: vote
    });
}

async function start_voting() {
    // Categorize answers into groups
    let group_answers = [];
    for (let i = 0; i < store.groups.length; i++) {
        group_answers.push(store.answers[store.round].filter(answer => answer.index == i));
    }

    // Send answers to group members
    for (let i = 0; i < group_answers.length; i++) {
        notify_peers({
            type: "vote",
            index: i,
            prompt: store.groups[i].prompt,
            answers: group_answers[i],
        })
        vote.value.add_vote(i, store.groups[i].prompt, group_answers[i]);
    }

    notify_peers({
        type: "show_votes",
    });
    vote.value.show();
}

async function end_voting() {
    console.log("Voting ended!");

    // Calculate scores
    for (let i = 0; i < store.groups.length; i++) {
        let group = store.groups[i];

        // Votes are equal
        if (group.votes[0] == group.votes[1]) {
            let peers = store.peer_list.filter(peer => group.peers.includes(peer.name));
            peers.forEach(peer => peer.score += 100);
            continue;
        }

        // One got all the votes
        if (group.votes.some(vote => vote == 0)) {
            let index = group.votes.findIndex(vote => vote != 0);
            let peer = store.peer_list.find(peer => peer.name == group.peers[index]);
            peer.score += 200;
            continue;
        }

        // Votes are distributed
        let total_votes = group.votes.reduce((a, b) => a + b, 0);
        for (let j = 0; j < group.peers.length; j++) {
            let peer = store.peer_list.find(peer => peer.name == group.peers[j]);
            peer.score += 200 * (group.votes[j] / total_votes);
        }
    }

    // Output scores
    let scores = store.peer_list.map(peer => {
        return {
            "name": peer.name,
            "score": peer.score,
        }
    });

    // Notify and show scores
    notify_peers({
        type: "scores",
        scores: scores
    });

    if (store.round == 2) {
        notify_peers({
            type: "finished",
        });
        finish.value.show();
        return
    }

    score.value.set_scores(scores);
    score.value.show();
}

async function start_next_round() {
    store.round += 1;

    if (store.round == 1) {
        round_2();
        return
    }

    if (store.round == 2) {
        round_3();
    }
}

async function score_closed() {
    if (store.winner != null && store.role == "host") {
        next_round.value.show();
    }
}

function reset_round() {
    store.voted = 0;
    store.answered = [];
    prompt.value.reset();
    vote.value.reset();
    score.value.hide();
}

onMounted(() => {
    window.addEventListener('round_finished', async () => {
        start_voting();
    });

    window.addEventListener('voting_finished', async () => {
        end_voting();
    });

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