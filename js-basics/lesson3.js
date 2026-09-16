let cartCount = 0

const inStock = true;

if (inStock) {
    cartCount++;
    console.log("Product added!");
} else {
    console.log("Product not in stock!");
}
console.log("Cart count: " + cartCount);