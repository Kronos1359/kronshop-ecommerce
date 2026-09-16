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

const prices = products.map(product => product.price);
console.log(prices);

const namePrice = products.map(product => ({
    name: product.name,
    price: product.price}));

for (let i=0; i<namePrice.length; i++) {
    console.log(namePrice[i].name + " costs " + namePrice[i].price);
}


const namePrices = products.map(product => product.name + " costs ₹" + product.price);
console.log(namePrices);
