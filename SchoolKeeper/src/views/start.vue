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
        <div class="table-container">
            <table>
                <thead>
                    <tr>
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
                        <td>10:00-11:30 Svenska</td>
                        <td>10:00-11:30 Engelska</td>
                        <td>10:00-11:30 Mattematik</td>
                        <td>10:00-11:30 Svenska</td>
                        <td>10:00-11:30 Engelska</td>
                    </tr>
                    <!--Row 2-->
                    <tr>
                        <td>11:30-12:00 Engelska</td>
                        <td>11:30-12:00 Svenska</td>
                        <td>11:30-12:00 Mattematik</td>
                        <td>11:30-12:00 Engelska</td>
                        <td>11:30-12:00 Svenska</td>
                    </tr>
                    <!--Row 3-->
                    <tr>
                        <td>13:00-14:30 Svenska</td>
                        <td>13:00-14:30 Engelska</td>
                        <td>13:00-14:30 Mattematik</td>
                        <td>13:00-14:30 Svenska</td>
                        <td>13:00-14:30 Engelska</td>
                    </tr>
                    <!--Row 4-->
                    <tr>
                        <td>14:30-15:00 Engelska</td>
                        <td>14:30-15:00 Svenska</td>
                        <td>14:30-15:00 Mattematik</td>
                        <td>14:30-15:00 Svenska</td>
                        <td>14:30-15:00 Mattematik</td>
                    </tr>
                    <!--Row 5-->
                    <tr>
                        <td>15:00-16:30 Svenska</td>
                        <td>15:00-16:30 Engelska</td>
                        <td>15:00-16:30 Svenska</td>
                        <td>15:00-16:30 Engelska</td>
                        <td>15:00-16:30 Mattematik</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button v-if="currentUser.access === 'Admin'"type="submit">Edit</button>
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
th, td {
    padding: 15px;
    border-bottom: 1px solid #dee2e6;
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