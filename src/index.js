const express = require("express")
const apiRoutes = require("./routes/app.routers")
const handlebars = require("express-handlebars")
const path = require('path')
const viewsRoutes = require('./routes/views/views.router')
const {Server} = require("socket.io")
require('./config/dbConfig')
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require('connect-flash')
const { logGreen, logCyan, logRed } = require('./utils/console.utils')
const passport = require("passport")
const cookieParser = require('cookie-parser')
const initializePassport = require('./middlewares/passport.middleware')

const PORT = process.env.PORT || 8080; 
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded( {extended: true}))
app.use('/statics', express.static(path.resolve(__dirname, './public')))
app.use(cookieParser())
initializePassport();
app.use(passport.initialize());
app.use(flash());


//Routes
app.use("/api", apiRoutes)
app.use('/', viewsRoutes)

//Templates
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Server
const server = app.listen(PORT, "127.0.0.1", () => {
    const host = server.address().address;
    const port = server.address().port;
    logGreen(`Server is up and running on http://${host}:${port}`);
});

// Server error
server.on("error", (error) => {
    logRed("There was an error starting the server");
    logRed(error);
    });

//Sockets
const io = new Server(server)

io.on('connection', (socket)=>{
    logCyan("new client connected");
    app.set('socket', socket)
    app.set('io', io)
    socket.on('login', user =>{
        socket.emit('welcome', user)
        socket.broadcast.emit('new-user', user)
    })
})











