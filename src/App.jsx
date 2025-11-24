import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SecondaryNav from "./components/SecondaryNav";

import DogDetail from "./components/DogDetail";
import PuppyDetail from "./components/PuppyDetail";

import Home from "./pages/Home";
import About from "./pages/About";
import Dogs from "./pages/Dogs";
import Puppies from "./pages/Puppies";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import AlbumDetail from "./pages/AlbumDetail";
import AlbumForm from "./components/AlbumForm";
import Links from "./pages/Liens";
import News from "./pages/News";
import EditDog from "./pages/EditDog";
import AddDog from "./pages/AddDog";
import AddPuppy from "./pages/AddPuppy";
import EditPuppy from "./pages/EditPuppy";

import AdminLogin from "./pages/AdminLogin";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
       <ScrollToTop />
      <div className="app-layout">    
        <Navbar />
        <SecondaryNav />
        <main className="main-content"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chiens" element={<Dogs />} />
            <Route path="/chiens/:id" element={<DogDetail />} />
            <Route path="/chiens/edit/:id" element={<EditDog />} />
            <Route path="/chiens/add" element={<AddDog />} />
            <Route path="/chiots" element={<Puppies />} />
            <Route path="/chiots/:id" element={<PuppyDetail />} />
            <Route path="/chiots/add" element={<AddPuppy />} />
            <Route path="/chiots/edit/:id" element={<EditPuppy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/galeries" element={<Gallery />} />
            <Route path="/gallery/add" element={<AlbumForm />} />
            <Route path="/gallery/edit/:albumId" element={<AlbumForm isEdit={true} />} />
            <Route path="/gallery/:albumId" element={<AlbumDetail />} />

            <Route path="/liens" element={<Links />} />

            {/* Admin Pages */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
          
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
