import React, { Component } from "react";
import DetailForm from "./DetailForm";
import { FunctionalMap } from "./Map";
import {Row, Col} from 'reactstrap';

class MainBody extends Component{
    constructor(props){
        super(props)
        this.state = {
            first : true,
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
        comune = comune.replaceAll("'",'')
        comune = comune.replaceAll(" ",'-')
        comune = comune.toLowerCase()
        comune += '.json'
        console.log(comune)
        fetch(this.baseUrl + comune)
            .then(response => {
                if (!response.ok) {
                    alert(`Comune non trovato: ${evt.target.comune.value}`)
                    throw new Error('404 File not found')
                }else{return response}})
            .then(response => response.json())
            .then(data => {
                let carburante = this.state.carburante;
                let area = this.state.area;
                let stat_3 = data[carburante]['3'];
                let stat_5 =  data[carburante]['5'];
                let tmp = [...stat_3.price]
                stat_5.price = stat_5.price.concat(tmp)
                stat_5.price.sort((a,b) => {
                    return a.price > b.price
                })

                this.setState({buffer_3: data.buffer_3})
                this.setState({buffer_5: data['buffer_5']})
                this.setState({zoom: 3})
                this.setState({centroid: data['centroid']})
                this.setState({stations_3: stat_3})
                this.setState({stations_5: stat_5})
                this.setState({area_comune: data['area_comune']})
                this.setState({first: false})
                this.setState({action: true})

            })
            .catch(err => {
                console.log('Error Message While fetching: ', err.message)
            })  

        
        evt.preventDefault()
        setTimeout(this.setState({action:false}), 1000)
    }

    inputForm(evt){
        this.setState({[evt.target.name] : evt.target.value})
    }

    render(){
        return(
            <React.Fragment>
                    <Row className='primaryRow align-items-center'>
                        <Col xs='11' sm='5' md='5'>
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