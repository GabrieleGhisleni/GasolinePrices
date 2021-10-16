import React, { Component } from "react";
import DetailForm from "./DetailForm";
import Map from "./Map";
import {Row, Col} from 'reactstrap';

class MainBody extends Component{
    constructor(props){
        super(props)
        this.state = {
            defaultCoordinates : [0,0],
            comune: null,
            carburante: 'Benzina',
            area: '3'
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.inputForm = this.inputForm.bind(this)
    }

    onSubmit(evt){
        console.log('something will happpen', this.state)
        evt.preventDefault()

    }

    inputForm(evt){
        this.setState({[evt.target.name] : evt.target.value})
    }

    render(){
        console.log('Main properties ', this.state)
        return(
            <React.Fragment>
                    <Row className='primaryRow'>
                        <Col xs='11' sm='5' md='5' >
                            <DetailForm 
                            carburante = {this.state.carburante}
                            area = {this.state.area}
                            inputForm = {this.inputForm}
                            onSubmit = {this.onSubmit} />
                        </Col>
                        <Col xs='12' sm='7'>
                            <Map />
                        </Col>
                    </Row>
            </React.Fragment>
        );
    }
}

export default MainBody;