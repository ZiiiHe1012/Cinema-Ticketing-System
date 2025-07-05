# 项目接口文档

## 接口总览

| 页面 | 接口名称 | 方法 | 描述 |
|------|----------|------|------|
| index.html | `/api/user/status` | GET | 获取当前用户是否登录及身份信息 |
| info.html | `/api/user/info` | GET | 获取用户详细信息 |
| info.html | `/api/user/payment-status` | GET | 查询用户是否已支付 |
| info.html | `/api/user/pay` | POST | 发起支付 |
| individualTicketPurchase.html | `/api/tickets/available` | GET | 获取可购买的票种及余量 |
| individualTicketPurchase.html | `/api/tickets/purchase` | POST | 提交个人购票请求 |
| groupTicketPurchase.html | `/api/tickets/group-purchase` | POST | 提交团体购票请求 |

---

## 接口详情

### 1. `GET /api/user/status`

**描述**：获取用户的登录状态和角色信息

- **请求参数**：无（使用 cookie 或 token）
- **返回示例**：
```json
{
  "loggedIn": true,
  "username": "zhangsan",
  "role": "user"
}
```

---

### 2. `GET /api/user/info`

**描述**：获取用户的基本资料（用于 info.html 页面）

- **请求参数**：无
- **返回示例**：
```json
{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "phone": "13800000000",
  "idCard": "110101199901011234"
}
```

---

### 3. `GET /api/user/payment-status`

**描述**：获取该用户是否已经完成支付

- **请求参数**：无
- **返回示例**：
```json
{
  "paid": false
}
```

---

### 4. `POST /api/user/pay`

**描述**：提交支付请求（点击按钮后触发）

- **请求参数**：
```json
{
  "amount": 99.00,
  "method": "wechat"
}
```

- **返回示例**：
```json
{
  "success": true,
  "redirectUrl": "/payment-gateway?token=xxxx"
}
```

---

### 5. `GET /api/tickets/available`

**描述**：获取所有可购买的票种和余票数量

- **请求参数**：无
- **返回示例**：
```json
[
  {
    "ticketId": 1,
    "name": "普通票",
    "price": 100,
    "remaining": 120
  },
  {
    "ticketId": 2,
    "name": "VIP票",
    "price": 300,
    "remaining": 50
  }
]
```

---

### 6. `POST /api/tickets/purchase`

**描述**：提交个人购票请求

- **请求参数**：
```json
{
  "ticketId": 1,
  "quantity": 1
}
```

- **返回示例**：
```json
{
  "success": true,
  "orderId": "20250704001"
}
```

---

### 7. `POST /api/tickets/group-purchase`

**描述**：提交团体购票请求

- **请求参数**：
```json
{
  "ticketId": 1,
  "quantity": 5,
  "groupName": "清华计算机系",
  "contact": "13800000000"
}
```

- **返回示例**：
```json
{
  "success": true,
  "groupOrderId": "G20250704001"
}
```
