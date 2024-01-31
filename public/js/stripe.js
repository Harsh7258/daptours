import axios from "axios";
import { showAlert } from "./alert";

// const stripe = Stripe(`${process.env.STRIPE_PUBLIC_KEY}`);
const stripe = Stripe('pk_test_51OeYEkSDNkTUJihyqRsJ9b8lZQuTgmvYgjE1AZ7pjzFje2AAYZ1znaIviE90TPny0g4iDrMYRxRHy810jGHQrHgh009VVGqtKp');

export const bookTour = async tourId => {
    // 1. Get checkout session from API
    try {
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout/${tourId}`
        );
        console.log(session);
        // 2. Create checkout form + chance credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (error) {
        console.log(error);
        showAlert('error', error);
    }
};