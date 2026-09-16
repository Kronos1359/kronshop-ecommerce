const promise = new Promise((resolve, reject) => {

    setTimeout(() => {
        resolve("Products loaded!");
    }, 2000);

});

console.log("Fetching products...");

promise.then(result => {
    console.log(result);
});