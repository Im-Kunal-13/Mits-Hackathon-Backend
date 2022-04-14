// Requiring Express
const express = require("express");
// Requiring Colors through which we can apply different colors to console outputs.
const colors = require("colors");
// Requiring dotenv to use environment variables.
const dotenv = require("dotenv").config();
// Error Handler Middleware which we created that overrides the default express error handler.
const { errorHandler } = require("./middleware/errorMiddleware");
// Function to connect to the database.
const connectDB = require("./config/db");
// Importing cors
const cors = require("cors");
const dotenv = require("dotenv");
// For some reason if one of the ports doesn't work, then the other will be used.
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/auth.js");

// As soon as we start the server, we call the function to connect to the Mongo DB database.
connectDB();

const app = express();
const PORT = 5000;

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require("twilio")(accountSid, authToken);

// MIDDLEWARES
app.use(cors());

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.use(express.urlencoded());


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/", (req, res) => {
  const { message, user: sender, type, members } = req.body;

  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          twilioClient.messages
            .create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber,
            })
            .then(() => console.log("Message sent!"))
            .catch((err) => console.log(err));
        }
      });

    return res.status(200).send("Message sent!");
  }

  return res.status(200).send("Not a new message request");
});

app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
