document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchResults = document.getElementById('searchResults');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value.trim().toLowerCase();
    const type = "profile";

    if (query) {
      searchResults.innerHTML = 'Searching...';

      const searchRef = type === 'profile' ? db.collection('users') : db.collection('testimonies');

      searchRef.get()
        .then((querySnapshot) => {
          const results = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            const fullName = data.name ? data.name.toLowerCase() : '';
            const username = data.username ? data.username.toLowerCase() : '';
            const title = data.title ? data.title.toLowerCase() : '';
            const tags = data.tags ? data.tags.map(tag => tag.toLowerCase()) : [];

            if (
              fullName.includes(query) ||
              username.includes(query) ||
              title.includes(query) ||
              tags.some(tag => tag.includes(query))
            ) {
              results.push(data);
            }
          });

          if (results.length > 0) {
            searchResults.innerHTML = '';
            results.forEach((data) => {
              const resultItem = document.createElement('div');
              resultItem.classList.add('resultItem');
              resultItem.innerHTML = `
                <p><strong>Username:</strong> ${data.username}</p>
                ${data.tags ? `<p><strong>Tags:</strong> ${data.tags.join(', ')}</p>` : ''}
                <div>
                  <button onclick="location.href='/profile/${data.username}'">VIEW PROFILE</button>
                  <button onclick="location.href='/testimony/${data.username}'">VIEW TESTIMONY</button>
                </div>
              `;
              searchResults.appendChild(resultItem);
            });
          } else {
            searchResults.innerHTML = 'No results found.';
          }
        })
        .catch((error) => {
          console.error(`Error searching ${type}:`, error);
          searchResults.innerHTML = `Error searching ${type}. Please try again.`;
        });
    } else {
      searchResults.innerHTML = 'Please enter a search query.';
    }
  });

  function updateNavLinks(user) {
    const navLinks = document.getElementById('navLinks');
    navLinks.innerHTML = '';

    if (user) {
      db.collection('users').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const username = userData.username || user.email.split('@')[0];
          navLinks.innerHTML = `
            <li><a href="/testimony/${username}">Testimony</a></li>
            <li><a href="/profile/${username}">Profile</a></li>
            <li><a href="/search/index.html">Search</a></li>
            <li><a href="#" id="logoutButton">Logout</a></li>
          `;
          const logoutButton = document.getElementById('logoutButton');
          if (logoutButton) {
            logoutButton.addEventListener('click', () => {
              auth.signOut().then(() => {
                window.location.href = '/login/index.html';
              });
            });
          }
        }
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
    } else {
      navLinks.innerHTML = `
        <li><a href="/signup/index.html">Sign Up</a></li>
        <li><a href="/login/index.html">Login</a></li>
        <li><a href="/search/index.html">Search</a></li>
      `;
    }
  }

  auth.onAuthStateChanged((user) => {
    updateNavLinks(user);
  });
});
