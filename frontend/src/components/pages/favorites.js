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
function deleteButtonClick(username, favoriteName){
  
  async function deleteData() {
    const result = await axios.delete(
      `http://localhost:8081/favorites/deleteFavorite`, {data: {username: username, favoriteName: favoriteName}}
    );
    // update favorites
    setFav(result.data);
  }
  deleteData()

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
      <button className='deleteButton' onClick={() => deleteButtonClick(fav.username, fav.favoriteName)} style={{color:'white', backgroundColor: 'Crimson'}}>Delete</button></Card.Text>
      
      </Card.Body>
    </Card>
    ))}
  </div>
    );
}


export default Favorites;