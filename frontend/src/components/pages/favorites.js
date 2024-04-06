import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from "react-bootstrap/Modal"

function Favorites() {
  const [favs, setFav] = useState([]);
  const {username} = useParams();
  const [favorite, setFavorite] = useState('')
  const [show, setShow] = useState(false);
  const [modalFavName, setMFav] = useState('')
  const [modalDirection, setMDir] = useState('')
  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        `http://localhost:8081/favorites/${username}`,
      );
      setFav(result.data);
    }

    fetchData();
}, [username]);

const handleClose = () => setShow(false);
// set modal names and values
const handleShow = (name, direction) => {
  setMFav(name)
  setMDir(direction)
  setShow(true)
  
};
function deleteButtonClick(username, favoriteName){
  
  async function deleteData() {
    const result = await axios.delete(
      `http://localhost:8081/favorites/deleteFavorite`, {data: {username: username, favoriteName: favoriteName}}
    );
    // update favorites
    setFav(result.data);
    setFavorite('')
    
  
  }
  deleteData()

}
function searchHandler(e){
  e.preventDefault()
  // preventDefault stops page from reloading so we must reset success variable manually
  
  
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
function editHandler(e){
  e.preventDefault()
  // TODO make post request to backend to edit
  handleClose()
  let formData = new FormData(e.target)
  let formDataObj = Object.fromEntries(formData.entries())
  console.log(formDataObj)
  console.log(typeof username)
  async function editFavorite(){
    
    try{
      const result = await axios.patch(`http://localhost:8081/favorites/editFavorite`,
    {username: username, favoriteName: formDataObj.favorite, 
      direction: formDataObj.direction})
      setFav(result.data)
    }catch(error){
      console.log(error)
    }
      
  }
  editFavorite()

}
return (
  <div>
    <Card
    body
    className='mx-1 my-2'
    style={{width:'30rem', maxHeight:'8rem',}}>
    <Card.Body>
      <Card.Text>
        <Form style={{display:'flex'}} onSubmit={searchHandler}>
          <Form.Group >
            <Form.Control type='search' placeholder='favorite' value={favorite} 
          onChange={(e)=> setFavorite(e.target.value)}></Form.Control>
          </Form.Group>
          <Button type='submit'>Submit</Button>
        </Form>
      </Card.Text>
    </Card.Body>
    </Card>
    {favs.map(fav => (
      <Card
      body
      color="success"
      className="mx-1 my-2"
      style={{ width: "30rem" }}
    >
      <Card.Body>
      <Card.Title>Favorite</Card.Title>
      <Card.Text>
      {fav.favoriteName} <br/>
      {fav.direction} <br/>
      
      <Button className='editButton' onClick={() => handleShow(fav.favoriteName, fav.direction)} style={{color:'white', backgroundColor: 'SlateGray', minWidth: '70px'}}>Edit</Button> <br/>
      <Button className='deleteButton' onClick={() => deleteButtonClick(fav.username, fav.favoriteName)} style={{color:'white', backgroundColor: 'Crimson', minWidth: '70px'}}>Delete</Button>
      </Card.Text>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Favorite</Modal.Title>
          </Modal.Header>
          <Modal.Footer
          style={{justifyContent: 'center', display:'block'}}>
            <Form onSubmit={editHandler}>
              <Form.Label>favorite name</Form.Label>
              <Form.Control type='text' name='favorite' value={modalFavName} readOnly placeholder={modalFavName}></Form.Control>
              <Form.Label>Direction</Form.Label>
              <Form.Control type='text' name='direction' placeholder={modalDirection}></Form.Control>
              <Button type='submit'>Submit</Button>
            </Form>
          </Modal.Footer>
        
      </Modal>
      </Card.Body>
    </Card>
    ))}
  </div>
    );
}


export default Favorites;