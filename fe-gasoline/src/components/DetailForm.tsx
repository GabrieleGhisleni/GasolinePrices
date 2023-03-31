import React, {useState} from "react";
import {Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {Hint} from "react-autocomplete-hint";


export interface FormState {
    comune: string;
    carburante: string;
    area_coverage: "1" | "3" | "5"
    number_stations: "5" | "10" | "15"
}

interface DetailFormProps {
    onSubmit: (event: FormState) => void,
    smartRefresh: (event: React.ChangeEvent<HTMLInputElement>) => void
    nameHints: string[]
}

const DetailForms: React.FC<DetailFormProps> = ({onSubmit, nameHints, smartRefresh}) => {
    const [form, setForm] = useState<FormState>({
        comune: '',
        carburante: 'Benzina',
        area_coverage: "1",
        number_stations: "5",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    return (
        <>
            <div>

                <h4 className='myText mb-5'>Trova i Benzinai più economici!</h4>
                <p className='text-justify myText'>
                    Inserisci il tuo comune e seleziona il tipo di carburante desiderato e verranno
                    mostrati tutti i distributori attivi nella tua zona, ti sarà chiaro e veloce
                    scegliere quello più economico!

                </p>
                <div className="mt-5">
                    <ol>
                        <li>Inserisci il comune</li>
                        <li>Seleziona il tipo di carburante</li>
                        <li>Premi il pulsante <span style={{fontStyle: 'italic'}}>'Cerca Benzinai' </span></li>
                        <li>Opzionale: Specifica il raggio di ricerca</li>
                        <li>Opzionale: Specifica il numero di risultati mostrati</li>
                    </ol>
                </div>
                Cliccando sulle icone nella mappa verrano mostrati i dettagli della stazione, inclusa la data di
                rilevazione del prezzo.
                Ti sarà possibile modificare i parametri opzionali molto velocemente senza ricaricare ricliccare il
                bottone e senza ricaricare nuovamente la pagina!
            </div>

            <Form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form)
            }}>
                <Row>
                    <Col xs={12} className='text-left'>
                        <FormGroup>
                            <Label htmlFor="comune">Comune </Label>
                            <div>

                                <Hint options={nameHints} allowTabFill>
                                <input
                                    type="text" name="comune" className="form-control" placeholder="Comune"
                                    value={form.comune} onChange={handleChange}
                                    id='input' required
                                />
                                </Hint>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col xs={12} className='text-left'>
                        <FormGroup>
                            <Label htmlFor="carburante">Seleziona Carburante</Label>
                            <div>

                                <Input type="select" name="carburante" id="carburante"
                                       value={form.carburante} onChange={handleChange}>
                                    <option value='Benzina'> Benzina </option>
                                    {[
                                        'Gasolio',
                                        'Gasolio High Quality', 'GPL', 'Metano',
                                        'Blue Diesel', 'Diesel High Quality'].map((value, index) => {
                                        return (
                                            <option value={value} key={index}>{value}</option>
                                        )
                                    })}
                                </Input>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={5}>
                        <FormGroup>
                            <Label htmlFor='carburanti'>Raggio di ricerca:</Label>
                            <div>
                                {
                                    ["1", "3", "5"].map((value, index) => {
                                        return (
                                            <div className="ml-auto" key={"carbs" + index}>
                                                <FormGroup check inline key={index}>
                                                    <Label check>
                                                        <Input type="radio"
                                                               name='area_coverage' value={value}
                                                               checked={form.area_coverage === value}
                                                               onChange={(e) => {
                                                                   smartRefresh(e);
                                                                   handleChange(e);
                                                               }}/>
                                                        {value} km
                                                    </Label>
                                                </FormGroup>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor='risultati'>Numero di risultati:</Label>
                            <div>

                                {
                                    ["5", "10", "15"].map((value, index) => {
                                        return (
                                            <div className="ml-auto" key={"number_stations" + index}>
                                                <FormGroup check inline>
                                                    <Label check>
                                                        <Input type="radio"
                                                               name='number_stations' value={value}
                                                               checked={form.number_stations === value}
                                                               onChange={(e) => {
                                                                   smartRefresh(e);
                                                                   handleChange(e);
                                                               }}/>
                                                        {value}
                                                    </Label>
                                                </FormGroup>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className='text-center'>
                        <div className='buttonSubmit'>
                            <a href='/' onClick={() => {
                                if (window.innerWidth < 900) {
                                    window.scroll({
                                        top: document.body.offsetHeight,
                                        left: 0,
                                        behavior: 'smooth',
                                    })
                                }
                            }
                            }>
                                <Button type='submit' color="primary">
                                    Cerca Benzinai
                                </Button>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
    )
        ;
};

export default DetailForms;
