import React from "react";
import { Navbar, NavbarBrand} from 'reactstrap';

const MyNavbar: React.FC = () => {
    return (
        <React.Fragment>
            <Navbar light expand='md' id='navBar'>
                <NavbarBrand id='navBrand' className='text-center'>Open Gasoline</NavbarBrand>
            </Navbar>
        </React.Fragment>
    );
}

export default MyNavbar;
