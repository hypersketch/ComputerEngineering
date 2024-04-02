import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Favorites() {
  const [favs, setFav] = useState([]);
  const {username} = useParams();
  const [deleteSuccessMessage, setDeleteSuccess] = useState(false)
  const [favorite, setFavorite] = useState('')
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
    setFavorite('')
    setDeleteSuccess(true)
  
  }
  deleteData()

}
function submitHandler(e){
  e.preventDefault()
  // preventDefault stops page from reloading so we must reset success variable manually
  setDeleteSuccess(false)
  
  async function specificFavorite() {
    
    const result = await axios.get(
      `http://localhost:8081/favorites/${username}/${favorite}`,
    );
    // update favorites
    setFav(result.data);
    // reset favorite parameter variable we are using to search
  }
  specificFavorite()
}
return (
  <div>
    {deleteSuccessMessage && (
      <h1 style={{ color: "red" }}>Success in deleting!</h1>
    )}
    <form onSubmit={submitHandler}>
    <input id='search' type='text' placeholder='favorite' 
    value={favorite} 
    onChange={(e)=> setFavorite(e.target.value)}></input>
    <Button type='submit'>Submit</Button>
    </form>
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
      <Button className='editButton' onClick={editButtonClick} style={{color:'white', backgroundColor: 'SlateGray', minWidth: '70px'}}>Edit</Button> <br/>
      <Button className='deleteButton' onClick={() => deleteButtonClick(fav.username, fav.favoriteName)} style={{color:'white', backgroundColor: 'Crimson', minWidth: '70px'}}>Delete</Button></Card.Text>
      
      </Card.Body>
    </Card>
    ))}
  </div>
    );
}


export default Favorites;