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
                <th>Måndag</th>
                <th>Tisdag </th>
                <th>Onsdag </th>
                <th>Torsdag </th>
                <th>Fredag</th>
            </thead>

            <tbody>
                <!--Row 1-->
                <tr>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Mattematik</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                </tr>
                <!--Row 2-->
                <tr>
                    <td>Engelska</td>
                    <td>Svenska</td>
                    <td>Mattematik</td>
                    <td>Engelska</td>
                    <td>Svenska</td>
                </tr>
                <!--Row 3-->
                <tr>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Mattematik</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                </tr>
                <!--Row 4-->
                <tr>
                    <td>Engelska</td>
                    <td>Svenska</td>
                    <td>Mattematik</td>
                    <td>Svenska</td>
                    <td>Mattematik</td>
                </tr>
                <!--Row 5-->
                <tr>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Svenska</td>
                    <td>Engelska</td>
                    <td>Mattematik</td>
                </tr>
            </tbody>
        </table>

    </main>
</template>

<style scoped>
table {
    text-align: center;
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
