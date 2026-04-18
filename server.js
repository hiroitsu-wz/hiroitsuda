const express = require('express');
const app = express();
const PORT = 3000;

// 同じフォルダにあるHTMLや画像（puyo1.pngなど）を表示できるようにする
app.use(express.static('.'));
app.use(express.json());

// スコアを保存する配列
let ranking = [];

// ランキングを返す窓口
app.get('/api/ranking', (req, res) => {
    res.json(ranking);
});

// スコアを受け取る窓口
app.post('/api/score', (req, res) => {
    // game も受け取るように追加
    const { name, score, game } = req.body; 
    
    // ランキングに保存（game名も一緒に保存する）
    ranking.push({ name, score, game, date: new Date().toLocaleString() });
    
    // スコア順に並べ替え
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10); // 上位10人

    res.json({ message: "保存成功！" });
});

app.listen(PORT, () => {
    console.log(`TANITHEWORLD サーバー起動！`);
    console.log(`ブラウザで http://localhost:${PORT} を開いてね`);
});