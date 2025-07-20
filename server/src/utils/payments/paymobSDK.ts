import axios from "axios";
import { log } from "console";

// Load from env or config file
const API_KEY = process.env.PAYMOB_API_KEY!;
const INTEGRATION_ID = Number(process.env.PAYMOB_INTEGRATION_ID!);
const IFREAME_ID = Number(process.env.PAYMOB_IFRAME_ID!);

/**
 * Generates a Paymob iframe URL for payment.
 * @param amountInEGP Amount in EGP (e.g., 100 means 100 EGP)
 * @returns URL to redirect or embed iframe
 */
export async function generatePaymobPaymentLink(amountInEGP: number): Promise<Object> {
    try {
      const amountCents = Number((amountInEGP * 100).toFixed(2))
  
      // 1. Authentication
      const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
        api_key: API_KEY,
      });
      const token: string = authRes.data.token;
      log("Paymob Auth Token:", token);
  
      // 2. Create Order
      const orderRes = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: "EGP",
        items: [],
      });
      const orderId: number = orderRes.data.id;
      
  
      // 3. Get Payment Key
      const paymentKeyRes = await axios.post(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          auth_token: token,
          amount_cents: amountCents,
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: "NA",
            email:  "user@example.com",
            floor: "NA",
            first_name:  "NA",
            street: "NA",
            building: "NA",
            phone_number: "+201000000000",
            shipping_method: "NA",
            postal_code: "NA",
            city: "NA",
            country: "NA",
            last_name: "NA",
            state: "NA",
          },
          currency: "EGP",
          integration_id: INTEGRATION_ID,
        }
      );
      const paymentToken: string = paymentKeyRes.data.token;
      
      // 4. Construct iframe URL
      const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${IFREAME_ID}?payment_token=${paymentToken}`;
  
      return {orderId, iframeURL};
    } catch (error) {
      console.log("Error generating Paymob payment link:", error);
      throw new Error("Failed to generate payment link paymob is currently down");
    }
}

/**
 * Check if a Paymob order is paid
 * @param orderId - The Paymob order ID to check
 * @returns boolean indicating whether the order is paid
 */
export async function isOrderPaid(orderId: string): Promise<boolean> {
    // 1. Authenticate and get token
    const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: API_KEY,
    });
    const token: string = authRes.data.token;

    // 2. Fetch order info
    const orderRes = await axios.get(
      `https://accept.paymob.com/api/ecommerce/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 3. Check payment status
    const orderData = orderRes.data;
    const paidAmount = orderData.paid_amount_cents;
    const paymentStatus = orderData.payment_status;

    return paidAmount > 0 || paymentStatus === "PAID";
}