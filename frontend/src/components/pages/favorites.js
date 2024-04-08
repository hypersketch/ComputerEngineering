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
  const [favorite, setSearchFavorite] = useState('')
  const [show, setShow] = useState(false);
  const [modalFavorite, setModalFav] = useState('')
  const [modalFavDir, setModalFavDir] = useState([])

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
// set modal information
const handleShow = (fav) => {
  
  setModalFav(fav)
  
  async function getDirections(){
    let exists = true

    try{
      const result = await axios.get(`https://api-v3.mbta.com/routes/${fav.favoriteName}`,)
      const route = result.data.data
      console.log(result.data)
      setModalFavDir(route.attributes.direction_names)
    }
    catch(error){
      exists = false
      console.log(error)
    }
    // if route exists then show modal
    if (exists){
      setShow(true)
    }
  }
    getDirections()
    
};
function deleteButtonClick(fav){
  
  async function deleteData() {
    try{
      
    const result = await axios.delete(
      `http://localhost:8081/favorites/deleteFavorite`, {data: {username: fav.username, favoriteName: fav.favoriteName}}
    );
    // update favorites
    setFav(result.data);
    setSearchFavorite('')
    }
    catch(error){
      console.log(error)
    }
    

  }
  deleteData()

}
function searchHandler(e){
  e.preventDefault()
  // preventDefault stops page from reloading so we must reset success variable manually
  
  
  async function specificFavorite() {
    try{
    const result = await axios.get(
      `http://localhost:8081/favorites/${username}/${favorite}`,
    );
    // update favorites
    setFav(result.data);
    }
    catch (error){
      console.log(error)
    }
    
  }
  specificFavorite()
}
function enableModalButton(e){
  document.getElementById('submitButton').disabled = false

}
function modalSubmit(e){
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
          onChange={(e)=> setSearchFavorite(e.target.value)}></Form.Control>
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
      
      <Button className='editButton' onClick={() => handleShow(fav)} style={{color:'white', backgroundColor: 'SlateGray', minWidth: '70px'}}>Edit</Button> <br/>
      <Button className='deleteButton' onClick={() => deleteButtonClick(fav)} style={{color:'white', backgroundColor: 'Crimson', minWidth: '70px'}}>Delete</Button>
      </Card.Text>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Favorite</Modal.Title>
          </Modal.Header>
          <Modal.Footer
          style={{justifyContent: 'center', display:'block'}}>
            <Form onSubmit={modalSubmit}>
              <Form.Label>Favorite Name</Form.Label>
              <Form.Control type='text' name='favorite' value={modalFavorite.favoriteName} readOnly placeholder={modalFavorite.favoriteName}></Form.Control>
              <Form.Label>Direction</Form.Label>
              <Form.Select onChange={enableModalButton} defaultValue={'default'} name='direction'>
                
              <option value='default' disabled se>Direction</option>
                {modalFavDir.map(direction =>(
                  <option value={direction}>{direction}</option>
                ))}
    
              </Form.Select>
              <Button type='submit' id='submitButton' disabled>Submit</Button>
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