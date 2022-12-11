import { Request, Response } from "express";
import { userModel } from "../models/users";
import { catalogModel,productJoiSchema } from "../models/catalog";

export const buyerController = {
    // to list all sellers
    listAllSellers: async (req:Request, res:Response) => {
        const condition = { userType: "Seller"};
        // Since we have set userType in doc, filtering the Seller based on it.
        const listSeller = await userModel.find(condition,{password:0});
        
        return res.status(200).send({listSeller});
    },
    
    getSellerCatalog: async (req:Request,res:Response) => {
        const condition = req.params;

        // finding the seller catalog based on their sellerId
        const listCatalog = await catalogModel.findOne(condition);

        // if product is present then show, else throw error.
        if(listCatalog?.products){
            const product = listCatalog.products;
            return res.status(200).send({product});
        }
        else{
            return res.status(400).send("No product catalog exist for this sellerId")
        }
    },
    updateOrderforSeller: async (req:Request, res:Response) => {
        const orders = req.body;
        // Validating if req body has both product name and price with it.
        const {error} = productJoiSchema.validate(orders);
        if ( error ) {
            return res.status(500).send(error.details[0].message);
        }
        const sellerId = req.params;
        // Checking if seller exists
        let seller = await catalogModel.findOne(sellerId);
        if (!seller){
            return res.status(400).send('Order failed. Seller does not exist');
        }

        // Updating the orders in Catalog(Product) collection
        await catalogModel.updateOne(sellerId, {$push: {orders}}, { upsert: true});

        return res.status(200).send("Yayyy! Your order is successful");
    }
}