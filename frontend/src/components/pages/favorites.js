import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';


function Favorites() {
  const [favs, setFav] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost:8081/favorites/josue1',
      );
      setFav(result.data);
    }

    fetchData();
}, []);

return (
  <div>
    {favs.map(fav => (
      <Card
      body
      outline
      color="success"
      className="mx-1 my-2"
      style={{ width: "30rem" }}
    >
      <Card.Body>
      <Card.Title>Favorites</Card.Title>
      <Card.Text>
      {fav.username} <br/>
      {fav.favoriteName} <br/>
      {fav.direction} <br/>
      <button>Edit Favorite</button></Card.Text>
      </Card.Body>
    </Card>
    ))}
  </div>
    );
}


export default Favorites;