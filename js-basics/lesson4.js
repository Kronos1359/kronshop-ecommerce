const product = "Keyboard"
const price = 2500
const stock = 5

if (price<5000 && stock>0) {
    console.log("Product is affordable\n","Product is in stock");
} else if (stock === 0) {
    console.log("Product is out of stock.");
} else {
    console.log("Expensive product.");
}
