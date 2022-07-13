const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception... Shutting Down");
    console.error(err);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

// connecting to db


const port = process.env.PORT || 5000;


const server = app.listen(port, () => {
    
    
    console.log("Listening at port " + port);
});





process.on("unhandledRejection", (err) => {
    console.log("Unhadled Rejection :(  Shutting Down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
