<template>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Peer } from "peerjs";
import { store, peer_opened, is_round_finished, notify_peers } from "/js/store.js";
import { is_voting_finished } from '../js/store';

onMounted(() => {
    window.peer = new Peer();

    window.peer.on('open', function (id) {
        store.peer_id = id;
        peer_opened();
    });

    window.peer.on('connection', (connection) => {
        connection.on('data', (data) => {
            // New guest joined
            if (data.type == "join") {
                store.peer_list.push({
                    name: data.name,
                    conn: connection
                });
                return
            }

            // Guest answered
            if (data.type == "answer") {
                store.answers[store.round].push({
                    "name": data.name,
                    "answer": data.answer.answer,
                    "index": data.answer.index,
                });
                store.answered.push({
                    "name": data.name,
                });

                // Notify other guests
                notify_peers({
                    type: "answered",
                    name: data.name,
                });

                // Check if round ended
                is_round_finished();
                return
            }

            // Guest voted
            if (data.type == "vote") {
                let group = store.groups[data.vote.index];
                let index = group.peers.findIndex(name => name == data.vote.name);
                group.votes[index] += 1;
                store.voted += 1;

                // Check if round ended
                is_voting_finished();
                return
            }
        });

        // Guest disconnected
        connection.on('close', () => {
            let index = store.peer_list.findIndex((peer) => {
                return peer.conn == connection;
            });
            store.peer_list.splice(index, 1);
        });
    })
})
</script>