// 商品中文化字典：将 DummyJSON 英文字段翻译为中文展示
// 数据源是 DummyJSON 公开接口，仅 mock 性质，因此我们用确定性字典将英文映射为中文，
// 客观字段（图片、价格、库存、SKU、尺寸、评分）依旧使用 API 真实值。

// ---------- 品牌中文化 ----------
const brandMap: Record<string, string> = {
  Essence: "悦诗 Essence",
  Glamour: "格莱姆",
  Velvet: "丝绒挚爱",
  Chic: "雅集",
  Nail: "美甲坊",
  Calvin: "Calvin Klein",
  "Calvin Klein": "Calvin Klein",
  Chanel: "香奈儿 Chanel",
  Dior: "迪奥 Dior",
  Dolce: "杜嘉班纳",
  Gucci: "古驰 Gucci",
  Annibale: "Annibale Colombo",
  Knoll: "Knoll 诺尔",
  Wooden: "木匠手作",
  "Asian Paints": "亚洲漆",
  Bath: "悠然浴室",
  Fog: "雾境家居",
  House: "家舍",
  Decor: "饰家",
  Apple: "Apple 苹果",
  Asus: "华硕 Asus",
  Huawei: "华为 Huawei",
  Lenovo: "联想 Lenovo",
  Dell: "戴尔 Dell",
  Samsung: "三星 Samsung",
  OPPO: "OPPO",
  Vivo: "Vivo",
  Realme: "Realme",
  Sony: "索尼 Sony",
  Microsoft: "微软 Microsoft",
  Nike: "耐克 Nike",
  Puma: "彪马 Puma",
  Adidas: "阿迪达斯",
  Reebok: "锐步 Reebok",
  Rolex: "劳力士 Rolex",
  Longines: "浪琴 Longines",
  Tissot: "天梭 Tissot",
  Cartier: "卡地亚 Cartier",
  Casio: "卡西欧 Casio",
  Amazon: "Amazon",
  Yamaha: "雅马哈 Yamaha",
  Honda: "本田 Honda",
  Suzuki: "铃木 Suzuki",
  Kawasaki: "川崎 Kawasaki",
  Ducati: "杜卡迪 Ducati",
  Mercedes: "梅赛德斯-奔驰",
  BMW: "宝马 BMW",
  Audi: "奥迪 Audi",
  Volkswagen: "大众",
  Ford: "福特 Ford",
  Toyota: "丰田 Toyota",
};

export function localizeBrand(brand?: string): string {
  if (!brand) return "官方品牌";
  if (brandMap[brand]) return brandMap[brand];
  // 部分匹配
  for (const key of Object.keys(brandMap)) {
    if (brand.toLowerCase().includes(key.toLowerCase())) return brandMap[key];
  }
  return brand;
}

// ---------- 商品标题：每个 SKU 用 sku + slug 哈希挑一个稳定的中文模板 ----------
type TitleBag = {
  prefix: string[];
  body: string[];
  suffix: string[];
};

const titleBags: Record<string, TitleBag> = {
  beauty: {
    prefix: ["甄选", "高定", "丝绒", "柔光", "经典", "新款"],
    body: ["睫毛膏", "口红", "眼影盘", "粉饼", "眼线笔", "腮红", "指甲油", "卸妆水", "粉底液"],
    suffix: ["持妆 12h", "防水显色", "丝缎光泽", "天然成分", "敏感肌可用", "礼盒装"],
  },
  fragrances: {
    prefix: ["经典", "馥郁", "栀子", "茉莉", "雪松", "海岸"],
    body: ["香水", "淡香水", "古龙水", "香氛", "香氛喷雾"],
    suffix: ["100ml", "50ml 礼盒", "中性香", "木质调", "花果调", "东方木质"],
  },
  furniture: {
    prefix: ["北欧", "意式", "现代", "复古", "实木", "极简"],
    body: ["双人床", "三人布艺沙发", "床头柜", "餐桌", "书桌", "办公椅", "茶几", "衣柜"],
    suffix: ["原木色", "胡桃木质感", "可拆洗", "送货上门安装", "环保 E0 板材", "高承重"],
  },
  groceries: {
    prefix: ["精选", "新鲜", "进口", "有机", "农场", "山区"],
    body: ["苹果", "牛排", "猫粮", "鸡胸肉", "食用油", "黄瓜", "狗粮", "鲜鸡蛋", "鱼排", "蜂蜜", "酸奶", "意面"],
    suffix: ["500g", "1kg 装", "顺丰冷链", "原产地直发", "无添加", "天然纯净"],
  },
  "home-decoration": {
    prefix: ["北欧", "ins 风", "复古", "侘寂", "现代"],
    body: ["装饰画", "落地灯", "陶瓷花瓶", "香薰蜡烛", "挂钟", "地毯", "抱枕", "装饰摆件"],
    suffix: ["手作工艺", "进口面料", "适合客厅", "适合卧室", "原创设计"],
  },
  "kitchen-accessories": {
    prefix: ["不锈钢", "进口", "日式", "厨房精选", "经典"],
    body: ["奶锅", "炒菜锅", "刀具套装", "砧板", "调味瓶", "保鲜盒", "电热水壶", "咖啡杯"],
    suffix: ["304 食品级", "原装进口", "送收纳袋", "易清洗"],
  },
  laptops: {
    prefix: ["轻薄", "高性能", "全能", "便携", "商务", "学生"],
    body: ["笔记本电脑", "超极本", "游戏本", "二合一笔记本"],
    suffix: ["14 英寸", "16GB+512GB", "i7 处理器", "M2 芯片", "OLED 屏", "护眼屏"],
  },
  "mens-shirts": {
    prefix: ["商务", "纯棉", "休闲", "经典", "修身", "宽松"],
    body: ["男士长袖衬衫", "短袖衬衫", "牛津纺衬衫", "亚麻衬衫", "polo 衫"],
    suffix: ["免烫", "透气", "M-XXL", "标准版型", "通勤百搭"],
  },
  "mens-shoes": {
    prefix: ["经典", "运动", "复古", "潮流", "商务"],
    body: ["跑鞋", "板鞋", "皮鞋", "靴子", "篮球鞋", "休闲鞋"],
    suffix: ["真皮鞋面", "缓震大底", "38-44 码", "防滑", "透气网面"],
  },
  "mens-watches": {
    prefix: ["经典", "瑞士", "机械", "商务", "潮流", "复古"],
    body: ["男士腕表", "机械表", "石英表", "智能手表", "运动手表"],
    suffix: ["蓝宝石镜面", "316L 不锈钢", "5ATM 防水", "礼盒装", "原装机芯"],
  },
  "mobile-accessories": {
    prefix: ["原装", "便携", "高品质", "通用"],
    body: ["充电线", "保护壳", "钢化膜", "充电宝", "无线充电器", "数据线", "蓝牙耳机", "手机支架"],
    suffix: ["快充", "亲肤手感", "防摔", "Type-C"],
  },
  motorcycle: {
    prefix: ["重型", "复古", "运动", "巡航", "踏板"],
    body: ["摩托车", "踏板车", "巡航车", "街车", "复古机车"],
    suffix: ["原装进口", "正规上牌", "整车质保", "新车现货"],
  },
  "skin-care": {
    prefix: ["焕颜", "保湿", "舒缓", "净透", "提亮"],
    body: ["精华液", "面霜", "面膜", "爽肤水", "洁面乳", "防晒霜", "眼霜", "身体乳"],
    suffix: ["敏感肌可用", "纯净配方", "礼盒装", "明星单品", "孕妇可用"],
  },
  smartphones: {
    prefix: ["新款", "全网通", "高性能", "旗舰", "学生", "商务"],
    body: ["智能手机", "5G 手机", "拍照手机", "折叠屏手机"],
    suffix: ["12+256GB", "1 亿像素", "5000mAh", "120Hz 高刷", "原封正品"],
  },
  "sports-accessories": {
    prefix: ["专业", "户外", "运动", "健身房"],
    body: ["瑜伽垫", "哑铃", "弹力带", "网球拍", "羽毛球拍", "运动水壶", "护腕", "跳绳"],
    suffix: ["TPE 环保", "送收纳袋", "防滑耐磨", "新手友好"],
  },
  sunglasses: {
    prefix: ["复古", "潮流", "时尚", "驾驶", "防紫外线"],
    body: ["太阳镜", "墨镜", "偏光太阳镜", "近视太阳镜"],
    suffix: ["UV400", "尼龙镜片", "TR90 镜架", "送原装镜盒", "明星同款"],
  },
  tablets: {
    prefix: ["高性能", "学生", "便携", "全能"],
    body: ["平板电脑", "学习平板", "绘画平板", "二合一平板"],
    suffix: ["10.4 英寸", "护眼屏", "送原装笔", "256GB", "全网通版"],
  },
  tops: {
    prefix: ["小香风", "法式", "复古", "通勤", "甜美", "简约"],
    body: ["女士上衣", "雪纺衫", "针织衫", "卫衣", "T 恤", "衬衫", "短袖"],
    suffix: ["显瘦", "宽松版型", "S-XL", "夏季新款", "百搭"],
  },
  vehicle: {
    prefix: ["新能源", "经典", "豪华", "家用", "都市"],
    body: ["轿车", "SUV", "MPV", "纯电动汽车", "插混 SUV"],
    suffix: ["全国联保", "送 5 年保养", "现车现订", "高配版"],
  },
  "womens-bags": {
    prefix: ["复古", "通勤", "ins 风", "百搭", "高级感"],
    body: ["手提包", "斜挎包", "托特包", "腋下包", "迷你包", "妈咪包"],
    suffix: ["头层牛皮", "进口面料", "送防尘袋", "可拆肩带"],
  },
  "womens-dresses": {
    prefix: ["法式", "茶歇", "通勤", "度假", "复古", "甜美"],
    body: ["连衣裙", "针织连衣裙", "雪纺连衣裙", "衬衫裙", "吊带裙"],
    suffix: ["显瘦版型", "新款", "S-XL", "夏季", "气质优雅"],
  },
  "womens-jewellery": {
    prefix: ["18K", "925 银", "复古", "轻奢"],
    body: ["项链", "耳钉", "手镯", "戒指", "套链", "脚链"],
    suffix: ["送礼盒", "天然珍珠", "锆石镶嵌", "可调节"],
  },
  "womens-shoes": {
    prefix: ["小香风", "高跟", "运动", "复古", "玛丽珍"],
    body: ["女士单鞋", "高跟鞋", "运动鞋", "凉鞋", "靴子", "乐福鞋"],
    suffix: ["真皮", "防滑", "35-40 码", "送鞋撑", "舒适久站"],
  },
  "womens-watches": {
    prefix: ["轻奢", "复古", "石英", "时尚"],
    body: ["女士腕表", "石英表", "智能手表", "陶瓷表"],
    suffix: ["蓝宝石镜面", "玫瑰金边框", "送原装表盒", "时尚配饰"],
  },
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length];
}

export function localizeTitle(rawTitle: string, category: string, sku: string): string {
  const bag = titleBags[category];
  if (!bag) return rawTitle;
  const seed = hash(sku || rawTitle);
  return `${pick(bag.prefix, seed, 0)} ${pick(bag.body, seed, 7)} · ${pick(bag.suffix, seed, 13)}`;
}

// ---------- 商品描述（多段） ----------
const descriptionTemplates: Record<string, string[][]> = {
  beauty: [
    [
      "精选高端原料，丝滑顺滑、显色持久。",
      "持妆超过 12 小时，不易脱妆不卡纹，适合日常通勤与重要场合。",
      "经多重过敏测试，敏感肌可用，温和呵护肌肤。",
    ],
    [
      "采用品牌经典配方，触肤柔滑、上色一抹即显。",
      "搭配自带刷头/海绵，新手也能轻松驾驭。",
      "包装精致，自用送礼皆宜。",
    ],
  ],
  fragrances: [
    [
      "前调清新通透，中调馥郁层次丰富，尾调温暖留香持久。",
      "经典调香师配方，留香时间可达 6-8 小时。",
      "适合日常、约会、礼物等多种场景，男女皆宜。",
    ],
    [
      "瓶身设计灵感来自地中海风物，简约高级，摆在梳妆台上就是装饰品。",
      "采用法国进口香精，避免酒精刺激，敏感肌也可使用。",
    ],
  ],
  furniture: [
    [
      "采用进口实木+环保面料，承重稳固耐久。",
      "工厂直供，省去中间溢价，性价比突出。",
      "支持送货上门并提供专业安装服务。",
    ],
    [
      "设计师手稿源自米兰家具展，曲线流畅、坐感舒适。",
      "选用 E0 级板材，甲醛释放量低于国标，呵护家人健康。",
    ],
  ],
  groceries: [
    [
      "源自产地直采，新鲜采摘后即时冷链运输。",
      "未添加防腐剂、未经辐照，让你吃得安心。",
      "下单后 24 小时内发货，顺丰生鲜直达。",
    ],
    [
      "通过 SGS / 国家食品安全检测，品质有保证。",
      "用于煎、炒、烹、炸都很合适，是厨房常备好食材。",
    ],
  ],
  "home-decoration": [
    [
      "手作工艺，每件都略有差异，独一无二。",
      "选材天然，与北欧/侘寂/ins 风家居搭配相得益彰。",
      "送原装包装，开箱即可使用或赠送。",
    ],
  ],
  "kitchen-accessories": [
    [
      "304 食品级不锈钢/进口陶瓷材质，安全耐用。",
      "符合人体工学的握感，使用更顺手。",
      "可机洗、不串味，是新家入伙的实用之选。",
    ],
  ],
  laptops: [
    [
      "搭载最新一代旗舰处理器，办公娱乐一气呵成。",
      "16GB 大内存 + 512GB 高速固态，多任务流畅切换。",
      "金属机身轻薄便携，长续航伴你出差通勤。",
    ],
    [
      "采用低蓝光护眼屏，长时间使用也不易疲劳。",
      "全功能 Type-C 接口，连接外设无需扩展坞。",
    ],
  ],
  "mens-shirts": [
    [
      "100% 精梳棉面料，亲肤透气，越穿越柔软。",
      "标准版型，修饰身形不挑人，商务与休闲皆宜。",
      "进口免烫工艺，无需熨烫即可上身。",
    ],
  ],
  "mens-shoes": [
    [
      "鞋面采用进口头层牛皮/工程网布，柔软贴脚。",
      "EVA 缓震大底，长时间行走也不易疲劳。",
      "鞋楦经多次试穿调整，更符合亚洲人脚型。",
    ],
  ],
  "mens-watches": [
    [
      "原装瑞士机芯，走时精准，每日误差小于 ±15 秒。",
      "蓝宝石水晶镜面耐磨抗刮，搭配 316L 精钢表带。",
      "5ATM 生活防水，日常佩戴无忧。",
    ],
  ],
  "mobile-accessories": [
    [
      "适配主流机型，支持快充协议。",
      "采用 TPU/PC 双层材质，柔韧抗摔、贴合手感。",
      "工厂直发，正品保证。",
    ],
  ],
  motorcycle: [
    [
      "全新原装进口车型，整车 2 年质保。",
      "排量充足、操控灵敏，公路与山道兼顾。",
      "正规渠道，提供合格证、发票、保险一站式服务。",
    ],
  ],
  "skin-care": [
    [
      "蕴含多重植萃精华，温和呵护肌肤屏障。",
      "经皮肤科医生测试，敏感肌、孕产期皆可使用。",
      "建议早晚使用，配合按摩手法效果更佳。",
    ],
  ],
  smartphones: [
    [
      "搭载旗舰级芯片，性能强劲，畅玩主流游戏。",
      "1 亿像素主摄 + 超广角，记录生活每一个瞬间。",
      "5000mAh 大电池 + 67W 快充，30 分钟充满 80%。",
    ],
    [
      "全新 OLED 屏，120Hz 高刷新率丝滑流畅。",
      "金属中框 + 玻璃后盖，手感扎实质感出众。",
    ],
  ],
  "sports-accessories": [
    [
      "TPE 环保材料，无异味、回弹好、防滑耐磨。",
      "厚度适中，关节有足够缓冲。",
      "标配收纳带，便于携带与存放。",
    ],
  ],
  sunglasses: [
    [
      "UV400 镜片有效阻隔紫外线，呵护眼部健康。",
      "TR90 鬼记忆镜架轻盈不易变形。",
      "镜腿弹性设计，长时间佩戴依旧舒适。",
    ],
  ],
  tablets: [
    [
      "10 英寸视网膜级显示屏，色彩鲜艳细腻。",
      "支持触控笔与键盘配件，办公学习两不误。",
      "全天候续航，外出一整天也无需充电。",
    ],
  ],
  tops: [
    [
      "进口面料，垂感与透气兼具。",
      "宽松版型，遮肉显瘦，多种尺码可选。",
      "细节精致，适合日常与轻正式场合。",
    ],
  ],
  vehicle: [
    [
      "原厂正品，提供完整合格证与发票。",
      "全国联保 5 年/10 万公里，三电终身质保（电动版本）。",
      "支持试驾，门店专业销售一对一服务。",
    ],
  ],
  "womens-bags": [
    [
      "头层牛皮 / 进口面料，质感细腻不易变形。",
      "容量充足，可放下手机、卡包、化妆品等日常物品。",
      "肩带可调节、可拆卸，单肩斜挎两用。",
    ],
  ],
  "womens-dresses": [
    [
      "进口面料，亲肤垂顺，自然有型。",
      "经典版型，显瘦显高，适合多种身形。",
      "搭配项链、单鞋皆为出片利器。",
    ],
  ],
  "womens-jewellery": [
    [
      "925 银/18K 金材质，电镀工艺，不易过敏。",
      "经典款式，搭配任何穿搭都点睛。",
      "精致礼盒包装，送闺蜜/送另一半都合适。",
    ],
  ],
  "womens-shoes": [
    [
      "鞋面柔软贴合，鞋跟稳固有弹性。",
      "采用 TPR 防滑大底，雨雪天气更安全。",
      "经多版试穿调整鞋楦，久穿不磨脚。",
    ],
  ],
  "womens-watches": [
    [
      "蓝宝石镜面 + 进口机芯，走时精准。",
      "玫瑰金/陶瓷材质，时尚保值。",
      "5ATM 生活防水，日常佩戴无忧。",
    ],
  ],
};

export function localizeDescription(category: string, sku: string, fallback: string): string[] {
  const list = descriptionTemplates[category];
  if (!list || list.length === 0) return [fallback];
  const seed = hash(sku);
  return list[seed % list.length];
}

// ---------- 评论本地化 ----------
const reviewerNames = [
  "李雨晴", "王浩宇", "陈思琪", "刘梓涵", "张俊辰", "周诗雨", "黄一鸣", "吴佳宁",
  "徐子墨", "孙雅婷", "胡若曦", "朱明轩", "高晨曦", "林沐阳", "何嘉怡", "罗安然",
  "梁泽宇", "宋雨欣", "韩天昊", "唐婉清", "冯子轩", "邓静好", "曹靖远", "彭书瑶",
];

const reviewCommentMap: Array<{ match: RegExp; copy: string[] }> = [
  { match: /not\s*recommend|disappoint|terrible|bad|poor|awful/i, copy: [
    "和我预期有些差距，下次再观望一下。",
    "做工一般，不太适合我，可能我比较挑剔。",
    "用了一段时间感觉效果普通，要求高的慎入。",
  ]},
  { match: /satisfied|good|nice|like|happy|love/i, copy: [
    "整体挺满意的，做工和描述一致，回购！",
    "用下来感觉不错，值得这个价位，推荐。",
    "比想象中好，包装也很用心，给好评。",
  ]},
  { match: /highly|impressed|amazing|excellent|perfect|fantastic|wow/i, copy: [
    "惊喜！比同价位的好太多，强烈推荐！",
    "太喜欢了！朋友看到也说要买，再来一件！",
    "细节做得很到位，超出预期，已经回购第二次。",
  ]},
  { match: /average|ok|okay|fine|just/i, copy: [
    "中规中矩，没有太突出的地方，但也挑不出毛病。",
    "OK 的水平，平价款里算不错。",
    "整体可以，但缺少一点惊喜感。",
  ]},
];

const reviewFallback = [
  "收到了，整体满意，会再来回购。",
  "和图片描述基本一致，性价比可以。",
  "买了好几次了，依旧靠谱。",
  "包装严实，物流也快，体验不错。",
  "送朋友的，对方非常喜欢。",
];

export function localizeReviewerName(seedStr: string): string {
  return reviewerNames[hash(seedStr) % reviewerNames.length];
}

export function localizeReviewComment(rawComment: string, seedStr: string): string {
  for (const entry of reviewCommentMap) {
    if (entry.match.test(rawComment)) {
      return entry.copy[hash(seedStr) % entry.copy.length];
    }
  }
  return reviewFallback[hash(seedStr) % reviewFallback.length];
}

// ---------- 物流 / 保修 / 退货政策 / 库存状态 ----------
export function localizeShipping(raw?: string): string {
  if (!raw) return "顺丰包邮 · 48 小时内发货";
  const m = raw.match(/(\d+)[-–](\d+)/);
  if (/overnight/i.test(raw)) return "次日送达";
  if (/same\s*day/i.test(raw)) return "当日送达";
  if (m) return `${m[1]}-${m[2]} 个工作日内送达`;
  const m2 = raw.match(/(\d+)\s*(business\s*day|day)/i);
  if (m2) return `${m2[1]} 个工作日内送达`;
  return "顺丰包邮 · 48 小时内发货";
}

export function localizeWarranty(raw?: string): string {
  if (!raw) return "官方保修 1 年";
  if (/lifetime/i.test(raw)) return "终身保修";
  const m = raw.match(/(\d+)\s*month/i);
  if (m) return `官方保修 ${m[1]} 个月`;
  const y = raw.match(/(\d+)\s*year/i);
  if (y) return `官方保修 ${y[1]} 年`;
  const w = raw.match(/(\d+)\s*week/i);
  if (w) return `保修期 ${w[1]} 周`;
  if (/no\s*warranty/i.test(raw)) return "暂无保修";
  return "官方保修 1 年";
}

export function localizeReturn(raw?: string): string {
  if (!raw) return "支持 7 天无理由退换";
  if (/no\s*return/i.test(raw)) return "本商品不支持退货";
  const m = raw.match(/(\d+)\s*day/i);
  if (m) return `支持 ${m[1]} 天无理由退换`;
  return "支持 7 天无理由退换";
}

export function localizeAvailability(raw?: string, stock = 0): string {
  if (!raw) return stock > 0 ? "有货" : "缺货";
  if (/in\s*stock/i.test(raw)) return "现货充足";
  if (/low\s*stock/i.test(raw)) return "库存紧张";
  if (/out\s*of\s*stock|no\s*stock/i.test(raw)) return "暂时缺货";
  return stock > 0 ? "有货" : "缺货";
}

// ---------- 分类标签 ----------
const tagMap: Record<string, string> = {
  beauty: "美妆", mascara: "睫毛膏", lipstick: "口红", eyeshadow: "眼影",
  fragrances: "香水", perfume: "香水",
  furniture: "家具", bed: "床品", sofa: "沙发", chair: "座椅", table: "桌子",
  groceries: "食品", fruits: "水果", vegetables: "蔬菜", meat: "肉类",
  dairy: "乳制品", seafood: "海鲜", "pet supplies": "宠物用品", "cooking essentials": "厨房调味",
  "home-decoration": "家居", "home decoration": "家居",
  "kitchen-accessories": "厨房", laptops: "笔记本", "mens-shirts": "男装",
  "mens-shoes": "男鞋", "mens-watches": "男表", "mobile-accessories": "手机配件",
  motorcycle: "摩托车", "skin-care": "护肤", smartphones: "手机",
  "sports-accessories": "运动", sunglasses: "墨镜", tablets: "平板",
  tops: "女装上衣", vehicle: "车辆", "womens-bags": "女包",
  "womens-dresses": "连衣裙", "womens-jewellery": "首饰",
  "womens-shoes": "女鞋", "womens-watches": "女表",
};

export function localizeTag(raw: string): string {
  const lower = raw.toLowerCase();
  if (tagMap[lower]) return tagMap[lower];
  return raw;
}
