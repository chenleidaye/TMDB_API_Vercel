const axios = require('axios');
const url = require('url');
const common = require('../utility/common.js');

module.exports = async (req, res) => {
  try {
    let requestUrl = req.url;
    if (!requestUrl.startsWith('/get')) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    // 去除 /get 前缀，保留后面路径和查询
    requestUrl = requestUrl.replace(/^\/get/, '');

    // 解析请求 URL 和查询参数
    const parsedUrl = url.parse(requestUrl, true);

    // 路径是否以 /3 开头，没有则拼接 /3
    let pathname = parsedUrl.pathname;
    if (!pathname.startsWith('/3')) {
      pathname = '/3' + pathname;
    }

    // 添加 api_key 参数
    const query = parsedUrl.query || {};
    query.api_key = common.apiKey;

    // 重新构造查询字符串
    const queryString = Object.entries(query)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');

    // TMDb 完整请求地址
    const tmdbUrl = `https://api.themoviedb.org${pathname}?${queryString}`;

    // 通过 axios 请求 TMDb API
    const response = await axios.get(tmdbUrl);

    // 返回 JSON
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response.data));

    console.log(`[TMDb] Request: ${tmdbUrl}`);
  } catch (error) {
    console.error('[TMDb] Error:', error.response ? error.response.data : error.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Error fetching TMDb data: ${error.message}`);
  }
};
