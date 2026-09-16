const promise = new Promise((resolve, reject) => {

    setTimeout(() => {
        reject("Failed to load products!");
    }, 2000);

});

const loadProducts = async () => {

    try {
        const result = await promise;

        console.log(result);

    } catch (error) {
        console.log("Something went wrong:", error);
    }

};

loadProducts();