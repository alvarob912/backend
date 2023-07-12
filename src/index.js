const express = require('express')
const apiRouter = require('./routes/app.routers.js')
const path = require('path')
const handlebars = require('express-handlebars')
const helpers = require('handlebars-helpers')
const viewsRoutes = require('./routes/views/views.router.js')
const mockRoutes = require('./routes/mock/mock.routes')
const loggerTestRoutes = require('./routes/loggerTest/loggerTest.routes.js')
const { Server } = require('socket.io')
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const { logGreen, logCyan, logRed } = require('./utils/console.utils')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
//const { PORT } = require('./config/enviroment.config')
const addLogger = require('./middlewares/logger.middleware.js')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')


const app = express()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use('/statics', express.static(path.resolve(__dirname, '../public')))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
app.use(flash())
app.use(addLogger)

//Router
app.use('/api', apiRouter)
app.use('/', viewsRoutes)
app.use('/mockingproducts', mockRoutes)
app.use('/loggerTest', loggerTestRoutes)

//Templates
const math = helpers.math();
app.engine('handlebars', handlebars.engine({
    helpers: {
        math
    }
}))
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'handlebars');

//Server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => logGreen('Server up and running on port ', PORT))


// Server error
server.on("error", (error) => {
    logRed("There was an error starting the server");
    logRed(error);
  });


// Swagger documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'E-commerce Documentation',
            description: "Coderhouse's Backend course"
        }
    },
    apis: [`${__dirname}/docs/*/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))










