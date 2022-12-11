import { Router } from "express";
import { sellerController } from "../controllers/seller";
import { asyncMiddleware } from "../middlewares";
import { buyerController } from "../controllers/buyers";
import { loginSignupControllers } from "../controllers/auth";

const router = Router();


// Authentication, Signup Routes
router.post("/auth/register", asyncMiddleware(loginSignupControllers.signupNewUser));
router.post("/auth/login", asyncMiddleware(loginSignupControllers.loginUser));

// Seller's routes
router.post("/seller/create-catalog", asyncMiddleware(sellerController.createCatalog));
router.get("/seller/orders", asyncMiddleware(sellerController.getOrderDetails));

// Buyer's routes
router.get("/buyer/list-of-sellers",asyncMiddleware(buyerController.listAllSellers));
router.get("/buyer/seller-catalog/:sellerId",asyncMiddleware(buyerController.getSellerCatalog));
router.post("/buyer/create-order/:sellerId",asyncMiddleware(buyerController.updateOrderforSeller));

export { router };