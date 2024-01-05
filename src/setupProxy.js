// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/sbar/api', // Chỉ áp dụng proxy cho các yêu cầu bắt đầu bằng '/api'
    createProxyMiddleware({
      target: 'https://dragongem.biasaigon.vn', // URL của proxy bạn muốn sử dụng
      changeOrigin: true,
    })
  );
};
