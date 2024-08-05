document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginInput = document.getElementById('loginInput').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    loginError.textContent = '';

    try {
      let email = loginInput;

      // Check if loginInput is a username
      if (!validateEmail(loginInput)) {
        const querySnapshot = await db.collection('users').where('username', '==', loginInput).get();
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          email = userDoc.data().email;
        } else {
          throw new Error('Username not found');
        }
      }

      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = '../index/index.html'; // Redirect to home page or another page
    } catch (error) {
      loginError.textContent = `Error logging in: ${error.message}`;
    }
  });

  // Helper function to validate email format
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }

  document.getElementById('branding').addEventListener('click', () => {
    window.location.href = '../index';
  });
});
