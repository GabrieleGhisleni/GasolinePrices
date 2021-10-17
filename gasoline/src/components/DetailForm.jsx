import React, { Component } from "react";
import {Row, Col, FormGroup, Form, Label, Input, Button} from 'reactstrap';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';


class DetailForm extends Component{
    state = {'val':''};

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