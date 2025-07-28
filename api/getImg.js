const axios = require('axios');

module.exports = async (req, res) => {
  try {
    let requestUrl = req.url;

    if (!requestUrl.startsWith('/img')) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    // 去除 /img 前缀，剩下图片路径
    requestUrl = requestUrl.replace(/^\/img/, '');

    // TMDb 图片完整地址
    const imgUrl = `https://image.tmdb.org${requestUrl}`;

    // 请求图片数据，响应类型 arraybuffer 以二进制形式接收
    const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });

    // 识别图片MIME类型：这里简单用jpeg，你可以按需扩展判断
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': response.data.length,
    });

    // 发送图片二进制数据
    res.end(response.data, 'binary');
  } catch (error) {
    console.error('[Image] Error fetching image:', error.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Error fetching image: ${error.message}`);
  }
};
