<template>
  <div id="app" class="vh-100 text-center bg-light text-secondary">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>
