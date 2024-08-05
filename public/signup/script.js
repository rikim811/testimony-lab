document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const usernameAvailability = document.getElementById('usernameAvailability');
  const nameInappropriate = document.getElementById('nameInappropriate');
  const passwordStrength = document.getElementById('passwordStrength');
  const signupForm = document.getElementById('signupForm');
  const loginInsteadButton = document.getElementById('loginInsteadButton');

  let bannedWords = [];

  // Load banned words from bannedlist.json
  async function loadBannedWords() {
    try {
      const response = await fetch('../bannedlist.json');
      const data = await response.json();
      bannedWords = data || [];
      console.log('Banned words loaded:', bannedWords);
    } catch (error) {
      console.error('Error loading banned words:', error);
      bannedWords = [];
    }
  }

  // Check for inappropriate words
  function isInappropriate(text) {
    if (!Array.isArray(bannedWords) || bannedWords.length === 0) {
      console.error('Banned words array is not properly initialized:', bannedWords);
      return false;
    }

    // Convert the text to lowercase for a case-insensitive comparison
    const lowerCaseText = text.toLowerCase();

    // Check if any banned word is a substring of the lowercased text
    return bannedWords.some(word => lowerCaseText.includes(word.toLowerCase()));
  }

  // Check username availability and appropriateness
  usernameInput.addEventListener('input', async () => {
    const username = usernameInput.value.trim();
    const regex = /^[a-zA-Z0-9]*$/;

    if (username) {
      if (!regex.test(username)) {
        usernameAvailability.textContent = 'Username can only contain English characters and numbers without spaces';
        usernameAvailability.style.color = 'red';
        return;
      }

      if (isInappropriate(username)) {
        usernameAvailability.textContent = 'Username is inappropriate';
        usernameAvailability.style.color = 'red';
        return;
      }

      const usersRef = db.collection('users');
      const querySnapshot = await usersRef.where('username', '==', username).get();
      if (querySnapshot.empty) {
        usernameAvailability.textContent = 'Username is available';
        usernameAvailability.style.color = 'green';
      } else {
        usernameAvailability.textContent = 'Username is taken';
        usernameAvailability.style.color = 'red';
      }
    } else {
      usernameAvailability.textContent = '';
    }
  });

  // Check name appropriateness
  nameInput.addEventListener('input', () => {
    const name = nameInput.value.trim();
    if (name && isInappropriate(name)) {
      nameInappropriate.textContent = 'Name is inappropriate';
      nameInappropriate.style.color = 'red';
    } else {
      nameInappropriate.textContent = '';
    }
  });

  // Password strength checker
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    const length = password.length >= 8;

    document.getElementById('lowercase').style.color = lowercase ? 'green' : 'red';
    document.getElementById('uppercase').style.color = uppercase ? 'green' : 'red';
    document.getElementById('number').style.color = number ? 'green' : 'red';
    document.getElementById('length').style.color = length ? 'green' : 'red';

    if (lowercase && uppercase && number && length) {
      passwordStrength.textContent = 'Password strength: Strong';
      passwordStrength.style.color = 'green';
    } else {
      passwordStrength.textContent = 'Password strength: Weak';
      passwordStrength.style.color = 'red';
    }
  });

  // Sign up form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const password = passwordInput.value;
    const nextStep = document.getElementById('nextStep').value;

    const regex = /^[a-zA-Z0-9]*$/;

    if (!regex.test(username) || isInappropriate(username) || isInappropriate(name)) {
      alert('Please choose an appropriate username and name.');
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await db.collection('users').doc(user.uid).set({
        username: username,
        email: email,
        name: name,
        testimony: '',
        title: '',
        tags: [],
        lastEdited: firebase.firestore.FieldValue.serverTimestamp()
      });

      if (nextStep === 'profile') {
        window.location.href = `/profile/${username}?edit=true`;
      } else {
        window.location.href = `/testimony/${username}?edit=true`;
      }

    } catch (error) {
      console.error('Error signing up: ', error);
    }
  });

  // Redirect to login page
  if (loginInsteadButton) {
    loginInsteadButton.addEventListener('click', () => {
      window.location.href = '../login/index.html';
    });
  }

  // Load the banned words when the page loads
  loadBannedWords();
});
