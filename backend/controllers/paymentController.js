const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
const Order = require('../models/Order');
const { sortObject } = require('../utils/vnpayHelper');

// @desc    Tạo URL thanh toán VNPAY
// @route   POST /api/payment/create_payment_url
// @access  Private
const createPaymentUrl = async (req, res) => {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Nhận ID đơn hàng và số tiền từ Frontend gửi lên
        let { orderId, amount, bankCode } = req.body;

        let tmnCode = process.env.vnp_TmnCode;
        let secretKey = process.env.vnp_HashSecret;
        let vnpUrl = process.env.vnp_Url;
        let returnUrl = process.env.vnp_ReturnUrl;

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId; // Sử dụng ID đơn hàng làm mã giao dịch
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma don hang:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100; // VNPAY yêu cầu nhân 100
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.status(200).json({ url: vnpUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Xử lý kết quả trả về từ VNPAY (Frontend sẽ gọi API này)
// @route   GET /api/payment/vnpay_return
// @access  Public
const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let tmnCode = process.env.vnp_TmnCode;
        let secretKey = process.env.vnp_HashSecret;

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

        // Kiểm tra chữ ký bảo mật
        if (secureHash === signed) {
            // Kiểm tra mã phản hồi từ VNPAY (00 là thành công)
            if (vnp_Params['vnp_ResponseCode'] === '00') {
                const orderId = vnp_Params['vnp_TxnRef'];

                // Cập nhật trạng thái đơn hàng trong Database
                const order = await Order.findById(orderId);
                if (order && !order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = {
                        id: vnp_Params['vnp_TransactionNo'],
                        status: vnp_Params['vnp_ResponseCode'],
                        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
                    };
                    await order.save();
                }

                res.status(200).json({ code: vnp_Params['vnp_ResponseCode'], message: 'Giao dịch thành công' });
            } else {
                res.status(400).json({ code: vnp_Params['vnp_ResponseCode'], message: 'Giao dịch thất bại' });
            }
        } else {
            res.status(400).json({ code: '97', message: 'Chữ ký không hợp lệ (Checksum failed)' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentUrl, vnpayReturn };