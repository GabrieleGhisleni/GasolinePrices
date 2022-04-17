import { Component } from "react";
import MyNavbar from "./Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-social/bootstrap-social.css';
import { Footer } from "./Footer";
import MainBody from "./MainBody";
import countapi from 'countapi-js';

class Main extends Component{
    componentDidMount(){countapi.hit('opengasoline.com', '814999e4-947f-4276-8bca-2d983c3250dd')}

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