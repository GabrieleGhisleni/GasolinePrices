import { Component } from "react";
import MyNavbar from "./Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-social/bootstrap-social.css';
import { Footer } from "./Footer";
import MainBody from "./MainBody";

class Main extends Component{

    render(){
        return(
            <div>
                <MyNavbar />
                <MainBody />
                <Footer />
            </div>
        )
    }
}

export default Main;