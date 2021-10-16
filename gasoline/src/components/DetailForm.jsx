import React, { Component } from "react";
import {Row, Col, FormGroup, Form, Label, Input, Button} from 'reactstrap';

class DetailForm extends Component{
    constructor(props){
        super(props)
        this.submitForm = this.submitForm.bind(this)
    }

    submitForm(event){
        event.preventDefault()
    }

    render(){
        return(
            <div className='primaryForm' onSubmit={this.submitForm}>
                <h5>Find the cheapest gasoline stations</h5>
                <p>
                    Inserisci il tuo comune, seleziona il tipo di carburante desiderato.
                    potri inoltre specificare il raggio entro il quale cercare i distributori.
                </p>
                <Form>
                    <FormGroup>
                        <Label htmlFor="comune">Comune </Label>
                        <Input type="text" name="comune" id="comune" placeholder="Seleziona il tuo comune"
                        value={this.props.comune} onChange={this.props.inputComune} />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="carburante">Seleziona Carburante</Label>
                        <Input type="select" name="carburante" id="carburante" 
                        value={this.props.carburante} onChange={this.props.inputGasolio}>
                            <option value='Benzina'>Benzina</option>
                            <option value='Gasolio'>Gasolio</option>
                            <option value='GPL'>GPL</option>
                            <option value='Metano'>Metano</option>
                            <option>Gasolio High Quality</option>
                        </Input>
                    </FormGroup>
                    <FormGroup >
                        <Label forHtml='carburanti'>Raggio di ricerca:</Label>
                    <div className='ml-auto'>
                    <FormGroup check inline>
                            <Label check><Input type="radio" name='radio0' value={'3'}
                            checked={this.props.area === "3"}/> 3 km </Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Label check>
                            <Input type="radio" 
                            name='radio1' value={'5'}
                            onChange={this.props.inputArea}
                            checked={this.props.area === "5"}/> 5 km</Label>
                    </FormGroup>
                    </div>
                    </FormGroup>
                    <div style={{textAlign: 'right'}}>
                        <Button type='submit' color="primary">
                            Cerca Benzinai
                        </Button>
                    </div>
                    
                </Form>
            </div>
    )};
}


export default DetailForm;