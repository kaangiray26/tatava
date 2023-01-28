<template>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Peer } from "peerjs";
import { store, peer_opened } from "/js/store.js";

onMounted(() => {
    let peer = new Peer();
    peer.on('open', function (id) {
        store.peer_id = id;
        peer_opened();
    });
})
</script>