<template>
    <div class="wraper">
    <div class="components">
        <div class="spacer"></div>
        <div class="button-container">
            <button>Create</button>
        </div>
    </div>
    <div class="schedule">
    </div>
</div>
  </template>

<style scoped>

.wraper {
display: flex;
}
.components {
    display: flex;
    flex-direction: column;
    background-color: bisque;
    height: 20vh;
    width: 10vw;
    justify-content: flex-end;
}
.button-container {
    align-self: center;
}
.schedule {
    height: 20vh;
    width: 10vw;
}
button {
    height: 5vh;
    width: 8vw;
    background-color: #4fc0e5;
}
</style>
  
  <script>
import { type ReactElement } from 'react';
import { css, jsx } from '@emotion/react';
  </script>
