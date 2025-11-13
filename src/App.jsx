import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Dogs from "./pages/Dogs";
import Puppies from "./pages/Puppies";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import News from "./pages/News";

function App() {
  return (
    <Router>
      <div className="app-layout">    
        <Navbar />
        <main className="main-content"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chiens" element={<Dogs />} />
            <Route path="/chiots" element={<Puppies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/galeries" element={<Gallery />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
