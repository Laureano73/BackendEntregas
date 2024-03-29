import { Router } from "express";
import { productManager } from "../app.js";
import { checkAuth, checkExistingUser } from "../middlewares/auth.js";

const viewRoutes = Router();

viewRoutes.get('/', checkAuth, (req, res) => {
    const { user } = req.session;
    res.render('index', { first_name: user.first_name, last_name: user.last_name });
});

viewRoutes.get('/login', checkExistingUser, (req, res) => {
    res.render('login');
});

viewRoutes.get('/register', checkExistingUser, (req, res) => {
    res.render('register');
});

viewRoutes.get("/chat", (req, res) => {
    res.render("chat");
});

viewRoutes.get('/products', async (req, res) => {
    const { page } = req.query;
    const { user } = req.session;

    try {
        const productsResult = await productManager.loadProducts(10, page);
        const { message, rdo: products } = productsResult;

        if (message === "OK") {
            res.render('products', { products, user });
        } else {
            res.render('products', { products: [], user, errorMessage: "No se encontraron productos" });
        }
    } catch (error) {
        res.render('products', { products: [], user, errorMessage: "Error al cargar productos" });
    }
});


export default viewRoutes;
