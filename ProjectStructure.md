/Manyullyn-App.
│── /commands           # Chứa các lệnh Slash Command
│    ├── ping.js        # Lệnh ping giúp trả về độ trễ của Server.
│    ├── avatar.js      # Lệnh avatar lấy avatar của người được tag tên.
│    ├── greet.js       # Lệnh chúc mừng gửi cho ai đó nhân sự kiện nào đó.
│    └── ...            # Các lệnh khác
│── /events             # Chứa các sự kiện (events) của bot
│    ├── ready.js       # Khi bot khởi động xong
│    ├── interactionCreate.js # Khi có người sử dụng lệnh
│    ├── guildCreate.js # Khi bot tham gia server mới
│    └── ...            # Các sự kiện khác
│── /handlers           # Xử lý tự động nạp lệnh & sự kiện
│    ├── commandHandler.js  # Tự động load tất cả lệnh
│    └── eventHandler.js    # Tự động load tất cả sự kiện
│── /config             # Chứa file cấu hình
│    ├── config.json    # Chứa token, prefix, client ID, guild ID, ...
│    ├── languages.json # Dữ liệu hỗ trợ đa ngôn ngữ
│
│── /utils              # Các hàm hỗ trợ tiện ích sử dụng chung.
│    ├── logger.js      # Các hàm hỗ trợ việc Logging chuyên nghiệp.
│    └── helper.js      # Các hàm hỗ trợ chung
│── /helpers            # Các hàm xử lý nghiệp vụ.   
│── .env                # Chứa biến môi trường (TOKEN, CLIENT_ID, GUILD_ID)
│── .gitignore          # Bỏ qua các file không cần thiết khi push git
│── package.json        # File quản lý thư viện
│── index.js            # File chính, nơi khởi động bot
└── README.md           # Hướng dẫn sử dụng bot
