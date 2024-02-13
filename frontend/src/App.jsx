import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { useAuthContext } from './context/authContext'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import MyImages from './pages/MyImages';

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className='p-4 h-screen bg-gray-800 flex items-center justify-center'>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/my-images' element={authUser ? <MyImages /> : <Navigate to='/login' />} />
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <Signup />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
