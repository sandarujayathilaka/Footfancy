import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import Stripe from "stripe";
import dbConnect from '../config/doConnect.js';
import userRoutes from '../routes/userRoute.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productsRoter from '../routes/productsRoute.js';
import categoriesRouter from '../routes/categoriesRoute.js';
import brandsRouter from '../routes/brandsRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewRouter from '../routes/reviewRoute.js';
import orderRouter from '../routes/ordersRoute.js';
import e from 'express';
import Order from '../model/Order.js';
import couponsRouter from '../routes/couponsRoute.js';


dbConnect();
const app = express();
app.use(cors())

//stripe webhook

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_e0c2f89479f5cde8060565d3618f985f8a4c8dabf2b2307b61ee52ee7c0c8448";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type==="checkout.session.completed"){
    //update order details after payment
    const session = event.data.object;
    const{orderId} =session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;
    //find the order
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId),{
      totalPrice:totalAmount/100,
      currency,paymentMethod,paymentStatus
    },
    {new:true});
    console.log(order);
  }else{
    return
  }

  // // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

//pass  incoming data to json
app.use(express.json());

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productsRoter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/coupon", couponsRouter);

//err middleware
app.use(notFound)
app.use(globalErrHandler)

export default app;