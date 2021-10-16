import React, { Component } from "react";
import DetailForm from "./DetailForm";
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
        this.inputComune = this.inputComune.bind(this)
        this.inputGasolio = this.inputGasolio.bind(this)
        this.inputArea = this.inputArea.bind(this)
    }

    inputComune(evt){
        this.setState({comune: evt.target.value})
    }

    inputGasolio(evt){
        this.setState({carburante: evt.target.value})
    }

    inputArea(evt){
        this.setState({area: evt.target.value})
    }


    render(){
        console.log('Main properties ', this.state)
        return(
            <React.Fragment>
                    <Row>
                        <Col xs='11' sm='5' md='5' >
                            <DetailForm 
                            carburante = {this.state.carburante}
                            area = {this.state.area}
                            inputComune={this.inputComune}
                            inputGasolio = {this.inputGasolio}
                            inputArea = {this.inputArea} />
                        </Col>
                    </Row>
            </React.Fragment>
        );
    }
}

export default MainBody;