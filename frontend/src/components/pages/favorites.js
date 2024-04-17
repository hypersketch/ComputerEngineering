import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from "react-bootstrap/Modal"
import {MapContainer, TileLayer, Polyline, Marker, Popup} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useMap } from 'react-leaflet';
import getUserInfo from '../../utilities/decodeJwt';
import "../styles/Favorites.css"

function Favorites() {
  const [favs, setFav] = useState([]);
  const {username} = useParams();
  const [searchFavorite, setSearchFavorite] = useState('')
  const [show, setShow] = useState(false);
  const [selectedFavorite, setSelectedFav] = useState('')
  const [mapState, setMapState] = useState(null)
  
  const loggedUser = getUserInfo()
  // Marker State [start, end] - 0 and 1
  const [markerState, setMarkerState] = useState([])

  // not a favorite but a list of directions in a route found using the favoriteName
  const [modalFavDir, setModalFavDir] = useState([])
  const [fInfo, fInfoSet] = useState(false)
  const [modalSubmitDisabled, setModalSubmit] = useState(true)
  const [lineID, setLine] = useState({})
  const [markerInfo, setMarkerInfo] = useState(null)
  const [reload, setReload] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [viewingSelf, setViewingSelf] = useState(false)
  const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}`
  useEffect(() => {
    document.title = "Favorites Page"
    document.icon = "../../images/marker-icon.png"
    async function fetchData() {
      const result = await axios.get(
        `${url}/favorites/${username}`,
      );
      setFav(result.data);
    }
    fetchData();
    if (loggedUser !== undefined){
      if (loggedUser.username === username)
      setViewingSelf(true)
    }
    
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [username, reload]);

useEffect(() => {
  
  async function mapFavs(){
    const favIds = favs.map(fav =>fav.favoriteName)
    const routes = await getFavRouteInfo(favIds.join(','))
    if (routes === null) return
    // order the routes to match order of favIds
    const orderedData = favIds.map(id => routes.find(route => parseInt(route.id) === id || route.id === id))
    const updatedState = {} 
    favIds.forEach((id, index) => updatedState[id] = orderedData[index])

    
    fInfoSet(updatedState)
  }
  
  if (favs.length > 0){
    mapFavs()
  }else {
    console.log("0")
  }
  setPageLoaded(true)

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
  
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [fInfo])
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
async function getFavRouteInfo(id) {
    
      try{
        const result = await axios.get(`https://api-v3.mbta.com/routes?filter[id]=${id}`,)
        const routeInfo = result.data.data
       
        return (routeInfo)}
      catch(error){
        console.log(error)
        return(null)
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
      `${url}/favorites/deleteFavorite`, {data: {username: fav.username, favoriteName: fav.favoriteName}}
    );
    // update favorites
    setSearchFavorite('')
    setFav(result.data);
    }
    catch(error){
      console.log(error)
    }

  }
  setMapState(null)
  deleteData()
  setReload(true)

}
async function specificFavorite() {
  // searchFavorite is '' - so if nothing is entered then route will simply return all favorites
  try{
  const result = await axios.get(
    `${url}/favorites/${username}/${searchFavorite}`,
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
      const result = await axios.patch(`${url}/favorites/editFavorite`,
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
    const start = result.data.data[0]
    const end = result.data.data.at(-1)
    setMapState(newL)
    setMarkerInfo([start, end])
    setMarkerState([sc, ec])

  }
  getStops()
}

return (
  <div className="main" style={{display:"flex", boxSizing:"content-box"}}>
  <div className ="cardColumn">
    {pageLoaded && (
      <>
    <Card
    body
    key={
      'searchBarCard'
    }
    >
  
    <Card.Body>
      <Card.Text>
        <Form className="searchBar" onSubmit={searchHandler}>
          <Form.Group >
            <Form.Control type='search' placeholder='favorite' value={searchFavorite} 
          onChange={(e)=> setSearchFavorite(e.target.value)}></Form.Control>
          </Form.Group>
          <Button type='submit'>Submit</Button>
        </Form>
      </Card.Text>
    </Card.Body>
    </Card> 
    <div className='fav'>
    {/*Load cards only once fInfo has loaded*/}
    
    {Object.keys(fInfo).length > 0 && (
      favs.map((fav) => (
        <Card
        body
        color="success"
        
        className='favCard'
        key={fav.favoriteName}
        
        
      >
        <Card.Body>
        <Card.Title>
          Route - {fav.favoriteName}<br/>
          Line - {lineID[fav.favoriteName]}
        </Card.Title>
        <Card.Text>
        
        {fInfo && (fInfo[fav.favoriteName]?.attributes.long_name)}<br/> 
      
            Direction - {fav.direction} <br/>
          <ButtonGroup >
          <Button onClick={() => mapTest(fav)}>map</Button>
          
          {viewingSelf && (
          <DropdownButton className="drop" as={ButtonGroup} title="manage" id="bg-nested-dropdown">
            <Dropdown.Item onClick={() => handleShow(fav)}>
            Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => deleteButtonClick(fav)}>
              Delete
            </Dropdown.Item>
        </DropdownButton>
        
        )}
        </ButtonGroup></Card.Text>
  
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
                <br/>
                <div className="d-grid gap-2">
                <Button size="lg" type='submit' id='submitButton' disabled={modalSubmitDisabled}>Submit</Button>
              </div>
              </Form>
            </Modal.Footer>
          
        </Modal>
        </Card.Body>
      </Card>
      )))
    }
    </div>
    
    
  
  </>
    )}
  </div>


  
  <div className="mapDiv"  >
  <MapContainer style={{height: "inherit", width:"inherit"}} center={[42.5030595,-70.890669]} zoom={11}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'>
      
      </TileLayer>
      {mapState && markerState.length > 0 && markerInfo && ( 
        <>
          <Polyline color='black' weight={3} opacity={1} positions={mapState}></Polyline>

          <Marker position={markerState[0]} icon={L.icon({
            iconUrl: require("../../images/marker-icon.png"),
            iconSize: [20, 30]
          })}>
            <Popup>
             Start - {markerInfo[0].attributes.address || markerInfo[0].attributes.at_street || markerInfo[0].attributes.on_street}
            </Popup>
          </Marker>
          <Marker position={markerState[1]} icon={L.icon({
            iconUrl: require("../../images/end-marker.png"),
            iconSize: [30, 30]
          })}>
            <Popup>
              Dest. - {markerInfo[1].attributes.address || markerInfo[1].attributes.at_street || markerInfo[1].attributes.on_street}
            </Popup>
          </Marker>
          </>
        )}\
        {/* Pass in start coordinates*/}
        {markerState.length >0 && (<RecenterMap markerState={markerState[0]}/>)}
       </MapContainer>
    </div>
    </div>
    );
}
function RecenterMap({markerState}){
  const map = useMap()
  useEffect(()=>{
    console.log(markerState)
    try{
      map.flyTo([markerState[0], markerState[1]], 12, {
        duration: 1.0,
        animate:true
      })
    }catch(error){
      console.log(error)
    }
  }, [markerState, map])
}
export default Favorites;