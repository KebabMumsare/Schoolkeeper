<style scoped>

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #333;
    height: 60px;
}

li {
    margin: 0 15px;
}

a {
    display: inline-block;
    padding: 12px 22px;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
}

a:hover {
    background-color: #6184b8;
    color: #ddd;
}

.schema a {
    padding: 5px 10px;
    background-color: #444;
    width: 100px;
    height: 100px;
    align-items: center;
    justify-content: center;
}
.schema a:hover {
    background-color: #666;
    color: #fff;
}

.schema img {
    max-width: 100%;
    max-height: 100%;
    padding: .51rem;
    margin-top: .7rem;
}

main {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    .container {
        width: 100%;
        max-width: 100%;
        padding: 0;
        margin: 0;
    }

</style>

<script>


</script>

<template>
    <main>
        <div>
            <nav>
                <ul>
                    <li><a href="">Personal</a></li>
                    <li class="schema">
                        <a href="">
                            <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" alt="">
                        </a>
                    </li>
                    <li><a href="">Notifications</a></li>
                </ul>
            </nav>
        </div>
    </main>
</template>

