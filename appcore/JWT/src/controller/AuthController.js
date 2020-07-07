const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
let tokenList = {};

//thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
//ma secretKey
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example-toantqt-@@";

//thoi gian song cua refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "365d";
//ma refreshTokenSecret
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-example-toantqt-@@";

/*
 * controller login
 * @param {*} req
 * @param {*} res
 */
let login = async (req, res) => {
  try {
    debug(
      `Đang giả lập hành động đăng nhập thành công với Email: ${req.body.email} và Password: ${req.body.password}`
    );

    // - Đầu tiên Kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa?
    // - Nếu chưa tồn tại thì reject: User not found.
    // - Nếu tồn tại user thì sẽ lấy password mà user truyền lên, băm ra và so sánh với mật khẩu của user lưu trong Database
    // - Nếu password sai thì reject: Password is incorrect.
    // - Nếu password đúng thì chúng ta bắt đầu thực hiện tạo mã JWT và gửi về cho người dùng.

    //thuc hien fake thong tin user
    debug(`Thực hiện fake thông tin user...`);
    const userFakeData = {
      _id: "1234-5678-910JQK-tqt",
      name: "Toản đẹp trai",
      email: req.body.email,
    };
    //thực hiện tạo mã Token, thời gian sống là 1 giờ
    debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
    const accessToken = await jwtHelper.generateToken(
      userFakeData,
      accessTokenSecret,
      accessTokenLife
    );

    //thực hiện tạo mã refresh token, thời gian sống là 1 năm
    debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
    const refreshToken = await jwtHelper.generateToken(
      userFakeData,
      refreshTokenSecret,
      refreshTokenLife
    );

    // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
    // lưu ý trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB
    tokenList[refreshToken] = { accessToken, refreshToken };
    //server send token to client
    debug(`Gửi Token và Refresh Token về cho client...`);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({
      message: "loi roi 3",
    });
  }
};

/*
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */

let refreshToken = async (req, res) => {
  // User gửi mã refresh token kèm theo trong body
  const refreshTokenFromClient = req.body.refreshToken;
  // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      //Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
      const decoded = await jwtHelper.verifyToken(
        refreshTokenFromClient,
        refreshTokenSecret
      );
      // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
      // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
      // debug("decoded: ", decoded);
      const userFakeData = decoded.data;
      console.log(userFakeData);
      //thực hiện tạo mã Token trong bước gọi refresh Token
      const accessToken = await jwtHelper.generateToken(
        userFakeData,
        accessTokenSecret,
        accessTokenLife
      );

      //send new token to client
      return res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({
        message: "Invalid refresh token",
      });
    }
  } else {
    //khong tim thay token trong request
    return res.status(403).json({
      message: "No token provided",
    });
  }
};

module.exports = {
  login: login,
  refreshToken: refreshToken,
};
