# EpicVibe - AI-Driven Solana Chain Game Creation Platform

![EpicVibe Logo](Logo.png)

EpicVibe是一个基于Solana区块链的创作者平台，它利用AI驱动的游戏创建编辑器，使非技术用户能够通过自然语言描述生成可玩的链游戏。

## 项目概览

EpicVibe 是一个 Web3 创作者平台，专注于通过人工智能驱动的游戏创建编辑器，使非技术用户能够通过自然语言描述（例如，"我想要一个复古合成波赛博朋克赛车游戏"）生成可玩的2D或3D链游戏。这些游戏直接转化为 Solana 链游戏，通过 EpicVibe 创作者平台，可通过浏览器播放并在社区内共享。

平台支持多种游戏类型（赛车、冒险、拼图、角色扮演、节奏等），并允许深度定制角色、地图和游戏机制。EpicVibe 不提供游戏，而是赋予创作者生成链游戏的能力，并根据其创作的受欢迎程度和社区贡献奖励 $EPIC 代币。

## 核心功能

### AI驱动的创作赋能
- 非技术用户通过自然语言生成链游戏，AI处理代码、艺术和机制
- 支持多种游戏类型和时尚风格（赛博朋克、复古合成波等）

### 去中心化创意生态系统
- 游戏转化为Solana链游戏，玩家可以玩和分享
- 创作者通过社区反馈和推广获得奖励

### $EPIC代币激励
- 创作者通过创作、分享和社区参与赚取$EPIC
- 玩家通过游戏和推广赚取代币，回购机制支持奖励池

### 实时社区协作
- 全频道聊天系统促进创作者与玩家互动
- 共享创意和作品，提升社区活力

### Solana技术优势
- Solana的高吞吐量（每秒数千交易）和低费用（约$0.00025/交易）
- 确保游戏生成、部署和游戏过程快速流畅

## 技术架构

### 前端
- React/Next.js构建的现代界面
- Three.js用于3D游戏预览
- Phantom钱包集成

### 后端
- Node.js/Express后端API
- Socket.IO用于实时通信
- OpenAI集成用于游戏生成

### 区块链
- Solana区块链
- $EPIC SPL代币
- 智能合约用于代币分配和治理

### 数据存储
- MongoDB用于用户和游戏数据
- Arweave用于去中心化游戏存储

## 安装与设置

### 预安装要求
- Node.js v16+
- npm 或 yarn
- Solana CLI (可选，用于部署)

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/yourusername/epicvibe.git
cd epicvibe

# 安装依赖
npm install

# 设置环境变量
cp .env.example .env
# 编辑.env文件设置必要参数

# 开发模式启动
npm run dev

# 生产模式构建
npm run build
npm start
```

### 智能合约部署
```bash
# 在Solana devnet上部署$EPIC代币
npm run solana:deploy
```

## 功能演示

1. **游戏创作** - 输入自然语言描述，选择游戏类型和风格，AI生成完整游戏
2. **链上存储** - 生成的游戏自动部署到Solana网络
3. **代币奖励** - 创作者和玩家通过参与获得$EPIC代币
4. **社区互动** - 玩家可以玩、点赞和分享游戏，促进生态系统增长

## 项目结构

```
epicvibe/
├── client/             # 前端代码
├── server/             # 后端API和服务
│   ├── controllers/    # API控制器
│   ├── data/           # 数据和模板
│   ├── middlewares/    # 中间件
│   ├── routes/         # API路由
│   ├── services/       # 业务逻辑服务
│   └── index.js        # 服务器入口
├── contracts/          # Solana智能合约
├── scripts/            # 实用脚本
├── .env.example        # 环境变量示例
├── package.json        # 项目配置
└── README.md           # 项目文档
```

## API文档

### 游戏API

- `GET /api/games` - 获取游戏列表
- `GET /api/games/:id` - 获取单个游戏
- `POST /api/games/generate` - 生成新游戏
- `POST /api/games` - 保存游戏到区块链
- `PUT /api/games/:id` - 更新游戏元数据
- `DELETE /api/games/:id` - 删除游戏
- `POST /api/games/:id/play` - 记录游戏游玩并奖励代币
- `POST /api/games/:id/like` - 点赞游戏并奖励创作者
- `POST /api/games/:id/share` - 分享游戏获取奖励

### 代币API

- `GET /api/tokens/balance` - 获取用户代币余额
- `GET /api/tokens/transactions` - 获取交易历史
- `POST /api/tokens/purchase` - 使用代币购买物品

## 代币经济

$EPIC代币是EpicVibe生态系统的核心，激励创作者和玩家参与。代币总供应量为1亿枚，采用Pump.fun公平发行。

### 代币分配

- **创作者奖励池**: 40%
- **游戏玩家奖励**: 20%
- **生态系统发展**: 15%
- **团队**: 15%
- **早期投资者**: 10%

### 代币用途

- **创建奖励**: 创作者发布游戏获得奖励
- **游玩奖励**: 玩家游玩游戏获得小额奖励
- **治理权**: 代币持有者可参与投票决定平台方向
- **高级功能**: 解锁高级AI功能和独家内容

## 路线图

- **2025 Q2**: 项目启动，开发AI编辑器和聊天功能
- **2025 Q3**: 测试阶段，部署Solana测试网，举办beta创作挑战
- **2025 Q4**: 主网上线，发起$EPIC公平发行，举办"Vibe创作节"
- **2026 Q1**: 生态扩展，添加新的AI艺术风格和游戏类型
- **2026 Q2**: 持续创新，支持复杂3D游戏和多人游戏机制

## 贡献

欢迎贡献和提出建议！请Fork仓库并提交Pull Request。

## 许可证

本项目采用MIT许可证。详见[LICENSE](LICENSE)文件。

## 联系我们

- 网站: [epicvibe.io](https://epicvibe.io)
- Twitter: [@EpicVibeIO](https://twitter.com/EpicVibeIO)
- Discord: [EpicVibe社区](https://discord.gg/epicvibe)

---

*EpicVibe - 释放你的创意，放飞Web3游戏的未来* 