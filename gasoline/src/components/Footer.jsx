import {Col, Row} from 'reactstrap'
import {List, ListInlineItem} from 'reactstrap';

export const Footer = () => {
    return(
        <Row className='align-items-center footer text-center'>
            <Col>
            <span style={{fontSize:'1.2rem', fontStyle:'italic'}}> @Gabriele Ghisleni     </span>               
            <List type="inline">
                        <ListInlineItem>
                            <a href='https://github.com/GabrieleGhisleni'><i class="fa fa-github fa-lg"></i></a>
                        </ListInlineItem>
                        <ListInlineItem>
                            <a href='https://www.linkedin.com/in/gabriele-ghisleni-bb553a199/'><i class="fa fa-linkedin fa-lg"></i></a>
                        </ListInlineItem>
                        <ListInlineItem>
                            <a href='https://www.facebook.com/gabriele.ghisleni.125'><i class="fa fa-facebook fa-lg"></i></a>
                        </ListInlineItem>
                        <ListInlineItem>
                            <a href='https://www.instagram.com/g_gabry_/'><i class="fa fa-instagram fa-lg"></i></a>
                        </ListInlineItem>
                        <ListInlineItem>
                        <a href='@'><i class="fa fa-info fa-lg"></i></a>
                        </ListInlineItem>
                    </List>
            </Col>
        </Row>
    );
}