<template>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Peer } from "peerjs";
import { store, peer_opened } from "/js/store.js";

onMounted(() => {
    window.peer = new Peer();

    window.peer.on('open', function (id) {
        store.peer_id = id;
        peer_opened();
    });

    window.peer.on('connection', (connection) => {
        connection.on('data', (data) => {
            console.log(data);
            if (data.type == "join") {
                store.peer_list.push({
                    name: data.name,
                    conn: connection
                });
                store.peer_names.push(data.name);
                return
            }

            if (data.type == "answer") {
                store.answers[store.round].push({
                    "name": data.name,
                    "answer": data.answer,
                });

                store.peer_list.forEach((peer) => {
                    peer.conn.send({
                        type: "answered",
                        name: data.name,
                        answer: data.answer,
                    });
                });

                // Check if round ended by guest answer
                if (store.answers[store.round].length == store.peer_names.length) {
                    console.log("Round ended!");
                }
                return
            }
        });

        connection.on('close', () => {
            console.log("Connection closed: " + connection)
            let index = store.peer_list.findIndex((peer) => {
                return peer.conn == connection;
            });
            store.peer_list.splice(index, 1);
        });
    })
})
</script>