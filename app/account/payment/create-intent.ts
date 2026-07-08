// // POST /api/payments/create-intent
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

// app.post("/api/payments/create-intent", async (req, res) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 50000, // ₹500 or $500 depending on currency
//     currency: "usd",
//   });

//   res.json({
//     clientSecret: paymentIntent.client_secret,
//   });
// });
