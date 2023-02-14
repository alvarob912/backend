const express = require("express")
const apiRoutes = require("./routes/app.routers")
const handlebars = require("express-handlebars")
const path = require('path')
const viewsRoutes = require('./routes/views/views.router')
const {Server} = require("socket.io")
require('./config/dbConfig')
const session = require("express-session")
const MongoStore = require("connect-mongo")

const PORT = process.env.PORT || 8080; 
const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded( {extended: true}))
app.use('/statics', express.static(path.resolve(__dirname, './public')))
app.use(session({
    name: 'session',
    secret:'contraseña123' ,
    cookie: {
        maxAge: 60000 * 60,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://admin:12345@ecommerce.koayiwg.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 3600
    })
}))


//Routes
app.use("/api", apiRoutes)
app.use('/', viewsRoutes)

//Templates
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Server
const httpServer = app.listen(PORT, () => {
    console.log("Server up and running in port", PORT)
})

//Socket

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) =>{
    console.log("Nuevo cliente conectado")
    app.set('socket', socket)
    app.set('io', io)
    socket.on('login', user =>{
        socket.emit('welcome', user)
        socket.broadcast.emit('new-user', user)
    })
    })











