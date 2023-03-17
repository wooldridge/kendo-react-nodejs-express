const express = require("express");
const marklogic = require("./marklogic");
const app = express();
const cors = require("cors");

const data = require('./products')

const { process } = require('@progress/kendo-data-query');

const currentYear = new Date().getFullYear();

app.use(cors());
app.use(express.json());

app.get("/products", async (req, res) => {
    let dataState = req.query.dataState;
    // Get products
    let mlResponse;
    try {
      mlResponse = await marklogic.getDocs('product');
    } catch(error) {
      console.error(error);
    }
    let skip = parseInt(dataState.skip);
    let take = parseInt(dataState.take);
    res.send(process(mlResponse,
        {
            skip: skip,
            take: take,
            group: dataState.group,
            sort: dataState.sort,
            filter: dataState.filter
        }
    ));
});

app.put("/update", async (req, res) => {
    let dataState = req.body.dataState;
    const item = req.body.item;
    const id = item.ProductID;
    // Update product
    let mlResponse;
    try {
      mlResponse = await marklogic.updateDoc(id, item, 'product');
    } catch(error) {
      console.error(error);
    }
    // Refresh
    try {
      mlResponse = await marklogic.getDocs('product');
    } catch(error) {
      console.error(error);
    }
    res.send(process(mlResponse, dataState));
});

app.post("/create", async (req, res) => {
    const item = req.body.item
    // Create product
    let mlResponse;
    try {
      mlResponse = await marklogic.createDoc(item, 'product');
    } catch(error) {
      console.error(error);
    }
    let dataState = req.body.dataState;
    // Refresh
    try {
      mlResponse = await marklogic.getDocs('product');
    } catch(error) {
      console.error(error);
    }
    res.send(process(mlResponse, dataState));
});

app.delete("/delete/:id", async (req, res) => {
    let dataState = req.body.dataState;
    const id = parseInt(req.params.id);
    // Delete product
    let mlResponse;
    try {
      mlResponse = await marklogic.deleteDoc(id);
    } catch(error) {
      console.error(error);
    }
    // Refresh
    try {
      mlResponse = await marklogic.getDocs('product');
    } catch(error) {
      console.error(error);
    }
    res.send(process(mlResponse, dataState));
});


app.listen(4000, () => {
    console.log("Server is running on port 4000");
});