const app = require("./src/app");

const PORT = process.env.PORT || 5002

const server = app.listen(PORT, () => {
    console.log(`Web Service start with ${PORT}`);
})

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit Server`))
// })