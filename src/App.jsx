// App.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import AddDomainForm from './components/AddDomainForm';
import AddEndpointForm from './components/AddEndpointForm';
import AddRestApiForm from './components/AddRestAPIForm';
import Navbar from './components/Appbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <>
      <Navbar />

      {/* Container utama */}
      <div className="container mt-5 pt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-domain" element={<AddDomainForm />} />
          <Route path="/add-endpoint" element={<AddEndpointForm />} />
          <Route path="/add-restapi" element={<AddRestApiForm />} />
          <Route path="*" element={<div className="text-center mt-5">Page Not Found</div>} />
        </Routes>
      </div>

      {/* Toast Container untuk notifikasi */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
