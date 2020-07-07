const jwtHelper = require("../helpers/jwt.helper");
const { decode } = require("jsonwebtoken");
const debug = console.log.bind(console);

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-toantqt-@@";

/*
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

let isAuth = async (req, res, next) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    //neu ton tai
    try {
      //thực hiện giải mã token xem có hợp lệ ko
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );
      //nếu token hop le, lưu thông tin giải mả được vào đối tượng req, dùng cho các xử lý ở phía sau.
      req.jwtDecoded = decoded;
      // cho phep req đi tiếp sang controller
      next();
    } catch (error) {
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

module.exports = {
  isAuth: isAuth,
};
