Không giống như những ứng dụng Web (Express.js, Spring, ...) sẽ đóng vai trò:
    - Trong Expressjs, Spring: định tuyến (Route) đến cho các Function xử lý.
thì với Bot Discord: lệnh Commands/ trực tiếp gọi tới Controller tương ứng.
Vậy thì Controllers trong Bot Discord sinh ra để làm gì
=> Không định tuyến, nhưng nó bao gồm những Function xử lý chung.
=> Kiểm tra quyền người dùng, quyền của bot, validate dữ liệu đầu vào để xử lý.
=> Gọi Service để thực thi những Logic chính.