const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')
const getUserFavorites = require('./routes/favoritesGetAllUserFavorites')
const getSpecificFavorite = require('./routes/favoritesGetSpecificFavorites')
const createFavorite = require('./routes/favoritesCreate')
const editFavorite = require('./routes/favoritesEditFavorite')
const deleteFavorite = require('./routes/favoritesDeleteFavorite')
const createComments = require('./routes/commentsCreate')
const deleteComments = require('./routes/commentsDelete')
const getComments = require('./routes/commentsGet')
const editComments = require('./routes/commentsEdit')
require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)
app.use('/favorites', getUserFavorites)
app.use('/favorites', getSpecificFavorite)
app.use('/favorites', createFavorite)
app.use('/favorites', editFavorite)
app.use('/favorites', deleteFavorite)
app.use('/comments', getComments)
app.use('/comments', createComments)
app.use('/comments', deleteComments)
app.use('/comments', editComments)


app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
