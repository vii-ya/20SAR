// api/stock.js
// Vercel Serverless Function：代理 Yahoo Finance，解决 CORS

export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { ticker } = req.query;

    if (!ticker) {
        return res.status(400).json({ error: '缺少 ticker 参数' });
    }

    try {
        // 拉取最近 1 年的日线数据
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}` +
                    `?interval=1d&range=1y`;

        const response = await fetch(url, {
            headers: {
                // Yahoo 有时会检查 User-Agent
                'User-Agent': 'Mozilla/5.0 (compatible; StockDashboard/1.0)'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Yahoo 请求失败' });
        }

        const data = await response.json();

        // 直接透传给前端
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}