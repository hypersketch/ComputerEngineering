import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';


function Route() {
  const [route, setroute] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://api-v3.mbta.com/routes',
      );
      setroute(result.data.data);
    }

    fetchData();
}, []);

return (
  <div>
    {route.map(route => (
      <Card
      body
      outline
      color="success"
      bg='dark'
      border='success'
      className="mx-1 my-2"
      style={{ width: "30rem", 
               color: "white"}}
      
    >
      <Card.Body>
      <Card.Title>Route:</Card.Title>
      <Card.Text>{route.attributes.long_name}<br/>
      {route.attributes.direction_destinations[0]} - {route.attributes.direction_destinations[1]}
      
      
      </Card.Text>
      </Card.Body>
    </Card>
    ))}


      <h1>Routes</h1>
    {route.map(line => (
      <div key={route.id}>
        
      </div>
    ))}
  </div>
    );
}


export default Route;