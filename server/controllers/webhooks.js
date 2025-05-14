import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// Clerk Webhooks
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const { data, type } = req.body;

    switch (type) {
      case 'user.created': {
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
          role: 'student'
        });
        break;
      }
      case 'user.updated': {
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        break;
      }
      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        break;
      }
    }

    res.json({});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stripe setup
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Webhooks - Enhanced for test mode
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const purchaseId = session.metadata?.purchaseId;

        console.log("🧾 Stripe Checkout Session Completed");
        console.log("🔍 Metadata:", session.metadata);

        if (!purchaseId) {
          console.error("❌ purchaseId missing in session metadata");
          return res.status(400).send("Missing purchaseId");
        }

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
          console.error("❌ Purchase not found:", purchaseId);
          return res.status(404).send("Purchase not found");
        }

        const user = await User.findById(purchase.userId);
        const course = await Course.findById(purchase.courseId);

        if (!user || !course) {
          console.error("❌ User or course not found");
          return res.status(404).send("User or course not found");
        }

        console.log("📌 User:", user._id, user.name);
        console.log("📌 Course:", course._id, course.courseTitle);

        // Prevent duplicates
        if (!user.enrolledCourses.includes(course._id.toString())) {
          user.enrolledCourses.push(course._id);
          await user.save();
          console.log("✅ User updated with course");
        }

        if (!course.enrolledStudents.includes(user._id.toString())) {
          course.enrolledStudents.push(user._id);
          await course.save();
          console.log("✅ Course updated with user");
        }

        purchase.status = 'completed';
        await purchase.save();
        console.log(`🎉 Purchase marked completed for ${user.name}`);

        break;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed':
        console.warn(`⚠️ Stripe event: ${event.type}`);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        break;
    }

    res.json({ received: true });

  } catch (error) {
    console.error("🔥 Stripe webhook handler failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
