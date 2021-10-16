import { Component } from "react";
import MyNavbar from "./Navbar";
import {Row, Col} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-social/bootstrap-social.css';
import { Footer } from "./Footer";

class Main extends Component{

    render(){
        return(
            <div>
                <MyNavbar />
                <Row>
                    hey
                    {/* <Body/> */}
                </Row>
                < Footer />
            </div>
        )
    }
}

export default Main;