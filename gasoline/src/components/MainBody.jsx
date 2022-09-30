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
        comune = comune.trim()
        comune = comune.replaceAll("'",'')
        comune = comune.replaceAll(" ",'-')
        comune = comune.toLowerCase()
        comune += '.json'
        fetch(this.baseUrl + comune)
            .then(response => {
                if (!response.ok) {
                    alert(`Comune non trovato: ${evt.target.comune.value}`)
                    throw new Error('404 File not found')
                }else{return response}})
            .then(response => response.json())
            .then(data => {
                // alert('SITO IN MANUTENZIONE, working again by 22/10/22')
                let stat_1 = data[this.state.carburante]["1"];
                let stat_3 = data[this.state.carburante]["3"];
                let stat_5 =  data[this.state.carburante]['5'];
                
                function priceSort( a, b ) {
                    if ( a.price < b.price ){return -1;}
                    if ( a.price > b.price ){return 1;}
                    return 0;}
                    
                stat_3 = stat_3.concat([...stat_1])
                stat_5 = stat_5.concat([...stat_3])
                stat_1.sort(priceSort)
                stat_3.sort(priceSort)
                stat_5.sort(priceSort)
                let prices = stat_5.map(p => {return p.price})
                if (prices.length == 0){alert('we have not found any stations around you municipality!')}
                    
                const math = require('mathjs')
                this.setState({standard_deviation: math.std(prices) })
                this.setState({mean: math.mean(prices) })
                this.setState({area_comune: JSON.parse(data.area_comune)})
                this.setState({buffer_1: JSON.parse(data.buffer_1)})
                this.setState({buffer_3: JSON.parse(data.buffer_3)})
                this.setState({buffer_5: JSON.parse(data.buffer_5)})
                this.setState({centroid: JSON.parse(data.centroid)})
                this.setState({stations_1: stat_1})
                this.setState({stations_3: stat_3})
                this.setState({stations_5: stat_5})
                this.setState({first: false})
                this.setState({action: true})

            })
            .catch(err => {
                console.log('Error Message While fetching: ', err)
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
                        <Col xs='12' sm='5' md='5' className='text-center'>
                            <DetailForm 
                                nstations = {this.state.nstations}
                                carburante = {this.state.carburante}
                                area = {this.state.area}
                                inputForm = {this.inputForm}
                                onSubmit = {this.onSubmit} 
                                focus = {this.handleOnClick}/>
                        </Col>
                        <Col xs='12' sm='7' className='text-center' id='map'>
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