import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import AddDomainForm from './components/AddDomainForm';
import AddEndpointForm from './components/AddEndpointForm';
import AddRestApiForm from './components/AddRestApiForm';
import Footer from './components/Footer';
import Navbar from './components/Appbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-domain" element={<AddDomainForm />} />
          <Route path="/add-endpoint" element={<AddEndpointForm />} />
          <Route path="/add-restapi" element={<AddRestApiForm />} />
          <Route
            path="*"
            element={
              <div className="text-center text-gray-600 mt-20 text-lg font-medium">
                Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
      {/* Footer */}
      <Footer />

      {/* Toast Notification */}
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
        toastClassName="bg-white text-gray-800 shadow-lg rounded-lg px-4 py-3"
        bodyClassName="text-sm font-medium"
      />
    </>
  );
}

export default App;
