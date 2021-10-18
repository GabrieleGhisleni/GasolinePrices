import React, { Component } from "react";
import {Row, Col, FormGroup, Form, Label, Input, Button} from 'reactstrap';
import { Hint } from 'react-autocomplete-hint';
import NAMES from './../shared/names.json'

class DetailForm extends Component{

    render(){
        return(
            <div onSubmit={this.props.onSubmit}>
                <h5>Trova i Benzinai più economici!</h5>
                <p className='text-justify'>
                    Inserisci il tuo comune e seleziona il tipo di carburante desiderato.
                    Potrai inoltre specificare il raggio entro il quale cercare i distributori,
                    clicca su 'Cerca Benzinai' e la mappa mostrerà i distributori più economici nella tua zona!
                </p>
                <Form>
                    <FormGroup>
                        <Label htmlFor="comune">Comune </Label>
                        <Hint options={NAMES.name} allowTabFill>
                            <input type="text" name="comune" className="form-control" placeholder="Comune"
                            value={this.props.comune} onChange={this.props.inputForm}
                            id = 'input' required/>
                        </Hint>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="carburante">Seleziona Carburante</Label>
                        <Input type="select" name="carburante" id="carburante" 
                        value={this.props.carburante} onChange={this.props.inputForm}>
                            <option value='Benzina'>Benzina</option>
                            <option value='Gasolio'>Gasolio</option>
                            <option value='Gasolio High Quality'>Gasolio High Quality</option>
                            <option value='GPL'>GPL</option>
                            <option value='Metano'>Metano</option>
                            <option value='Blue Diesel'>Blue Diesel</option>
                            <option value='Diesel High Quality'>Diesel High Quality</option>
                        </Input>
                    </FormGroup>
                    <Row>
                    <Col xs={5}>
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
                            <FormGroup check inline>
                            <Label check>
                                <Input type="radio" 
                                name='area' value={'5'}
                                onChange={this.props.inputForm}
                                checked={this.props.area === "5"}/> 5 km</Label>
                            </FormGroup>

                        </FormGroup>
                    </div>
                   
                    </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup >
                            <Label forHtml='risultati'>Numero di risultati:</Label>
                        <div className='ml-auto'>
                        <FormGroup check inline>
                                <Label check><Input type="radio" 
                                name='nstations' value={'5'}
                                checked={this.props.nstations === "5"}
                                onChange={this.props.inputForm}/> 5 </Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <FormGroup check inline>
                            <Label check>
                                <Input type="radio" 
                                name='nstations' value={'10'}
                                onChange={this.props.inputForm}
                                checked={this.props.nstations === "10"}/> 10 </Label>
                            </FormGroup>
                        </FormGroup>
                        <FormGroup check inline>
                            <FormGroup check inline>
                            <Label check>
                                <Input type="radio" 
                                name='nstations' value={'15'}
                                onChange={this.props.inputForm}
                                checked={this.props.nstations === "15"}/> 15 </Label>
                            </FormGroup>
                        </FormGroup>
                        <FormGroup check inline>
                            <FormGroup check inline>
                            <Label check>
                                <Input type="radio" 
                                name='nstations' value={'100'}
                                onChange={this.props.inputForm}
                                checked={this.props.nstations === "100"}/> Mostra tutti </Label>
                            </FormGroup>
                        </FormGroup>
                    </div>
                   
                    </FormGroup>
                    </Col>
                    </Row>
                    
                    <div style={{textAlign: 'right'}}>
                        <Button type='submit' 
                        color="primary" 
                        style={{marginBottom: '20px'}}>
                            Cerca Benzinai
                        </Button>
                    </div>
                
                </Form>
            </div>
    )};
}


export default DetailForm;

// <AutoComplete
//         getItemValue={(item) => item.name}
//         items={members.filter((member) => member.name.includes(name))}
//         renderItem={(item, isHighlighted) => (
//           <div
//             style={{
//               verticalAlign: "middle",
//               background: isHighlighted ? "lightgray" : "white"
//             }}
//           >
//             <a
//               target="_blank"
//               rel="noreferrer"
//               href={item.twitter}
//               style={{
//                 border: "none",
//                 backgroundColor: "none",
//                 padding: 0,
//                 dipslay: "inline-block"
//               }}
//             >
//               <img
//                 alt="icon"
//                 src={item.icon}
//                 style={{ width: 30, height: 30 }}
//               />
//             </a>
//             <div style={{ display: "inline-block", minWidth: 200 }}>
//               {item.name}
//             </div>
//           </div>
//         )}
//         wrapperStyle={{
//           position: "relative",
//           border: "solid 1px #800"
//         }}
//         menuStyle={{
//           border: "solid 2px #080",
//           backgroundColor: "#dfd",
//           zIndex: 2,
//           position: "absolute",
//           top: 30,
//           left: 0,
//           overflow: "auto",
//           maxHeight: 100
//         }}
//         value={name || ""}
//         inputProps={{
//           placeholder: "input name",
//           style: { fontSize: 14, width: "100%", padding: 3 }
//         }}
//         onChange={(e) => setName(e.target.value)}
//         onSelect={(name) => setName(name)}
//       />