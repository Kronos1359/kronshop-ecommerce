const products = [
    {
        name: "Keyboard",
        price: 2500,
        stock: 5
    },
    {
        name: "Mouse",
        price: 1200,
        stock: 10
    },
    {
        name: "Monitor",
        price: 15000,
        stock: 3
    }
];


const affordableProducts = products.filter(product => product.price < 5000);
console.log(affordableProducts);