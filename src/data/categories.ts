export interface CategoryDef {
  slug: string;
  name: string;
  slogan: string;
  group: string;
}

// 来自 DummyJSON 的分类 slug，附加中文展示名和分组
export const categoryDefs: CategoryDef[] = [
  { slug: "smartphones", name: "智能手机", slogan: "屏幕上的世界", group: "数码" },
  { slug: "laptops", name: "笔记本电脑", slogan: "随身的生产力", group: "数码" },
  { slug: "tablets", name: "平板", slogan: "更大的屏幕也更轻", group: "数码" },
  { slug: "mobile-accessories", name: "手机配件", slogan: "细节也讲究", group: "数码" },
  { slug: "mens-shirts", name: "男士衬衫", slogan: "得体的日常", group: "服饰" },
  { slug: "mens-shoes", name: "男鞋", slogan: "每一步都重要", group: "服饰" },
  { slug: "mens-watches", name: "男士腕表", slogan: "时间的分量", group: "服饰" },
  { slug: "tops", name: "女士上衣", slogan: "衣橱里那一件", group: "服饰" },
  { slug: "womens-dresses", name: "连衣裙", slogan: "迎接每一个场合", group: "服饰" },
  { slug: "womens-shoes", name: "女鞋", slogan: "舒适与设计兼得", group: "服饰" },
  { slug: "womens-watches", name: "女士腕表", slogan: "腕上的优雅", group: "服饰" },
  { slug: "womens-bags", name: "女士包袋", slogan: "出门的好搭子", group: "服饰" },
  { slug: "womens-jewellery", name: "女士首饰", slogan: "闪耀的点缀", group: "服饰" },
  { slug: "sunglasses", name: "墨镜", slogan: "阳光下的风格", group: "服饰" },
  { slug: "beauty", name: "美妆", slogan: "今日好状态", group: "美妆" },
  { slug: "fragrances", name: "香水", slogan: "气味是一种态度", group: "美妆" },
  { slug: "skin-care", name: "护肤", slogan: "对自己好一点", group: "美妆" },
  { slug: "furniture", name: "家具", slogan: "为生活留一处舒适", group: "家居" },
  { slug: "home-decoration", name: "家居装饰", slogan: "把空间装进想象", group: "家居" },
  { slug: "kitchen-accessories", name: "厨房好物", slogan: "做饭也是热爱", group: "家居" },
  { slug: "groceries", name: "食品杂货", slogan: "厨房里的烟火", group: "美食" },
  { slug: "sports-accessories", name: "运动装备", slogan: "动起来就好", group: "运动" },
  { slug: "motorcycle", name: "摩托车", slogan: "公路与风", group: "户外" },
  { slug: "vehicle", name: "汽车周边", slogan: "出行更自由", group: "户外" },
];

// 首页/导航上展示的精选分类
export const featuredCategories: CategoryDef[] = [
  categoryDefs.find((c) => c.slug === "smartphones")!,
  categoryDefs.find((c) => c.slug === "laptops")!,
  categoryDefs.find((c) => c.slug === "womens-dresses")!,
  categoryDefs.find((c) => c.slug === "mens-watches")!,
  categoryDefs.find((c) => c.slug === "beauty")!,
  categoryDefs.find((c) => c.slug === "fragrances")!,
  categoryDefs.find((c) => c.slug === "furniture")!,
  categoryDefs.find((c) => c.slug === "groceries")!,
];

// Header 上的简化导航
export const navCategories: { slug: string; label: string }[] = [
  { slug: "smartphones", label: "手机数码" },
  { slug: "laptops", label: "笔记本" },
  { slug: "womens-dresses", label: "女装" },
  { slug: "mens-shirts", label: "男装" },
  { slug: "mens-shoes", label: "鞋靴" },
  { slug: "beauty", label: "美妆" },
  { slug: "fragrances", label: "香水" },
  { slug: "skin-care", label: "护肤" },
  { slug: "furniture", label: "家具" },
  { slug: "groceries", label: "食品" },
  { slug: "sports-accessories", label: "运动" },
  { slug: "mens-watches", label: "腕表" },
  { slug: "womens-bags", label: "女包" },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return categoryDefs.find((c) => c.slug === slug);
}
