import {Switch , Route , Redirect,BrowserRouter} from "react-router-dom";
import './App.css';
import "../node_modules/bootstrap-css-only/css/bootstrap.min.css";
import Home from "./components/Home/Home";



const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={FormPage} />
        <Route exact path="/user" component={User} />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
}



export default App;
