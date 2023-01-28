<template>
    <div class="complete-view">
        <div class="dynamic-view">
            <router-view />
        </div>
    </div>
    <PeerJS />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from './NavBar.vue';
import PeerJS from './PeerJS.vue';
</script>