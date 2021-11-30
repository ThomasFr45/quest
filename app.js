const express = require('express');
const app = express();
const PORT = 5000;
const { setupRoutes } = require('./routes');
app.use(express.json())
setupRoutes(app);
app.listen(PORT, () => console.log(`✅ -- Server Running on port: http://localhost:${PORT} -- ✅`));