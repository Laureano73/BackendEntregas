import express from "express";
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from "express-session";
import MongoStore from "connect-mongo";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import messagesRouter from "./routes/messagesRoutes.js";
import sessionRoutes from "./routes/session.routes.js";
import { ProductMongoManager } from "./dao/managerDB/ProductMongoManager.js";
import { MessageMongoManager } from "./dao/managerDB/MessageMongoManager.js";
import viewRoutes from './routes/views.routes.js';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

const PORT = 8080;
const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer);

let productManager; // Declaración fuera del bloque try-catch
let messageManager = new MessageMongoManager(); // Inicialización de messageManager

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

try {
  // MongoDB Connection
  mongoose.connect("mongodb+srv://sergiocupe:Coder2024@coder.0nonzsv.mongodb.net/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

  console.log('Connected to MongoDB');
  // Session Middleware
  app.use(session({
    secret: "C0d3rh0us3",
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://sergiocupe:Coder2024@coder.0nonzsv.mongodb.net/ecommerce",
    }),
    resave: true,
    saveUninitialized: true
  }));

  productManager = new ProductMongoManager(); // Crear instancia de productManager aquí

  // Handlebars Configuration
  const hbs = handlebars.create({
    extname: '.handlebars',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  });

  app.engine('handlebars', hbs.engine);
  app.set('views', 'src/views');
  app.set('view engine', 'handlebars');
  app.use('/', viewRoutes);

  // Routes API
  app.use('/api/products', productRouter);
  app.use('/api/carts', cartRouter);
  app.use('/api/messages', messagesRouter);

  // Session Routes
  app.use('/api/session', sessionRoutes);

  // Server
  httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  // Sockets
  const socketServer = new Server(httpServer);
  const messages = [];

  socketServer.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('addProd', async prod => {
      // Existing socket code for adding products
    });

    socket.on('delProd', async id => {
      // Existing socket code for deleting products
    });

    socket.on('message', data => {
      messages.push(data);
      messageManager.addMessage(data);
      socketServer.emit('messageLogs', messages);
    });

    socket.on('newUser', data => {
      socket.emit('newConnection', 'Un nuevo usuario se conectó - ' + data);
      socket.broadcast.emit('notification', data);
    });
  });
} catch (error) {
  console.error('Error connecting to MongoDB:', error.message);
}

export { productManager, messageManager };
