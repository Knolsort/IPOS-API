import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";

import customerRouter from "./routes/customer";
import userRouter from "./routes/user";
import shopRouter from "./routes/shop";
import supplierRouter from "./routes/supplier";
import unitRouter from "./routes/unit";
import brandRouter from "./routes/brand";
import categoryRouter from "./routes/category";
import productRouter from "./routes/product";
import * as dotenv from "dotenv";
import saleRouter from "./routes/sale";
import payeeRouter from "./routes/payee";
import expenseCategoryRouter from "./routes/expense-category";
import expenseRouter from "./routes/expense";
import notificationRouter from "./routes/notification";
import adjustmentRouter from "./routes/adjustment";
import purchaseRouter from "./routes/purchase";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import gProductRouter from "./routes/gproduct";
import creditRouter from "./routes/credit";

dotenv.config();

const app = express();

// Middleware

// Clerk auth
app.use(clerkMiddleware());

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: "You are making too many requests. Please try again later.",
    });
  },
});

// Apply general rate limiter to all requests
app.use(generalLimiter);

// Configure stricter rate limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, //Limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "You are making too many requests. Please try again later.",
    });
  },
});

// Apply stricter rate limit to sensitive routes
app.use("/api/v1/sales", strictLimiter);
app.use("/api/v1/users", strictLimiter);
app.use("/api/v1/auth", strictLimiter);

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// API Routes
app.use("/api/v1", customerRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", shopRouter);
app.use("/api/v1", supplierRouter);
app.use("/api/v1", unitRouter);
app.use("/api/v1", brandRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", gProductRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", saleRouter);
app.use("/api/v1", payeeRouter);
app.use("/api/v1", expenseCategoryRouter);
app.use("/api/v1", expenseRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", adjustmentRouter);
app.use("/api/v1", purchaseRouter);
app.use("/api/v1", creditRouter);

// Error handling middleware
// app.use(
//   (
//     err: any,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     console.error(err.stack);
//     res.status(500).json({ error: "Something went wrong!" });
//   }
// );

// Handle 404
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Only listen in development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express app
export default app;
