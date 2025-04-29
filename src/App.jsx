import "./App.css";
import { Route,Routes } from "react-router-dom";
import Home from "./pages/Home"
//react-router-dom is used to:Show different pages (components).When user clicks buttons or links.Without reloading the whole pagereact-router-dom is used to:Show different pages (components)
function App() {
  return (
    //class is a reserved keyword in JavaScript (used for defining classes).So in JSX (which is JavaScript + HTML-like syntax), we use className to avoid confusion.
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      {/* //Width = 100% of the screen (full width) .Minimum height = 100% of the screen (full height if needed)*/}
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;