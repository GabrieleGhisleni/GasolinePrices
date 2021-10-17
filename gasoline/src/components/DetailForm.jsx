import React, { Component } from "react";
import {Row, Col, FormGroup, Form, Label, Input, Button} from 'reactstrap';

class DetailForm extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div onSubmit={this.props.onSubmit}>
                <h5>Find the cheapest gasoline stations</h5>
                <p>
                    Inserisci il tuo comune, seleziona il tipo di carburante desiderato.
                    potri inoltre specificare il raggio entro il quale cercare i distributori.
                </p>
                <Form>
                    <FormGroup>
                        <Label htmlFor="comune">Comune </Label>
                        <Input type="text" name="comune" id="comune" placeholder="Seleziona il tuo comune"
                        value={this.props.comune} onChange={this.props.inputForm} />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="carburante">Seleziona Carburante</Label>
                        <Input type="select" name="carburante" id="carburante" 
                        value={this.props.carburante} onChange={this.props.inputForm}>
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
                            <Label check><Input type="radio" 
                            name='area' value={'3'}
                            checked={this.props.area === "3"}
                            onChange={this.props.inputForm}/> 3 km </Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Label check>
                            <Input type="radio" 
                            name='area' value={'5'}
                            onChange={this.props.inputForm}
                            checked={this.props.area === "5"}/> 5 km</Label>
                    </FormGroup>
                    </div>
                    </FormGroup>
                    <div style={{textAlign: 'right'}}>
                        <Button type='submit' color="primary" style={{marginBottom: '20px'}}>
                            Cerca Benzinai
                        </Button>
                    </div>
                </Form>
            </div>
    )};
}


export default DetailForm;