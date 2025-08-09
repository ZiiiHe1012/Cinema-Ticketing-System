# CINEMATIX 电影选座系统

![](assets/index.png)

## 一、项目概述

本项目是一个电影选座系统，支持个人购票和团体购票两种模式，实现了从购票信息填写、座位选择到订单管理的完整流程。

## 二、代码结构及使用说明

### 项目目录结构

```
Cinema-Ticketing-System/
│   ├── html/                           # HTML 文件目录
│   ├── index.html                      # 系统主页面
│   ├── individualInfoFilling.html      # 个人购票信息填写页
│   ├── individualTicketPurchase.html   # 个人购票展示页
│   ├── groupInfoFilling.html           # 团体购票信息填写页
│   ├── groupTicketPurchase.html        # 团体购票展示页
│   ├── seatSelection.html              # 座位选择页面
│   ├── info.html                       # 订单管理页面
│   ├── setting.html                    # 参数配置页面
├── styles/                             # 样式文件目录
│   ├── index.css                       # 主页样式
│   ├── individualInfoFilling.css       # 个人购票信息填写样式
│   ├── individualTicketPurchase.css    # 个人购票展示样式
│   ├── groupInfoFilling.css            # 团体购票信息填写样式
│   ├── groupTicketPurchase.css         # 团体购票展示样式
│   ├── seatSelection.css               # 座位选择样式
│   ├── info.css                        # 订单管理样式
│   └── setting.css                     # 参数配置样式
├── scripts/                            # JavaScript 脚本目录
│   ├── navigation.js                   # 导航逻辑
│   ├── individualInfoFilling.js        # 个人购票信息填写逻辑
│   ├── individualTicketPurchase.js     # 个人购票展示逻辑
│   ├── groupInfoFilling.js             # 团体购票信息填写逻辑
│   ├── groupTicketPurchase.js          # 团体购票展示逻辑
│   ├── seatSelection.js                # 座位选择逻辑
│   ├── info.js                         # 订单管理逻辑
│   └── setting.js                      # 参数配置逻辑
└── images/                             # 图片资源目录
    ├── favicon.png                     # 网站图标
    ├── background_3.jpg                # 背景图
    ├── index/                          # 主页相关图片
    │   ├── background.jpg              # 背景图
    │   └── avatar.png                  # 用户头像
    ├── info/                           # info页面相关图片
    │   ├──background_info.jpg          # info页面背景图
    ├── greenSeat.png                   # 可选座位图标
    ├── yellowSeat.png                  # 已选座位图标
    ├── redSeat.png                     # 已售座位图标
    └── blackSeat.png                   # 不可选座位图标
```

### 使用说明

解压缩文件夹后，进入`html`文件目录，随后点击`index.html`即可进入系统主界面。各模块的使用方法会在下一板块进行分别介绍

## 三、各模块详细说明

### 1. 主界面模块 (index)

#### 实现思路

- **页面结构**：`index.html` 采用全屏背景图设计，通过半透明遮罩层增强视觉层次感
- **布局设计**：
  1. 顶部导航栏：包含项目名称"CINEMATIX"、用户头像、"我的订单"和"参数配置"按钮
  2. 中央文字展示："精彩大片 从选对座位开始"的标语
  3. 购票入口：个人购票和团体购票两个主要功能按钮
  4. 底部装饰：采用渐变椭圆形遮挡，增强页面美感

#### 核心功能

- **导航逻辑** (`navigation.js`)：
  1. 个人购票：点击后跳转至 `individualInfoFilling.html`
  2. 团体购票：点击后跳转至 `groupInfoFilling.html`
  3. 我的订单：跳转至 `info.html` 查看所有订单
  4. 参数配置：跳转至 `setting.html` 进行系统设置

#### 使用说明

1. 打开系统首页（`index.html`）
2. 选择购票方式：
   - 个人购票：适合单人或少量人员购票
   - 团体购票：适合2人及以上的团体购票
3. 点击"我的订单"查看历史订单
4. 点击"参数配置"调整影厅座位设置

### 2. 参数配置模块 (setting)

#### 实现思路

- **配置管理**：通过 `localStorage` 持久化存储座位配置
- **动态计算**：实时显示排数（座位总数÷20）
- **数据验证**：限制座位总数在80-320之间，确保布局合理性

#### 核心功能

1. **加载配置**：从 `localStorage` 读取已保存的座位数，默认200
2. **实时预览**：输入座位数时动态更新显示的排数
3. **保存配置**：验证输入合法性后存储到 `localStorage`
4. **恢复默认**：一键重置为默认配置（200座位）

#### 使用说明

1. 进入参数配置页面
2. 在"座位总数"输入框中输入期望的座位数（80-320）
3. 查看实时更新的排数信息
4. 点击"保存配置"应用设置
5. 如需恢复默认值，点击"恢复默认"

#### 遇到问题及解决办法

- **数据同步问题**：选座页面需要读取最新配置，通过 `localStorage` 确保跨页面数据一致性
- **输入限制**：通过前端验证确保输入在合理范围内，避免极端值导致的布局异常

### 3. Canvas 绘制模块 (seatSelection)

#### 参数定义说明

以下数据为绘制电影院使用的参数和每个参数具体说明，改变参数可以改变电影院的布局和绘制

```javascript
const config = {
   centerX: 450,       // 扇形圆心X坐标(画布坐标系)
   centerY: -2370,     // 扇形圆心Y坐标(负值表示在画布上方)
   startAngle: 83,     // 扇形起始角度(度)
   endAngle: 97,       // 扇形结束角度(度)
   minRadius: 2625,    // 最内排的半径
   seatsPerRow: 20,    // 每排座位数
   seatWidth: 25,      // 座位图片宽度
   seatHeight: 25,     // 座位图片高度
   rowSpacing: 38      // 排间距
};
```

#### 座位布局算法

实现在函数`initializeSeats()`中

1. **计算总行数**：`rows = Math.ceil(totalSeats / seatsPerRow)`

2. **计算角度分布和间隔**：`angleSpacing = angleRange / seatsPerRow + 3`

	$+3$ 是为了让两侧加起来留出三列座位的空间模拟过道的宽度

3. **遍历每一行**：

	· 计算该行对应的圆弧半径`radius = config.minRadius + (row * config.rowSpacing)`

	· 计算该行座位的偏移，使得座位可以居中分布`offset = (angleRange - (angleSpacing * (seatsInRow - 1))) / 2`

4. **遍历每一列**：

	· 先计算出每个座位对应的角度`angle = config.startAngle + offset + (col * angleSpacing)`

	· 再将其转化为弧度制`angle = angle * Math.PI / 180;`

	· 根据极坐标公式计算每个座位的笛卡尔坐标

	```
	x = centerX + radius * cos(angle)
	y = centerY + radius * sin(angle) + 30
	```

#### 座位状态管理

- `default`：默认状态，加载绿色的座椅`greenSeat.png`，座位可选
- `selected`：已选状态，加载黄色的座椅`yellowSeat.png`，座位被当前用户选择
- `booked`：已预订状态，加载红色的座椅`redSeat.png`，座位不可选
- `unavailable`：不可选状态，加载黑色座椅`blackSeat`，根据用户类型限制

#### 电影院canvas绘制流程

**a. 绘制扇形区域**

实现在`drawSector()`函数中

1. **绘制外圆弧**：`ctx.arc(config.centerX, config.centerY, maxRadius, startRad, endRad, false)`

2. **绘制内圆弧**：`ctx.arc(config.centerX, config.centerY, minRadius, endRad, startRad, true)`

3. **闭合区域并且填充颜色**：

	```
	 ctx.fillStyle = 'rgba(255, 100, 100, 0.1)'
	 ctx.fill()
	```

4. **绘制边框和屏幕示意**

**b. 绘制座位**

实现在`drawSeats()`函数中

1. **绘制座位图片**：

	- 遍历所有座位对象
	- 使用`save()`保存当前绘图状态
	- 通过`translate()`将坐标系原点移动到座位中心点
	- 使用`rotate()`旋转坐标系，使座位朝向屏幕中心（减去π/2弧度）
	- 根据座位状态获取对应的图片资源

2. **绘制座位列号**：

	在遍历座位的同时，会将每个座位的`seat.col`，根据座位的状态设置成不同颜色，居中显示在对应座位下方

3. **绘制座位行号**：

	遍历每一行，并且找到该`seat.col`最大的座位，将标签生成在该座位右侧

#### 交互处理

1. **坐标转换**：将鼠标坐标转换为 Canvas 坐标
2. **座位检测**：检测点击位置是否在座位范围内
3. **状态更新**：根据当前模式（个人/团体）更新座位状态

#### 代码结构说明

- `init()`：初始化系统
- `loadBookingData()`：加载预订数据
- `initializeSeats()`：初始化座位布局
- `drawAll()`：绘制所有内容
- `handleSeatClick()`：处理座位点击事件

### 4. 选座界面模块 (seatSelection)

#### 实现思路

- **扇形布局**：模拟真实影院的扇形座位分布，提供沉浸式选座体验
- **座位状态管理**：四种状态（可选、已选、已售、不可选）通过不同颜色座椅图标区分
- **智能限制**：根据观影人年龄自动限制可选座位（儿童不可选前3排，老人不可选后3排）
- **交互模式**：
  - 个人模式：逐个选择座位，支持切换购票人
  - 团体模式：优先连续选座，支持Ctrl多选

#### 核心算法

1. **座位布局算法**（详见上方Canvas绘制说明）：
   - 扇形分布计算
   - 极坐标到笛卡尔坐标转换
   - 动态排列与间距调整

2. **自动选座算法**：
   - 个人模式：按最佳观影位置（中间靠前）依次分配
   - 团体模式：优先寻找同排连续座位

3. **座位点击处理**：
   - 坐标转换与碰撞检测
   - 状态更新与UI同步
   - 限制条件实时检查

#### 使用说明

1. **个人选座**：
   - 在右侧人员列表中选择购票人
   - 点击座位图中的绿色座位进行选择
   - 按住Ctrl点击座位可快速切换到下一个人
   - 使用"自动选座"一键分配最佳座位

2. **团体选座**：
   - 默认选择同排连续座位
   - 点击任意座位自动选择该排合适的连续座位
   - "自动选座"会寻找最佳的连续座位

3. **确认选座**：
   - 查看右侧汇总信息确认选座结果
   - 点击"确认选座"进入支付/预订流程

### 5. 个人购票信息填写模块 (individualInfoFilling)

#### 实现思路

* **页面加载初始化**

  * 在 `DOMContentLoaded` 回调中，定义 `personCount`、获取主要 DOM 节点（`#additional-persons`、"＋"按钮、下一步按钮），并调用 `updateRemoveButtons()` 隐藏代表行的删除按钮

* **添加同行人**

  * 点击"＋"时，`personCount++`，动态创建一个 `<section class="box">`，设置 `data-index` 并填充姓名/年龄输入框及删除按钮
  * 将新节点 `appendChild` 到容器，调用 `attachRemoveEvent()` 绑定删除逻辑，再执行 `renumberSections()` 和 `updateRemoveButtons()` 保证序号与按钮显隐始终正确

* **删除逻辑复用**

  * `attachRemoveEvent(btn)` 内部查找所属 `section.box`、`remove()` 节点，`personCount--`，并再次执行重编号及按钮更新

* **重编号与显隐**

  * `renumberSections()` 遍历所有 `section.box`，按顺序更新 `data-index` 及 `<h2>` 文本（第 1 条为"购票代表"，其余为"同行人"）。
  * `updateRemoveButtons()` 根据当前 section 数量，仅允许序号≠1 的条目展示删除按钮

* **表单校验与数据保存**

  * 点击"下一步"时，先遍历所有文本/数字输入框做非空校验，若有未填项则 `alert` 并 `focus()`
  * 校验通过后，收集 `persons` 数组（包含 `userName`、`age`、`isRepresentative`），提取代表姓名 `orderRepresentative`，`sessionStorage.setItem('bookingData', …)`，最后跳转到 `seatSelection.html?mode=individual`

* **返回首页逻辑**

  * `setupReturnLogic()` 绑定顶部"返回主界面"按钮，将页面跳回 `index.html`

### 6. 团体购票信息填写模块 (groupInfoFilling)

#### 实现思路

* **页面结构**：`groupInfoFilling.html` 分两步：

  * **Step 1** ：输入团队人数 `<input id="participant-count" min="1" max="20">`，点击 `#confirm-count`
  * **Step 2** ：动态生成若干 `section.box`，每个含"姓名""年龄"输入；底部"下一步"按钮

* **核心逻辑**（`groupInfoFilling.js`）：

  1. **确认人数**：点击确认后校验 `2≤count≤20`，清空旧容器，循环生成 `count` 条成员输入区域，插入 `#participants-container`；禁用人数输入、隐藏确认按钮，显示第二步
  2. **提交下一步**：校验所有文本/数字输入非空，收集 `{userName,age}` 列表写入 `sessionStorage.bookingData`，并跳转 `seatSelection.html?mode=group`
  3. **返回首页**：同上

#### 使用说明

1. 打开 **groupInfoFilling.html**
2. 在"第一步"输入团队人数（2\~20），点击"确认人数"
3. 在"第二步"填写每位成员姓名和年龄
4. 点击"下一步"后进入团体选座页面

### 7. 订单管理模块 (info)

#### 实现思路

- **页面结构**：`info.html` 通过顶部导航栏（含"清空订单"和"返回主界面"按钮）和主内容区 `#ordersContainer` 占位，动态插入各类订单卡片；内嵌支付弹窗 `<div id="paymentModal">…</div>` 

* **核心逻辑**：`info.js`

  1. **loadOrders()**：从 `localStorage.userOrders` 读取并解析订单列表（默认 `[]`）
  2. **renderOrders()**：遍历订单，依据 `order.isGroupMode` 分别调用 `renderIndividualOrder` 或 `renderGroupOrder`，插入 DOM；空列表时显示"暂无订单"
  3. **renderIndividualOrder**：构建个人票卡片，展示电影名、姓名、时间、年龄、影厅、座位、购票代表、预订日期、票种、单价及状态操作按钮（取消/去支付/退票），并据状态切换按钮样式和可见性
  4. **renderGroupOrder**：先插入团体票汇总卡（显示总价、时间、影厅、人数、展开按钮），再动态生成隐藏的明细列表，每项为单人卡片，绑定"展开/收起"切换逻辑
  5. **事件绑定**：`setupOrderActions()` 统一监听"取消/退票/去支付"按钮；`setupPaymentModal()` 管理支付弹窗的打开、关闭及银行支付表单提交；`setupClearAllLogic()` 清空所有订单并刷新；`setupReturnLogic()` 返回首页

#### 使用说明

1. 打开 **info.html**
2. 若无订单，页面居中显示"暂无订单"
3. 若有订单：

   * 个人票：可点击"取消预订"或"去支付"，支付弹窗仅支持银行卡支付，提交后状态变"已出票"，按钮切换为"退票"
   * 团体票：可点击"展开"查看明细，支付/取消逻辑同上
4. 点击"退票"或"取消预订"后会释放已选座位并更新状态
5. "清空订单"一键清除所有数据
6. "返回主界面"跳回首页

### 8. 个人购票展示模块 (individualTicketPurchase)

#### 实现思路

- **页面结构**：`individualTicketPurchase.html` 重用顶部导航栏和返回按钮，主体为 `#ordersContainer` 容器；如有支付弹窗同样复用 `info.html` 的 modal 结构

- **核心逻辑**（`individualTicketPurchase.js`）：

  1. 定义硬编码常量：`movieName`,`showTime`,`hallNumber`,`unitPrice`,`seatNumbers`
  2. **合并数据**：从 `sessionStorage.bookingData` 拿到 `persons` 列表和 `orderRepresentative`，从 `sessionStorage.seatData` 拿到座位信息，合并到每个 `p.seatInfo`（默认为"未选座"）
  3. **渲染卡片**：遍历 `persons`，生成个人卡片 DOM，包括电影名、姓名、时间、年龄、影厅号、座位号、购票代表、票种及单价
  4. **返回首页**：同上，绑定返回逻辑

#### 使用说明

- 选座完成后自动跳转此页，展示所有成员（仅一人）购票详情
- 查看完毕点击"返回主界面"回首页
- 如需支付/取消等操作，本页不含相关按钮，均在 **info** 模块里统一管理

### 9. 团体购票展示模块 (groupTicketPurchase)

#### 实现思路

- **页面结构**：`groupTicketPurchase.html` 复用顶部导航栏与返回按钮，主体 `#ordersContainer` 动态插入团体汇总卡和明细区，底部 `#actionMessage` 用于显示"预定成功""已出票"等提示

- **核心逻辑**（`groupTicketPurchase.js`）：

  1. 硬编码常量与 `getCategory` 与个人模块一致
  2. **renderBookingInfo**：从 `sessionStorage.bookingData` 与 `sessionStorage.seatData` 合并出 `persons` 数组；计算总价 `unitPrice*persons.length`，生成汇总卡 `summaryCard`（含总价、时间、影厅、人数、展开按钮）并插入；再生成隐藏的明细列表 `details`，遍历每位成员卡片并插入；最后绑定 `toggle-btn` 切换展开/收起状态
  3. **返回首页**：同上

#### 使用说明

- 团体选座完成后跳转此页，自动渲染汇总与明细
- 点击"展开"可查看每位成员详情，按钮文本在"展开"↔"收起"间切换
- 点击返回回首页

## 四、技术亮点

1. **扇形座位布局**：通过Canvas精确绘制，模拟真实影院体验
2. **智能选座算法**：根据不同购票人信息，及电影院空余座位，自动推荐最佳座位
3. **状态管理**：通过sessionStorage和localStorage实现跨页面数据传递
4. **模块化架构**：各功能模块独立开发，便于维护和扩展

## 五、系统数据流

详细系统数据流如下图所示，主要包括：

**状态管理模式**：
* 采用集中式状态管理，将座位、用户、订单数据统一管理，确保数据一致性 

**本地存储方案**：
* 使用localStorage持久化订单和座位Json数据
* 使用sessionStorage管理会话状态，实现无后端的完整购票流程

![80eeb3403c97649ceee4fc7463e8a8d](../Documents/WeChat Files/wxid_oizbyir2mo0j52/FileStorage/Temp/80eeb3403c97649ceee4fc7463e8a8d.png)


## 六、系统工作流

详细系统工作流如下图所示，主要包括：

**购票入口**：
* 选择个人或团体购票模式，填写购票人信息
* 根据年龄自动分类儿童、成人与老年票

**智能选座**：
* 扇形影厅实时展示座位状态
* 手动选座：点击座位单选或ctrl长按多选
* 自动选座：评估算法选取最优座位

**订单处理与管理**：
* 预定与直接支付购票
* 查看所有订单状态：待支付、已出票、已退票、已取消
* 支持退票和取消操作，自动释放座位资源

![cce717a7c2406470a5f70a4f733ce0a](../Documents/WeChat Files/wxid_oizbyir2mo0j52/FileStorage/Temp/cce717a7c2406470a5f70a4f733ce0a.png)

## 七、总结

**CINEMATIX电影选座系统**通过模块化设计和精心的用户体验优化，实现了完整的电影购票流程。影厅采用Canvas技术绘制，支持独立调配影厅大小，视觉效果优秀。各模块间通过统一的数据格式和存储方案实现无缝对接，为用户提供了便捷、直观的购票体验。

