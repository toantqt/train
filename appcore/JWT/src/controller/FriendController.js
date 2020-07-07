const debug = console.log.bind(console);
//khi xác thực token hợp lệ thực hiện giả lập lấy danh sách bạn bè và trả về cho user
//trong thực tế là query đến DB
let friendLists = (req, res) => {
  const friends = [
    {
      name: "test1",
    },
    {
      name: "test2",
    },
    {
      name: "test3",
    },
  ];
  return res.status(200).json(friends);
};

module.exports = {
  friendLists: friendLists,
};
