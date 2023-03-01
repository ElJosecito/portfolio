import "./assets/styles/tailwind.css";
import SubApp from "./SubApp";
import "./assets/components/Loader";
import { useEffect, useState} from "react";
import Loader from "./assets/components/Loader";

function App() {

  const [loading, setLoading] = useState(false)

  const LoadingFunc = () =>{

    document.getElementById("loader_id").style.display = "block"
    document.getElementById("subApp_id").style.display = "none"

    window.onload = ()=>{
      console.log("Carga")
      setLoading(true)
    }

    if(loading){
      document.getElementById("loader_id").style.display = "none"
      document.getElementById("subApp_id").style.display = "block"
    }
      /*  */
  }

  useEffect(() => {
    LoadingFunc()
  },);

  return (
    <>
      <div id="loader_id">
      <Loader />
      </div>
      <div id="subApp_id">
      <SubApp />
      </div>
    </>
  );
}

export default App;
