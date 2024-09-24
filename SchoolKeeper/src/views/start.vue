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
    border-radius: 0 0 30px 30px;
}

li {
    margin: 0 0;
    display: flex;
    align-items: center;
    height: 100%;
}

a {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
    height: 100%;
    padding: .5rem .7rem;
}

a:hover {
    background-color: #6184b8;
    color: #ddd;
}

.schema a {
    padding: 0;
    background-color: #444;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
}
.schema a:hover {
    background-color: #666;
    color: #fff;
}

img {
    max-width: 80%;
    max-height: 80%;
    margin-top: .7rem;
    padding: .4rem;
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
    .left-button {
        border-radius: 0 0 0 30px;
    }
    .right-button {
        border-radius: 0 0 30px 0;
    }

</style>

<script>


</script>

<template>
    <main>
        <div>
            <nav>
                <ul>
                    <li><a href="" class="left-button">Personal</a></li>
                    <li class="schema">
                        <a href="">
                            <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" alt="">
                        </a>
                    </li>
                    <li>
                        <a href="" class="right-button">
                            <img src="https://e7.pngegg.com/pngimages/166/839/png-clipart-computer-icons-bell-black-silhouette.png" alt="">
                    </a>
                </li>
                </ul>
            </nav>
        </div>
    </main>
</template>

