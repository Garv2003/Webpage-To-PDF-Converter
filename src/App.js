import React from 'react';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Body from './components/Body/Body';

function App() {
  return (
    <div className="container flex flex-col mx-auto  w-10/12">
      <Navbar />
      <Body/>
      <Footer />
    </div>
  );
}

export default App;

