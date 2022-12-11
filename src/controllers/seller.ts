import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { catalogModel,productJoiSchema } from "../models/catalog";

export const sellerController = {
    // Create a catalog with products for seller
    createCatalog: async (req: Request, res:Response) => {
        const data = req.body;

        const products = data.products;
        const {error} = productJoiSchema.validate(products);
        if ( error ) {
            return res.status(500).send(error.details[0].message);
        }
        let catalog = await catalogModel.findOne({ sellerId: data?.sellerId });
        if (catalog) {
            return res.status(400).send(`Seller's catalog already exisits!`);
        }

        const updateCatalog = {
            sellerId: (data?.sellerId ? data.sellerId : `${uuidv4()}`),
            products: data.products
        }

        await catalogModel.create(updateCatalog);

        return res.status(200).send("Products has been added successfully in the cart");
    },
    // Getting the order placed by buyers.
    getOrderDetails: async (req:Request, res:Response) => {
        const sellerId = req.query;
        const projection = {products:0, _id:0};

        const orderDetails = await catalogModel.findOne(sellerId,projection);

        if(orderDetails.orders){
            return res.status(200).send({orders: orderDetails.orders});
        }
        else{
            return res.status(400).send("No orders received for this seller.");
        }
    }

} 