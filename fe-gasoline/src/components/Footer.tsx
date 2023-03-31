import {Col, Row} from 'reactstrap'
import {List, ListInlineItem} from 'reactstrap';
import React from "react";

export const Footer: React.FC = () => {
    return (
        <Row className='align-items-center footer text-center'>
            <Col>
                <span style={{fontSize: '1.2rem', fontStyle: 'italic'}}> @Gabriele Ghisleni     </span>
                <List type="inline">
                    <ListInlineItem>
                        <a href='https://github.com/GabrieleGhisleni'><i className="fa fa-github fa-lg"></i></a>
                    </ListInlineItem>
                    <ListInlineItem>
                        <a href='https://www.linkedin.com/in/gabriele-ghisleni-bb553a199/'><i
                            className="fa fa-linkedin fa-lg"></i></a>
                    </ListInlineItem>
                    <ListInlineItem>
                        <a href='https://www.facebook.com/gabriele.ghisleni.125'><i
                            className="fa fa-facebook fa-lg"></i></a>
                    </ListInlineItem>
                    <ListInlineItem>
                        <a href='https://www.instagram.com/g_gabry_/'><i className="fa fa-instagram fa-lg"></i></a>
                    </ListInlineItem>
                    <ListInlineItem>
                        <a href='/'><i className="fa fa-info fa-lg"></i></a>
                    </ListInlineItem>
                </List>
            </Col>
        </Row>
    );
}

export default Footer;
