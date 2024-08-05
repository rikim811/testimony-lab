document.addEventListener('DOMContentLoaded', () => {
  const userId = 'Dju1URXVRKYFFYm4E2QaLexaJqT2'; // Moderator user ID
  const userList = document.getElementById('userList');
  const searchResults = document.getElementById('searchResults');

  auth.onAuthStateChanged((user) => {
    if (user && user.uid === userId) {
      // Only load user data if explicitly called
    } else {
      alert('Access denied');
      window.location.href = '../index.html';
    }
  });

  document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchQuery').value.trim().toLowerCase();
    const searchType = document.getElementById('searchType').value;
    if (query) {
      searchResults.innerHTML = 'Searching...';
      if (searchType === 'testimony') {
        searchTestimonies(query);
      } else if (searchType === 'comments') {
        searchComments(query);
      } else {
        searchUsersByField(searchType, query);
      }
    }
  });

  document.getElementById('showAllButton').addEventListener('click', () => {
    const searchType = document.getElementById('searchType').value;
    searchResults.innerHTML = 'Loading all...';
    loadAllUsers(searchType);
  });

  async function searchUsersByField(field, query) {
    try {
      const usersRef = db.collection('users');
      let querySnapshot;
      if (field === 'tags') {
        querySnapshot = await usersRef.where(field, 'array-contains', query).get();
      } else {
        querySnapshot = await usersRef.where(field, '==', query).get();
      }
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push(data);
      });
      displaySearchResults(results);
    } catch (error) {
      console.error(`Error searching users by ${field}:`, error);
      searchResults.innerHTML = `Error searching users by ${field}. Please try again.`;
    }
  }

  async function searchTestimonies(query) {
    try {
      const testimoniesRef = db.collection('testimonies');
      const querySnapshot = await testimoniesRef.get();
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.content && data.content.toLowerCase().includes(query)) {
          results.push(data);
        }
      });
      displaySearchResults(results);
    } catch (error) {
      console.error('Error searching testimonies:', error);
      searchResults.innerHTML = 'Error searching testimonies. Please try again.';
    }
  }

  async function searchComments(query) {
    try {
      const commentsRef = db.collection('comments'); // Adjust collection name as needed
      const querySnapshot = await commentsRef.get();
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.content && data.content.toLowerCase().includes(query)) {
          results.push(data);
        }
      });
      displaySearchResults(results);
    } catch (error) {
      console.error('Error searching comments:', error);
      searchResults.innerHTML = 'Error searching comments. Please try again.';
    }
  }

  async function loadAllUsers(field) {
    try {
      const usersRef = db.collection('users');
      const querySnapshot = await usersRef.get();
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (field === 'tags' && Array.isArray(data[field])) {
          results.push(data);
        } else if (data[field]) {
          results.push(data);
        }
      });
      displaySearchResults(results);
    } catch (error) {
      console.error(`Error loading all users by ${field}:`, error);
      searchResults.innerHTML = `Error loading all users by ${field}. Please try again.`;
    }
  }

  function displaySearchResults(results) {
    if (results.length > 0) {
      searchResults.innerHTML = '';
      results.forEach((data) => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('resultItem');
        resultItem.innerHTML = `
          <p><strong>Username:</strong> ${data.username}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Social Media:</strong> ${data.socialMedia}</p>
          <p><strong>Tags:</strong> ${data.tags ? data.tags.join(', ') : ''}</p>
          <button onclick="deleteUser('${data.id}')">Delete/Ban User</button>
          <button onclick="location.href='/profile/${data.username}'">View Profile</button>
                    <button onclick="location.href='/testimony/${data.username}'">View Testimony</button>
        `;
        searchResults.appendChild(resultItem);
      });
    } else {
      searchResults.innerHTML = 'No results found.';
    }
  }

  async function deleteUser(userId) {
    try {
      await db.collection('users').doc(userId).delete();
      alert('User banned/deleted successfully!');
      loadUserData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  }
});
