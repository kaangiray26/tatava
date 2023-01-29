<template>
    <div class="complete-view">
        <div class="dynamic-view">
            <router-view />
        </div>
    </div>
    <PeerJS ref="peerJS" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store } from "/js/store.js";
import PeerJS from './PeerJS.vue';

const peerJS = ref(null);
</script>