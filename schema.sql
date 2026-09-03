CREATE TABLE IF NOT EXISTS Memo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- テスト用のデータを1件入れておきます
INSERT INTO Memo (content) VALUES ('松村さんのHonoアプリへようこそ！');