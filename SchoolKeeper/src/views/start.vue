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
<<<<<<< Updated upstream
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
=======
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Tid</th>
                        <th>Måndag</th>
                        <th>Tisdag</th>
                        <th>Onsdag</th>
                        <th>Torsdag</th>
                        <th>Fredag</th>
                    </tr>
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
        </div>
>>>>>>> Stashed changes
    </main>
</template>

<style scoped>
.table-container {
    overflow-x: auto;
    margin-top: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
}
<<<<<<< Updated upstream
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
=======

th, td {
    padding: 15px;
    border-bottom: 1px solid #dee2e6;
>>>>>>> Stashed changes
}

thead {
    background-color: #f1f3f5;
    color: #495057;
    font-weight: bold;
}

tr:hover {
    background-color: #f8f9fa;
}

.Schedule {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #f8f9fa;
    padding: 1.5rem;
}

.name, .section {
    margin-bottom: 1rem;
    font-size: 1.1rem;
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