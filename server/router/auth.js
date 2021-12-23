const { response } = require("express");
const express = require("express");
const router = express.Router();
require('dotenv').config();
require('../db/conn');

const Customer = require('../model/customer');
router.get('/', (req, res) => {
    res.send("Home Page");
});
router.get('/Customers', async (req, res) => {
    try {
        const response = await Customer.find({});
        res.send(response);
    } catch (error) {
        console.log(error);
    }
})
router.post('/Customers', async (req, res) => {
    const { id, money_val } = req.body;
    if (!id || !money_val) {
        return res.status(422).json({ error: "unprocessable data" });
        console.log("empty");
    }
    const ownerresp = await Customer.findOne({ email: "parth@gmail.com" });
    const resp = await Customer.findOne({ email: id });
    if (!resp) {
        return res.status(409).json({ error: "User not found" });
    }
    else {
        try {
            if (money_val > ownerresp.balance) {
                return res.json({ error: "Inalid amount value" });
            }
            const ownerval = (ownerresp.balance - money_val);
            const val = (resp.balance + Number(money_val));
            const updateOwner = await Customer.updateOne({ email: "parth@gmail.com" }, { $set: { balance: ownerval } });
            const update = await Customer.updateOne({ email: id }, { $set: { balance: val } });
            if (updateOwner && update) {
                return res.status(200).json({ error: "updated" });
            }
        } catch (error) {
            console.log(error);
        }
    }
})
module.exports = router;