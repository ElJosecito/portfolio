import React from 'react'
import ReactDOM from 'react-dom/client'
import '../src/assets/styles/style.css'
import App from './App'
import {BrowserRouter as Router} from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Router>
      
      <App/>
      
    </Router>
  </>
)
