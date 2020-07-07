const express = require("express");
const app = express();
const port = process.env.PORT || 6606;
const morgan = require("morgan");
//APIs
const initAPIs = require("./src/routes/api");

//cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());
app.use(morgan("dev"));
//khởi tạo các routes cho ứng dụng
initAPIs(app);

//start
app.listen(port, () => {
  console.log("server on port: " + port);
});
