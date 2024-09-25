<template>
    <div>
        <NavBar/>
    </div>
<div class="Schedule">

    <div class="Container">
        <h3>Schedule</h3>
    </div>
    <div class="name">
        <p>Namn:</p>
    </div>
    <div class="section">
        <p>Class:</p>
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

</div>

</template>

<script>
import NavBar from "@/components/Nav-Bar.vue";

export default {
    name: 'Start',
    components: {
        NavBar,
    }
}
</script>
