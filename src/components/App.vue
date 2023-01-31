<template>
    <div class="complete-view">
        <div class="dynamic-view">
            <router-view />
        </div>
    </div>
    <PeerJS ref="peerJS" />
</template>

<script setup>
import { ref } from 'vue';
import PeerJS from './PeerJS.vue';

const peerJS = ref(null);
</script>