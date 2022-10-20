import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';

firebase.initializeApp({
  apiKey: 'AIzaSyCgZshzSOUw8w5y_G0hAPDQEL2ioSH5JvM',
  authDomain: 'chat-app-v1-e0410.firebaseapp.com',
  projectId: 'chat-app-v1-e0410',
  storageBucket: 'chat-app-v1-e0410.appspot.com',
  messagingSenderId: '645992615706',
  appId: '1:645992615706:web:f66d62511554489729e6a3',
  measurementId: 'G-RZ83X36JFS',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header"><h2>Вишневий сад</h2> <SignOut /></header>
      
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

const SignOut = () => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button className='sign-in' onClick={signInWithGoogle}>Sign in with google</button>;
};

const ChatMessage = props => {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      {' '}
      <img src={photoURL} alt="" height="50px" width="50px"/> <p>{text}</p>
    </div>
  );
};

const ChatRoom = () => {

  const scrollDownRef = useRef(); 
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt'); // .limit(25)
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  setTimeout(()=>{
    Array.from(document.querySelectorAll('.message')).pop().scrollIntoView({behavior: 'smooth'}); 
  }, 300);

const sendMessage = async (e)=>{
  e.preventDefault();

  const {uid, photoURL} = auth.currentUser;

  await messagesRef.add({
    text: formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  })

  setFormValue('');
  scrollDownRef.current.scrollIntoView({behavior:'smooth'})
}

  return (
    <>
      <main>
        {messages &&
          messages.map(message => (
            <ChatMessage key={Math.random().toString()} message={message} /> //key={message.id}
          ))}
          <div ref={scrollDownRef}/>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
        <button type="submit">✔</button>
      </form>
    </>
  );
};
export default App;
