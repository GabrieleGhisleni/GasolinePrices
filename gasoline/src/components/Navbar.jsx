import React, { Component } from "react";
import { Navbar, NavbarBrand, Row, Col, Container} from 'reactstrap';

class MyNavbar extends Component{
    constructor(props) {
        super(props)
        this.state = {
            isOpen : true
        }
        this.navToggler = this.navToggler.bind(this)   
    }
    navToggler(){
        this.setState({isOpen: !this.state.isOpen})
    }
    render(){
        return(
            <React.Fragment>
                <Navbar light expand='md' id='navBar'>
                    <NavbarBrand id='navBrand' className='text-center'>Open Gasoline</NavbarBrand>
                </Navbar>
            </React.Fragment>
        );
    }
}

export default MyNavbar;