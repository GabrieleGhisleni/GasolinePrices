import React, { Component } from "react";
import DetailForm from "./DetailForm";
import { FunctionalMap } from "./Map";
import {Row, Col} from 'reactstrap';

class MainBody extends Component{
    constructor(props){
        super(props)
        this.state = {
            coordinates : [41.8933203,12.4829321],
            nstations : '10',
            comune: null,
            carburante: 'Benzina',
            area: '3',
            action:null,
        }
        
        this.onSubmit = this.onSubmit.bind(this)
        this.inputForm = this.inputForm.bind(this)
        this.baseUrl = "https://raw.githubusercontent.com/GabrieleGhisleni/GasolinePrices/master/data/prices_for_municipality/"
    }


    onSubmit(evt){
        let comune = evt.target.comune.value
        comune = comune.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
        comune = comune.replace("'",'')
        comune = comune.replace(" ",'-')
        comune = comune.toLowerCase()
        comune += '.json'
        fetch(this.baseUrl + comune)
            .then(response => {
                if (!response.ok) {
                    alert(`Comune non trovato: ${evt.target.comune.value}, status: ${response.status}`)
                    throw new Error('404 File not found')
                }else{return response}})
            .then(response => response.json())
            .then(data => {
                console.log('Data FROM API' ,data)
                let carburante = this.state.carburante;
                let area = this.state.area;
                this.setState({buffer_3: data.buffer_3})
                this.setState({buffer_5: data['buffer_5']})
                this.setState({zoom: 3})
                this.setState({centroid: data['centroid']})
                this.setState({stations_3: data[carburante]['3']})
                this.setState({stations_5: data[carburante]['5']})
                this.setState({area_comune: data['area_comune']})
                console.log('main', data[carburante]['3'])
    
                this.setState({action: true})

            })
            .catch(err => {
                console.log('Error Message While fetching: ', err.message)
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
                        <Col xs='11' sm='5' md='5' className='align-items-center'>
                            <DetailForm 
                            nstations = {this.state.nstations}
                            carburante = {this.state.carburante}
                            area = {this.state.area}
                            inputForm = {this.inputForm}
                            onSubmit = {this.onSubmit} />
                        </Col>
                        <Col xs='12' sm='7' className='text-center'>
                            <FunctionalMap 
                            props = {this.state}
                            finished = {this.finishedAction}/>
                        </Col>
                    </Row>
            </React.Fragment>
        );
    }
}

export default MainBody;