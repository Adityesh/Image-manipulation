import React from 'react';
import Nav from './components/UI/Nav';
import Footer from './components/UI/Footer';
import './Main.css';
import Content from './components/UI/Content';

const App = (props) => {

  return (
    <div id="App">
      <Nav />
      <Content />
      <Footer />
    </div>
  )
};

export default App;
