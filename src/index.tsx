import { Hono } from 'hono'

// 1. 配管の設定（DBという名前でD1を使う宣言）
type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 2. 表示（AccessのForm_Open / 一覧表示）
app.get('/', async (c) => {
  // SQLでデータを取得。松村さんの得意分野です！
  const { results } = await c.env.DB.prepare("SELECT * FROM Memo ORDER BY id DESC").all();

  return c.html(
    <div style="padding: 20px; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Hono + D1 成功！</h1>
      
      {/* 入力フォーム */}
      <form method="POST" style="margin-bottom: 20px; background: #f4f4f4; padding: 15px; border-radius: 8px;">
        <input type="text" name="content" placeholder="メモを入力..." required 
               style="padding: 10px; width: 70%; border: 1px solid #ccc; border-radius: 4px;" />
        <button type="submit" 
                style="padding: 10px 20px; margin-left: 10px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          保存
        </button>
      </form>

      {/* データ一覧（Accessの帳票形式） */}
      <table border="1" style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
        <thead>
          <tr style="background: #eee;">
            <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
            <th style="padding: 10px; border: 1px solid #ddd;">内容</th>
            <th style="padding: 10px; border: 1px solid #ddd;">登録日時</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row: any) => (
            <tr key={row.id}>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">{row.id}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">{row.content}</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-size: 0.8em; color: #666;">{row.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

// 3. 保存（AccessのcmdSave_Click / データ追加）
app.post('/', async (c) => {
  const body = await c.req.parseBody();
  
  // SQLでINSERT。ここも松村さんのSQL知識がそのまま活きます。
  await c.env.DB.prepare("INSERT INTO Memo (content) VALUES (?)")
    .bind(body.content)
    .run();

  // 保存が終わったら、自分自身に戻る（再表示）
  return c.redirect('/')
})

export default app