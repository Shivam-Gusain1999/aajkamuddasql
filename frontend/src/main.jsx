
import './index.css'
import App from './App.jsx'
import ReactDom from "react-dom/client"
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './components/admin/UserContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

ReactDom.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </HelmetProvider>
)
