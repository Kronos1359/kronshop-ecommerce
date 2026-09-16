const {
    DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: "eu-north-1"
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "KronShopProducts";

const getProducts = async () => {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });

        const response = await docClient.send(command);
        return response.Items;

    } catch (error) {
        console.log("Failed to get products:");
        console.log(error);
    }
};

const getProductById = async (id) => {
    try {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id: id
            }
        });

        const response = await docClient.send(command);

        return response.Item;

    } catch (error) {
        console.log("Failed to get product:");
        console.log(error);
    }
};

const createProduct = async (product) => {
    try {
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: product
        });

        await docClient.send(command);
        return product;

    } catch (error) {
        console.log("Failed to create product:");
        console.log(error);
    }
};

const updateProduct = async (id, productData) => {
    try {
        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                id: id
            },

            UpdateExpression: "SET #name = :name, price = :price, stock = :stock",

            ExpressionAttributeNames: {
                "#name": "name"
            },

            ExpressionAttributeValues: {
                ":name": productData.name,
                ":price": productData.price,
                ":stock": productData.stock
            },

            ReturnValues: "ALL_NEW"
        });

        const response = await docClient.send(command);

        return response.Attributes;

    } catch (error) {
        console.log("Failed to update product:");
        console.log(error);
    }
};

const deleteProduct = async (id) => {
    try {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                id: id
            }
        });

        await docClient.send(command);

        return true;

    } catch (error) {
        console.log("Failed to delete product:");
        console.log(error);
    }
};




module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};