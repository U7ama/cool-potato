const express = require("express");
require("dotenv").config();
const cors = require("cors");
const recipeRoutes = require("./routes/Recipe");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./documentation/docs");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api", recipeRoutes);
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      docExpansion: "none",
    },
  })
);

// docker build -t usamaa7lam/coolpotato .
// docker run -e PORT=8080 -p 8080:8080 -d usamaa7lam/coolpotato
// gcloud auth configure-docker
// docker tag usamaa7lam/coolpotato gcr.io/dev-truth-417707/coolpotato
// docker build -t gcr.io/dev-truth-417707/coolpotato .
// docker push gcr.io/dev-truth-417707/coolpotato
// gcloud run deploy coolpotato     --image gcr.io/dev-truth-417707/coolpotato     --platform managed     --region us-central1     --allow-unauthenticated

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
