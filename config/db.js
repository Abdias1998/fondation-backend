const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to Data base of Grace Speaks !`))
  .catch((error) =>
    console.log(
      `Error to connected to Database of Philharmonie La Grâce Parle  : ${error}`
    )
  );
