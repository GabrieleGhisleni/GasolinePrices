import React, { Component } from "react";
import {Row, Col, FormGroup, Form, Label, Input, Button} from 'reactstrap';
import { Hint } from 'react-autocomplete-hint';
import NAMES from './../shared/names.json'


class DetailForm extends Component{

    scrollBottom(){
        if (window.innerWidth < 900){
            window.scroll({
                top: document.body.offsetHeight,
                left: 0, 
                behavior: 'smooth',
            })}
        else {return null}
    }

    render(){
        return(
            <div onSubmit={this.props.onSubmit}>
                <h4 className='myText' style={{marginBottom :'10px'}}>Trova i Benzinai più economici!</h4>
                <p className='text-justify myText'>
                    Inserisci il tuo comune e seleziona il tipo di carburante desiderato e verranno
                    mostrati tutti i distributori attivi nella tua zona, ti sarà chiaro e veloce
                    scegliere quello più economico!

                    <div style={{marginTop:'10px'}}>
                    <ol>
                        <li>Inserisci il comune</li>
                        <li>Seleziona il tipo di carburante</li>
                        <li>Premi il pulsante <span style={{fontStyle:'italic'}}>'Cerca Benzinai' </span></li>
                        <li>Opzionale: Specifica il raggio di ricerca</li>
                        <li>Opzionale: Specifica il numero di risultati mostrati</li>
                    </ol>
                    </div>
                    Cliccando sulle icone nella mappa verrano mostrati i dettagli della stazione, inclusa la data di rilevazione del prezzo.
                     Ti sarà possibile modificare i parametri opzionali molto velocemente senza ricaricare ricliccare il 
                    bottone e senza ricaricare nuovamente la pagina!
                </p>
                <Form>
                    <Row>
                    <Col xs={12} className='text-left'>
                    <FormGroup>
                        <Label htmlFor="comune">Comune </Label>
                        <Hint options={NAMES.name} allowTabFill>
                            <input type="text" name="comune" className="form-control" placeholder="Comune"
                            value={this.props.comune} onChange={this.props.inputForm}
                            id = 'input' required/>
                        </Hint>
                    </FormGroup>
                    </Col>
                    <Col xs={12} className='text-left'>
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
                    </Col>
                    </Row>
                    <Row>
                    <Col xs={5}>
                        <FormGroup >
                            <Label forHtml='carburanti'>Raggio di ricerca:</Label>
                        <div className='ml-auto'>
                        <FormGroup check inline>
                                <Label check><Input type="radio" 
                                name='area' value={'1'}
                                checked={this.props.area === "1"}
                                onChange={this.props.inputForm}/> 1 km </Label>
                        </FormGroup>
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
                            </FormGroup>                    </div>
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
                    <Row>
                        <Col xs={12} className='text-center'>
                            <div className='buttonSubmit'>
                                <a href='' onClick={this.scrollBottom}>
                                    <Button type='submit' color="primary">
                                        Cerca Benzinai
                                    </Button>
                                </a>
                            </div>
                        </Col>
                    </Row>
                
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