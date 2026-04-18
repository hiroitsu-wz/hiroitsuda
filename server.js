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
    const { name, score, game } = req.body;
    const date = new Date().toLocaleString('ja-JP'); // 日本時間の日付

    fs.readFile('ranking.json', 'utf8', (err, data) => {
        let ranking = [];
        if (!err && data) {
            ranking = JSON.parse(data);
        }

        // 同じゲーム・同じ名前のデータがあるか探す
        const existingIndex = ranking.findIndex(item => item.name === name && item.game === game);

        if (existingIndex !== -1) {
            // すでにデータがある場合：スコアが高ければ更新
            if (score > ranking[existingIndex].score) {
                ranking[existingIndex].score = score;
                ranking[existingIndex].date = date; 
            }
        } else {
            // 新規プレイヤーの場合
            ranking.push({ name, score, game, date });
        }

        fs.writeFile('ranking.json', JSON.stringify(ranking, null, 2), (err) => {
            if (err) return res.status(500).send('保存失敗');
            res.json({ message: 'Success' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`TANITHEWORLD サーバー起動！`);
    console.log(`ブラウザで http://localhost:${PORT} を開いてね`);
});
