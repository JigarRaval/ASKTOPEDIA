import { BrowserRouter as Router } from "react-router-dom";
import RoutesList from "./router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen">
        <RoutesList />
      </div>
      <Footer />
    </Router>
  );
};

export default App;


