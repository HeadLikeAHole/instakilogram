import React from 'react';
import Card from 'react-bootstrap/Card';

import './page-not-found.css';


const PageNotFound = () => {
  return (
      <Card className="mx-auto mt-5 four-o-four my-container">
        <Card.Body>
          404 Страница не найдена
        </Card.Body>
      </Card>
  )
};


export default PageNotFound;
