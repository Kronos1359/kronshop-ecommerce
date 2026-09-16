const express = require("express");
const cors = require("cors");

const app = express();
const productRoutes = require("./routes/productRoutes");

app.use(cors());
app.use(express.json());

const PORT = 4000;

app.use("/products", productRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to KronShop!");
});

app.listen(PORT, () => {
    console.log(`KronShop server running on port ${PORT}`);
    console.log(`http://127.0.0.1:${PORT}`);
});