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


console.log(products[0].name);
console.log(products[1].price);
console.log(products[2].stock);

for (let i=0; i<products.length; i++) {
    console.log("Product " + (i+1) + ": " + products[i].name + " - ₹" + products[i].price);
}