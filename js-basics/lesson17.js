const products = [
    {
        id: 1,
        name: "Keyboard",
        price: 2500,
        stock: 5
    },
    {
        id: 2,
        name: "Mouse",
        price: 1200,
        stock: 10
    },
    {
        id: 3,
        name: "Monitor",
        price: 15000,
        stock: 3
    }
];

const getProductsFromDatabase = () => {

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve(products);
        }, 2000);

    });

};

const loadProducts = async () => {

    try {

        const products = await getProductsFromDatabase();

        console.log("Products received:");
        console.log(products);

    } catch (error) {

        console.log("Failed to get products:", error);

    }

};

loadProducts();