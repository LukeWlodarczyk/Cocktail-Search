import React from 'react';
import Header from './components/Header';
import Form from './containers/Form';
import Info from './containers/Info';
import 'weather-icons/css/weather-icons.css';
 
const App = () => (
    <div className="container">
      <Header />
      <Form />
      <Info />
    </div>
)
 
export default App
