import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from "react-bootstrap/Modal"
import {MapContainer, TileLayer, Polyline, Marker, Popup} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
function Favorites() {
  const [favs, setFav] = useState([]);
  const {username} = useParams();
  const [searchFavorite, setSearchFavorite] = useState('')
  const [show, setShow] = useState(false);
  const [selectedFavorite, setSelectedFav] = useState('')
  const [mapState, setMapState] = useState(null)
  // Marker State [start, end] - 0 and 1
  const [markerState, setMarkerState] = useState(null)
  // not a favorite but a list of directions in a route found using the favoriteName
  const [modalFavDir, setModalFavDir] = useState([])

  const [fInfo, fInfoSet] = useState({})
  const [modalSubmitDisabled, setModalSubmit] = useState(true)
  const [lineID, setLine] = useState({})
  const [markerInfo, setMarkerInfo] = useState(null)
  
  useEffect(() => {
    document.title = "Favorites Page"
    document.icon = "../../images/marker-icon.png"
    async function fetchData() {
      const result = await axios.get(
        `http://localhost:8081/favorites/${username}`,
      );
      setFav(result.data);
    }
    fetchData();
}, [username]);

useEffect(() => {
  async function mapFavs(){
    for (const fav of favs){
      const route = await getFavRouteInfo(fav)
      if (route !== null){
        console.log("route not null")
        fInfoSet(oldState => ({...oldState, [fav.favoriteName]: route}))
      }
    
    }
  }
  
  mapFavs()
  
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [favs])
useEffect(()=>{
  async function lines(){
    for (const fav of favs){
        const lineid = fInfo[fav.favoriteName]?.relationships?.line?.data?.id
        //const lineid = 'line-Red'
        const line = await getLineName(lineid)
        if (line !== null){
          setLine(oldState=>({...oldState, [fav.favoriteName]: line}))
        }
    }
  }
  
    lines()
  
}, [favs, fInfo])
async function getLineName(id){
  
    if (id!== undefined){
      try{
        const result = await axios.get(`https://api-v3.mbta.com/lines/${id}`)
        return (result.data.data.attributes.long_name)
      }catch(error){
        console.log(error)
        return (null)
      }
    }
  
}
async function getFavRouteInfo(fav) {
    
      try{
        const result = await axios.get(`https://api-v3.mbta.com/routes/${fav.favoriteName}`,)
        const routeInfo = result.data.data
        if(fInfo[fav.favoriteName] == null){
          return (routeInfo)}
        else {
          return null
        }
      }catch(error){
        return(error)
      }

    
   
    
}
const handleClose = () => setShow(false);
// set modal information
const handleShow = (fav) => {
  
  setSelectedFav(fav)
  
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
  setMapState(null)

}
async function specificFavorite() {
  // searchFavorite is '' - so if nothing is entered then route will simply return all favorites
  try{
  const result = await axios.get(
    `http://localhost:8081/favorites/${username}/${searchFavorite}`,
  );
  // update favorites
  setFav(result.data);
  }
  catch (error){
    console.log(error)
  }
  
}
function searchHandler(e){
  e.preventDefault()
  
  specificFavorite()
}

function modalSubmit(e){
  e.preventDefault()
  // TODO make post request to backend to edit
  handleClose()
  let formData = new FormData(e.target)
  let formDataObj = Object.fromEntries(formData.entries())
  async function editFavorite(){
    
    try{
      const result = await axios.patch(`http://localhost:8081/favorites/editFavorite`,
    {username: username, favoriteName: formDataObj.favorite, 
      direction: formDataObj.direction})
      // if a favorite is displayed after filter then continue to show that favorite
      if (searchFavorite.length > 0){
        specificFavorite()
      }
      else{
        setFav(result.data)
      }
    }catch(error){
      console.log(error)
    }
      
  }
  editFavorite()
  setMapState(null)
  setModalSubmit(true)

}
const modalSubmitChange = (e)=>{
  if (e.target.value !== 'default'){
    setModalSubmit(false)
  }else{
    setModalSubmit(true)
  }
}
function mapTest(fav){
  async function getStops(){
    let direction_id = (fav.direction === "Outbound" || fav.direction === "West" || fav.direction === "South") ? 0: 1
    const result = await axios.get(`https://api-v3.mbta.com/stops?filter[route]=${fav.favoriteName}&filter[direction_id]=${direction_id}`,)
    const newL = result.data.data.map(item => [item.attributes.latitude, item.attributes.longitude])
    const sc = newL[0]
    const ec = newL.at(-1)
    // const start = await axios.get(`https://api-v3.mbta.com/stops?filter[latitude]=${sc[0]}&filter[longitude]=${sc[1]}&filter[radius]=0.001&sort=distance&page[limit]=1`)
    // const end = await axios.get(`https://api-v3.mbta.com/stops?filter[latitude]=${ec[0]}&filter[longitude]=${ec[1]}&filter[radius]=0.001&sort=-distance&page[limit]=1`)
    const start = result.data.data[0]
    const end = result.data.data.at(-1)
    setMapState(newL)
    // setMarkerInfo([start.data.data[0], end.data.data[0]])
    setMarkerInfo([start, end])
    setMarkerState([sc, ec])

  }
  getStops()
}

return (
  
  <div style={{display: 'flex', justifyContent:'space-evenly', padding: '10px',}}>
    <div>
    <Card
    body
    className='mx-1 my-2'
    style={{width:'30rem', maxHeight:'8rem',}}>
    <Card.Body>
      <Card.Text>
        <Form style={{display:'flex'}} onSubmit={searchHandler}>
          <Form.Group >
            <Form.Control type='search' placeholder='favorite' value={searchFavorite} 
          onChange={(e)=> setSearchFavorite(e.target.value)}></Form.Control>
          </Form.Group>
          <Button type='submit'>Submit</Button>
        </Form>
      </Card.Text>
    </Card.Body>
    </Card> 

    {favs.map((fav) => (
        <Card
        body
        color="success"
        className="mx-1 my-2"
        style={{ width: "30rem" }}

      >
        <Card.Body>
        <Card.Title>
          Route - {fav.favoriteName}<br/>
          {/* {fInfo[fav.favoriteName]?.relationships?.line?.data?.id} */}
          Line - {lineID[fav.favoriteName]}
          {}
        </Card.Title>
        <Card.Text>
        
        {fInfo[fav.favoriteName]?.attributes?.long_name}<br/> 
                Direction - {fav.direction} <br/>
        
        <Button className='editButton' onClick={() => handleShow(fav)} style={{color:'white', backgroundColor: 'SlateGray', minWidth: '70px'}}>Edit</Button> <br/>
        <Button className='deleteButton' onClick={() => deleteButtonClick(fav)} style={{color:'white', backgroundColor: 'Crimson', minWidth: '70px'}}>Delete</Button><br/>
        <Button className='mapButton' onClick={() => mapTest(fav)} style={{color:'white', backgroundColor: 'green', minWidth: '70px'}}>Map</Button>
        </Card.Text>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Favorite</Modal.Title>
            </Modal.Header>
            <Modal.Footer
            style={{justifyContent: 'center', display:'block'}}>
              <Form onSubmit={modalSubmit}>
                <Form.Label>Route</Form.Label>
                <Form.Label></Form.Label>
                <Form.Control type='text' name='favorite' value={selectedFavorite.favoriteName} readOnly placeholder={searchFavorite.favoriteName}></Form.Control>
                <Form.Label>Direction</Form.Label>
                <Form.Select defaultValue={'default'} name='direction' onChange={modalSubmitChange}>
                  
                <option value='default' disabled selected>Direction</option>
                  {modalFavDir.map(direction =>(
                    <option value={direction}>{direction}</option>
                  ))}
      
                </Form.Select>
                <Button type='submit' id='submitButton' disabled={modalSubmitDisabled}>Submit</Button>
              </Form>
            </Modal.Footer>
          
        </Modal>
        </Card.Body>
      </Card>
      ))}
    
    
  </div>
  <div style={{"height": "900px", "width": "900px",marginTop: '8px'}}>
    <MapContainer style={{height: "inherit", width:"inherit"}} center={[42.5030595,-70.890669]} zoom={11}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'>
      
      </TileLayer>
      {mapState && markerState && markerInfo && ( 
        <>
          <Polyline color='black' weight={3} opacity={1} positions={mapState}></Polyline>

          <Marker position={markerState[0]} icon={L.icon({
            iconUrl: require("../../images/marker-icon.png"),
            iconSize: [20, 30]
          })}>
            <Popup>
             Start - { markerInfo[0].attributes.address || markerInfo[0].attributes.at_street}
            </Popup>
          </Marker>
          <Marker position={markerState[1]} icon={L.icon({
            iconUrl: require("../../images/end-marker.png"),
            iconSize: [30, 30]
          })}>
            <Popup>
              Dest. - { markerInfo[1].attributes.address || markerInfo[1].attributes.at_street}
            </Popup>
          </Marker>
          </>
        )}
       </MapContainer>
    </div>
  </div>
  
    );
}

export default Favorites;