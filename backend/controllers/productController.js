const {
    getProducts: getProductFromDB,
    getProductById: getProductByIdfromDB,
    createProduct: createProductInDB,
    updateProduct: updateProductInDB,
    deleteProduct: deleteProductFromDB
} = require("../models/productModel");

const getAllProducts = async (req, res) => {
    try {
        const products = await getProductFromDB();

        res.json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getProductByIdfromDB(id);

        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch product"
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {name, price, stock} = req.body;

        if(!name || price<=0 || stock<0) {
            return res.status(400).json({
                message: "Invalid product data"
            });
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            price,
            stock
        };

        const product = await createProductInDB(newProduct);

        res.status(201).json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create product"
        });
    }
};

const updateProduct = async (req, res) => {
    try{
        const id = req.params.id;

        const {name, price, stock} = req.body;

        if(!name || price<=0 || stock<0) {
            return res.status(400).json({
                message: "Invalid product data"
            });
        }

        const product = await getProductByIdfromDB(id);

        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const updatedProduct = await updateProductInDB(id, {
            name,
            price,
            stock
        });

        res.json(updatedProduct);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update product"
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await getProductByIdfromDB(id);

        if(!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await deleteProductFromDB(id);

        res.status(200).json({
            message: "Product deleted"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};