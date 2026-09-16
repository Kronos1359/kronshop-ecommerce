const product = {
    name: "Keyboard",
    price: 2500,
    stock: 5
};

const {name, price, stock} = product;

console.log(name);
console.log(price);
console.log(stock);


const categories = [
    "Electronics",
    "Clothing",
    "Books"
];

const [firstCategory, secondCategory, thirdCategory] = categories;

console.log(firstCategory);
console.log(secondCategory);
console.log(thirdCategory);
