<template>
    <main>
      <div class="nav-wrap">
        <div class="nav-container">
          <nav>
            <ul class="nav-list">
              <li class="nav-item">
                <a href="/personal" class="nav-link">
                  <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="" class="nav-icon">
                </a>
              </li>
              <li class="nav-item">
                <a href="/start" class="nav-link nav-link-active">
                  <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" alt="" class="nav-icon-selected">
                </a>
              </li>
              <li class="nav-item">
                <a href="" class="nav-link">
                  <img src="https://www.iconpacks.net/icons/1/free-bell-icon-860-thumb.png" alt="" class="nav-icon">
                </a>
              </li>
              <li class="nav-item">
                <a href="/filer" class="nav-link">
                  <img src="https://cdn-icons-png.flaticon.com/512/686/686112.png" alt="" class="nav-icon">
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  </template>
  
  <style scoped>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  
  .nav-wrap {
    position: fixed;
    height: 7rem;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .nav-container {
    background-color: #f8f9fa;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 5rem;
  }
  
  .nav-list {
    display: flex;
    justify-content: center;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-item {
    position: relative;
    margin: 0 15px;
    height: 4rem;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    height: 100%;
  }
  
  .nav-link-active {
    width: 5.5rem;
    height: 5.5rem;
    border: solid black 0px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    background-color: #f8f9fa;
  }
  
  .nav-icon {
    width: 30px;
    height: 30px;
    transition: transform 0.2s ease-in-out;
    margin: 2rem;
  }
  
  .nav-icon-selected {
    width: 5rem;
    height: 5rem;
    position: absolute;
  }
  
  .nav-icon:hover {
    transform: scale(1.3);
  }
  </style>
  
  <script>
  export default {
    name: 'NavBar',
  }
  </script>
  