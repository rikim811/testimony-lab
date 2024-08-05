auth.onAuthStateChanged(async (user) => {
  if (user) {
    const docRef = db.collection('users').doc(user.uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      document.getElementById('testimony').value = docSnap.data().testimony;
    } else {
      console.log('No such document!');
    }
  } else {
    window.location.href = '../login/index.html';
  }
});

document.getElementById('testimonyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const testimony = document.getElementById('testimony').value;

  try {
    const user = auth.currentUser;
    if (user) {
      await db.collection('users').doc(user.uid).set({ testimony }, { merge: true });
      alert('Testimony saved!');
    } else {
      window.location.href = '../login/index.html';
    }
  } catch (error) {
    console.error('Error saving testimony: ', error);
  }
});

document.getElementById('logout').addEventListener('click', async (e) => {
  e.preventDefault();
  await auth.signOut();
  window.location.href = '../index/index.html';
});
