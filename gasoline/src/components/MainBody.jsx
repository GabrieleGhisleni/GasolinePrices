import React, { Component } from "react";
import DetailForm from "./DetailForm";
import { FunctionalMap } from "./Map";
import {Row, Col} from 'reactstrap';

class MainBody extends Component{
    constructor(props){
        super(props)
        this.state = {
            coordinates : [41.8933203,12.4829321],
            comune: null,
            carburante: 'Benzina',
            area: '3',
            action:null,
            stations:[
                {"id": 25733, "Gestore": "LIGURIA GAS S.R.L.", "Bandiera": "Pompe Bianche", "Nome Impianto": "LIGURIA GAS", "Indirizzo": "VIA GUGLIELMO MARCONI SN 24040", "Comune": "suisio", "geometry": {"type": "Point", "coordinates": [9.51567828655243, 45.658138658636645]}, "price": 1.678, "date": "11/10/2021 11:53:41"}
            ]
        }
        
        this.onSubmit = this.onSubmit.bind(this)
        this.inputForm = this.inputForm.bind(this)
        this.baseUrl = "https://raw.githubusercontent.com/GabrieleGhisleni/GasolinePrices/master/data/prices_for_municipality/"
    }


    onSubmit(evt){
        fetch(this.baseUrl + 'medolago.json')
            .then(response => response.json())
            .then(data => {
                let carburante = this.state.carburante;
                let area = this.state.area;

                this.setState({buffer: data[`buffer_${area}`]})
                this.setState({zoom: 3})
                this.setState({centroid: data['centroid']})
                this.setState({stations: data[carburante][area]})

                this.setState({action: true})
                

            })
            .catch(err => {
                console.log(err.message)
            })
        
        evt.preventDefault()

    }

    inputForm(evt){
        this.setState({[evt.target.name] : evt.target.value})
    }

    render(){
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
                        <Col xs='12' sm='7' className='text-center'>
                            < FunctionalMap props={this.state} />
                        </Col>
                    </Row>
            </React.Fragment>
        );
    }
}

export default MainBody;