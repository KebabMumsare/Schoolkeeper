<template>
    <NavBar site="start"/>
    <main class="Schedule">
        <div class="Container">
            <h3>Schedule</h3>
        </div>
        <div class="name">
            <p>Namn: {{ currentUser.name }}</p>
        </div>
        <div class="section">
            <p>Class: {{ currentUser.class }}</p>
        </div>
        <table>
            <thead>
                <th>Tid</th>
                <th>Måndag</th>
                <th>Tisdag </th>
                <th>Onsdag </th>
                <th>Torsdag </th>
                <th>Fredag</th>
            </thead>

            <tbody>              
                <!--Row 1-->
                <tr>
                    <td>10:00-11:30</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Mattematik</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                </tr>
                <!--Row 2-->
                <tr>
                    <td>11:30-12:00</td>
                    <td>Engelska</td>
                    <td>Svenska</td>
                    <td>Mattematik</td>
                    <td>Engelska</td>
                    <td>Svenska</td>
                </tr>
                <!--Row 3-->
                <tr>
                    <td>13:00-14:30</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Mattematik</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                </tr>
                <!--Row 4-->
                <tr>
                    <td>14:30-15:00</td>
                    <td>Engelska</td>
                    <td>Svenska</td>
                    <td>Mattematik</td>
                    <td>Svenska</td>
                    <td>Mattematik</td>
                </tr>
                <!--Row 5-->
                <tr>
                    <td>15:00-16:30</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Mattematik</td>
                </tr>
            </tbody>
        </table>
        <button v-if="currentUser.access === 'Admin'"type="submit">Edit</button>
    </main>
</template>

<style scoped>
table {
    text-align: center;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #6184b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
td {
    padding: 5px;
    border: solid black 1px;
}
tbody {
    border: solid black 1px;
}

.Schedule {
    border: solid black 0px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    background-color: #f8f9fa;
    padding: 1rem;
}
</style>

<script>
import NavBar from "@/components/Nav-Bar.vue";
import { useStorage } from "@vueuse/core";  // Named import

//Göra randomizer för lektions tid/länd

export default {
    name: 'Start',
    components: {
        NavBar,
    },
    data() {
        return {
            currentUser: useStorage('currentUser', { name: '', access: '', class: '' })
        };
    },
};
</script>
