import './App.css';
import {Routes, Route, NavLink, Outlet, Link} from "react-router-dom"
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Transactions from './components/Transactions';
import Accounts from './components/Accounts';
import Categories from './components/Categories';
import Settings from './components/Settings';
import { UserProvider } from './context/UserContext';


function App() {

  return (
    <>
    <UserProvider>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/transactions' element={<Transactions /> } />
        <Route path='/accounts' element={<Accounts /> } />
        <Route path='/categories' element={<Categories /> } />
        <Route path='/settings' element={<Settings /> } />
        <Route path='*' element={<Home />} />
      </Routes>
    </UserProvider>


    </>
  );
}

export default App;
