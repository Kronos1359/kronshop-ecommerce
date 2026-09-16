const promise = new Promise((resolve, reject) => {

    setTimeout(() => {
        resolve("Products loaded!");
    }, 2000);

});

console.log("Fetching products...");

const loadProducts = async () => {

    const result = await promise;

    console.log(result);

};

loadProducts();