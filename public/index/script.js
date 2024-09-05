document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    const joinButton = document.getElementById('joinButton');
  
    auth.onAuthStateChanged((user) => {
      if (user) {
        updateNavLinks(user);
      } else {
        displayGuestLinks();
      }
    });
  
    function updateNavLinks(user) {
      navLinks.innerHTML = `
        <li><a href="/testimony/${user.username}">Testimony</a></li>
        <li><a href="/profile/${user.username}">Profile</a></li>
        <li><a href="/search/index.html">Search</a></li>
        <li><a href="#" id="logoutButton">Logout</a></li>
      `;
      document.getElementById('logoutButton').addEventListener('click', () => {
        auth.signOut().then(() => {
          window.location.href = '/login/index.html';
        });
      });
    }
  
    function displayGuestLinks() {
      navLinks.innerHTML = `
        <li><a href="/signup/index.html">Sign Up</a></li>
        <li><a href="/login/index.html">Login</a></li>
        <li><a href="/search/index.html">Search</a></li>
      `;
    }
  
    joinButton.addEventListener('click', () => {
      window.location.href = '/signup/index.html';
    });
  });
  