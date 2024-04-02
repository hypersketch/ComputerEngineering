import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Favorites() {
  const [favs, setFav] = useState([]);
  const {username} = useParams();
  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        `http://localhost:8081/favorites/${username}`,
      );
      setFav(result.data);
    }

    fetchData();
}, [username]);
function editButtonClick(e){
  e.preventDefault();
  // open boxes for user to edit information
  alert("Prompt Edit Boxes!")

}
function deleteButtonClick(e){
  e.preventDefault();
  alert("Prompt Deletion Text!")
}
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
      <Card.Title>Favorite</Card.Title>
      <Card.Text>
      {fav.username} <br/>
      {fav.favoriteName} <br/>
      {fav.direction} <br/>
      <button className='editButton' onClick={editButtonClick} style={{color:'white', backgroundColor: 'SlateGray'}}>Edit</button> <br/>
      <button className='deleteButton' onClick={deleteButtonClick} style={{color:'white', backgroundColor: 'Red'}}>Delete</button></Card.Text>
      
      </Card.Body>
    </Card>
    ))}
  </div>
    );
}


export default Favorites;