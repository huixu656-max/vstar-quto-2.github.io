(function () {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const topNavItems = [
    ["Explore Vehicles", "vehicles.html"],
    ["Track Logistics", "port-logistics.html"],
    ["Find Us", "contact.html#location"],
  ];
  const navGroups = [
    {
      label: "Vehicles",
      href: "vehicles.html",
      links: [
        ["Vehicle Center", "vehicles.html"],
      ],
    },
    {
      label: "Export Services",
      href: "services.html",
      links: [
        ["Service Process", "services.html"],
        ["Compliance Export", "services.html"],
        ["Logistics Tracking", "port-logistics.html"],
      ],
    },
    {
      label: "About V-Star",
      href: "about.html",
      links: [
        ["Company Overview", "about.html"],
        ["Credentials", "index.html#credentials"],
        ["Bases and Ports", "about.html"],
      ],
    },
    {
      label: "News",
      href: "news.html",
      links: [
        ["Company News", "news.html"],
        ["Events and Visits", "news.html"],
        ["Delivery Updates", "news.html"],
      ],
    },
  ];
  const sidebarSections = [
    {
      title: "Vehicles",
      feature: ["All Vehicles", "vehicles.html"],
      links: [
        ["Procurement Process", "services.html"],
      ],
    },
    {
      title: "Sourcing",
      feature: ["Port Logistics", "port-logistics.html"],
      links: [],
    },
    {
      title: "Services",
      feature: ["Service Support", "services.html"],
      links: [
        ["After-sales Support", "after-sales.html"],
        ["Parts Support", "parts-support.html"],
        ["Warranty Coordination", "warranty-coordination.html"],
        ["Technical Guidance", "technical-guidance.html"],
      ],
    },
    {
      title: "Credentials",
      feature: ["Official Proof", "index.html#credentials"],
      links: [],
    },
    {
      title: "V-Star",
      feature: ["About V-Star", "about.html"],
      links: [
        ["News", "news.html"],
        ["WhatsApp", "https://wa.me/8613852965434"],
        ["Contact", "contact.html"],
      ],
    },
  ];
  const languageStorageKey = "vstar-site-language";
  const supportedLanguages = ["en", "zh", "ar"];
  const languageCopy = {
    zh: {
      "Explore Vehicles": "车型展示",
      "Track Logistics": "物流查询",
      "Find Us": "联系我们",
      "Search V-Star Auto": "搜索 V-Star Auto",
      "Search vehicles": "搜索车型",
      "Open search": "打开搜索",
      "Quick actions": "快捷操作",
      "Open navigation": "打开导航",
      Home: "首页",
      Vehicles: "车型",
      "Export Services": "出口服务",
      About: "关于我们",
      News: "新闻",
      "Send Inquiry": "发送询盘",
      "All Vehicles": "全部车型",
      "Procurement Process": "采购出口流程",
      Sourcing: "车源采购",
      "Port Logistics": "港口物流",
      Services: "服务",
      "Service Support": "服务支持",
      "After-sales Support": "售后支持",
      "Parts Support": "配件支持",
      "Warranty Coordination": "质保协调",
      "Technical Guidance": "技术指导",
      Credentials: "资质证书",
      "Official Proof": "官方证明",
      "V-Star": "唯星汽车",
      "About V-Star": "关于唯星",
      WhatsApp: "WhatsApp",
      Contact: "联系方式",
      Loading: "加载中",
      "Request availability": "咨询现车",
      "View details": "查看详情",
      "Open Google Maps": "打开 Google 地图",
      "Open Amap": "打开高德地图",
      "Contact on WhatsApp": "WhatsApp 联系",
      "Submit Inquiry": "提交询盘",
      Track: "查询",
      "Use demo tracking number": "使用演示单号",
      "Confirm shipment reference": "确认物流编号",
      "View process": "查看流程",
      "Search parts": "搜索配件",
      "Open agreement": "打开协议",
      "Contact technical support": "联系技术支持",
      "Certified Chinese": "中国认证",
      "Vehicle Export": "车辆出口",
      Partner: "合作伙伴",
      "Official credentials organized in one review area.": "官方资质集中展示，便于统一核验。",
      "Close to Jiangyin, Xiamen, and Pingtan ports.": "靠近江阴、厦门和平潭港口。",
      "Minhou Base": "闽侯基地",
      "Jiangyin Port": "江阴港",
      "Xiamen Port": "厦门港",
      "Pingtan Port": "平潭港",
      "Vehicle prep": "车辆准备",
      "Nearby port handover": "近港交付",
      "Island port route": "海岛港口路线",
      "South Fujian route": "闽南港口路线",
      "Illustrative port network, not a legal berth map.": "港口网络示意图，不作为法律泊位地图。",
      "Curated Chinese vehicle models for export.": "精选适合出口的中国车型。",
      "Hybrid sedan": "混动轿车",
      "Electric SUV": "纯电 SUV",
      "EREV pickup": "增程皮卡",
      "Hybrid compact sedan reference for family, business, and dealer-stock export inquiries.": "适合家庭、商务和经销商库存询盘的混动紧凑型轿车参考。",
      "Pure electric SUV option for buyers comparing comfort, range, and new-energy supply.": "面向关注舒适性、续航和新能源供应买家的纯电 SUV 选择。",
      "Extended-range pickup reference for utility, outdoor, and fleet-market sourcing discussions.": "适合工具、户外和车队市场采购讨论的增程皮卡参考。",
      "From sourcing to after-sales support.": "从车源采购到售后支持。",
      Source: "采购",
      Contract: "合同",
      Export: "出口",
      Support: "支持",
      "Visible operations, active global relationships.": "可见的运营现场，持续的全球合作。",
      "National credentials, Fujian industrial bases, and stable global vehicle sourcing.": "国家级资质、福建产业基地与稳定的全球车源供应。",
      "Physical bases and port routes support real vehicle export work.": "实体基地和港口路线支撑真实车辆出口业务。",
      "Two physical bases support vehicle sourcing, inspection, and faster port handover.": "两处实体基地支持车源采购、验车和更快的港口交付。",
      "Certified exporter": "认证出口商",
      "Fujian dual-base operation": "福建双基地运营",
      "In-yard inventory": "场内现车",
      "Port-side efficiency": "近港效率",
      "Locate the Minhou base and nearby export ports.": "定位闽侯基地和周边出口港口。",
      "A sincere and reliable partner for Chinese vehicle export.": "真诚可靠的中国汽车出口合作伙伴。",
      "Main certificates are centralized on the homepage Credentials section.": "主要证书集中在首页资质区域展示。",
      "Service advantages": "服务优势",
      "Fujian-based sourcing gives buyers practical delivery and after-sales support.": "福建车源体系为买家提供实际交付和售后支持。",
      "Customization and upgrade services are available for suitable export models.": "适合出口的车型可提供定制和升级服务。",
      "Vehicle sourcing references for confirmed export orders.": "面向确认出口订单的车型采购参考。",
      "Compare representative models, then confirm current stock, batch photos, export documents, pricing, and delivery timing by inquiry.": "先比较代表车型，再通过询盘确认现车、批次图片、出口文件、价格和交付时间。",
      "Why choose our vehicle export": "为什么选择我们的车辆出口服务",
      "Reliable supply, verified credentials, and export-ready service.": "可靠供应、已核验资质和出口就绪服务。",
      "In-stock vehicles at the base": "基地现车",
      "Hundreds of ready vehicles around the factory area support on-site viewing, inspection, and batch selection.": "厂区周边数百台现车支持现场看车、验车和批量选择。",
      "Dual national credentials": "双国家级资质",
      "MIIT automobile import and export license plus World Manufacturer Identifier certification support compliant cooperation.": "工信部汽车进出口许可和世界制造商识别码认证支持合规合作。",
      "Direct supply and parts support": "一手车源与配件支持",
      "Major-brand source access helps improve dispatch speed, vehicle cost control, and original-part support for overseas repair needs.": "主流品牌车源通道有助于提升发运速度、控制车辆成本，并支持海外维修的原厂配件需求。",
      "Global service response": "全球服务响应",
      "Multilingual after-sales support, sales media assistance, and multi-currency settlement help match different market habits.": "多语言售后支持、销售素材协助和多币种结算帮助匹配不同市场习惯。",
      "Geographic freight advantage": "地理货运优势",
      "Close access to Jiangyin, Pingtan, and Xiamen port routes helps reduce inland transfer distance and control freight cost.": "靠近江阴、平潭和厦门港口路线，有助于缩短内陆转运距离并控制货运成本。",
      "Each model page is a reference pack before live stock confirmation.": "每个车型页面都是现车确认前的参考资料包。",
      "Review model fit": "评估车型匹配",
      "Open the detail page": "打开详情页",
      "Confirm final batch": "确认最终批次",
      "Curated demand models for overseas sourcing discussion.": "面向海外采购讨论的精选需求车型。",
      "Models on the website are the starting point, not the final quotation.": "网站车型是沟通起点，不是最终报价。",
      "Tell us the model, quantity, and destination country.": "告诉我们车型、数量和目的国。",
      "Loading vehicle detail": "正在加载车型详情",
      "Core highlights": "核心亮点",
      "Key selling points from the supplied model sheet.": "从车型资料中提炼的核心卖点。",
      "Model data arranged as webpage content.": "车型资料已整理为网页内容。",
      "Key specifications": "关键参数",
      "Configuration notes": "配置说明",
      "Model banner images extracted from the supplied sheet.": "从车型资料中提取的车型展示图。",
      "Send the target model, quantity, and destination country.": "发送目标车型、数量和目的国。",
      "Controlled export process from vehicle sourcing to after-sales support.": "从车源采购到售后支持的可控出口流程。",
      "Designed for international dealers, importers, and fleet buyers who need compliant trade and reliable delivery.": "面向需要合规贸易和可靠交付的国际经销商、进口商和车队买家。",
      "Procurement and export process.": "采购与出口流程。",
      "Requirement confirmation": "需求确认",
      "Stock and specification check": "库存与配置核对",
      "Quotation and contract": "报价与合同",
      "Documentation and customs": "文件与报关",
      "Port delivery and follow-up": "港口交付与跟进",
      "Start the order": "启动订单",
      "Confirm model, quantity, destination, and timing with V-Star.": "与唯星确认车型、数量、目的地和时间。",
      "Send inquiry": "发送询盘",
      "Buyers receive concrete order materials, not only a price message.": "买家收到具体订单资料，而不只是价格信息。",
      "Vehicle photo and batch review": "车辆照片与批次核对",
      "Export paperwork preparation": "出口文件准备",
      "Fujian port route coordination": "福建港口路线协调",
      "Open logistics tracking": "打开物流查询",
      "Customization is available as a secondary service.": "定制服务可作为延伸服务提供。",
      "Support beyond the loading date.": "装船之后仍提供支持。",
      "Export after-sales workflow from first contact to case closure.": "从首次联系到结案的出口售后流程。",
      "A practical service path for exported vehicles.": "面向出口车辆的实用服务路径。",
      "Customer contact": "客户联系",
      "Case registration": "案件登记",
      "Evidence collection": "证据收集",
      "Technical triage": "技术分诊",
      "Solution confirmation": "方案确认",
      "Parts and logistics": "配件与物流",
      "Repair follow-up": "维修跟进",
      "Case closure": "案件关闭",
      "Open case": "建立案件",
      "Order file": "订单档案",
      "Proof pack": "证据包",
      "Route case": "分派案件",
      "Buyer approval": "买家确认",
      "Dispatch plan": "发运计划",
      "Result check": "结果核对",
      "Record result": "记录结果",
      "Buyer communication starts the service file.": "买家沟通会建立售后服务档案。",
      "Order records are checked before routing.": "分派前会先核对订单记录。",
      "Photos and inspection notes support review.": "照片和检查说明支持审核。",
      "Technical checks classify the support route.": "技术检查用于判断支持路径。",
      "Confirmed actions keep cost and timing clear.": "确认后的措施让费用和时间更清晰。",
      "Parts support is tied to freight and port updates.": "配件支持会结合货运和港口更新。",
      "Follow-up evidence confirms the repair result.": "跟进证据用于确认维修结果。",
      "Closed cases remain traceable for later review.": "已关闭案件仍可追溯，便于后续复盘。",
      "Complete evidence makes export after-sales faster.": "完整证据让出口售后响应更快。",
      "Start with a clear service case.": "从清晰的服务案件开始。",
      "Search common damaged-part stock for current website models.": "查询当前网站车型的常见易损件库存。",
      "Common damaged parts and reference prices.": "常见易损件与参考价格。",
      "Search model or part": "搜索车型或配件",
      "Filter by model": "按车型筛选",
      "Filter by category": "按类别筛选",
      "Parts support is handled as a controlled export order.": "配件支持按可控出口订单处理。",
      "Track vehicle export handover and port movement status.": "查询车辆出口交接和港口流转状态。",
      "Port logistics information lookup": "港口物流信息查询",
      "Enter tracking reference": "输入物流参考号",
      "Common logistics numbers": "常用物流单号",
      "Each logistics query should answer a practical order question.": "每次物流查询都应回答实际订单问题。",
      "Vehicle handover": "车辆交接",
      "Document status": "文件状态",
      "Port checkpoint": "港口节点",
      "Vessel milestone": "船期节点",
      "Designed for export orders before a full logistics API is connected.": "为完整物流 API 接入前的出口订单查询而设计。",
      "Contact V-Star technical support for exported vehicle issues.": "联系唯星技术支持处理出口车辆问题。",
      "Use WhatsApp or phone for urgent technical triage.": "紧急技术分诊请使用 WhatsApp 或电话。",
      "Prepare the technical information that makes diagnosis possible.": "准备可支持诊断的技术信息。",
      "Draft warranty terms for exported vehicle orders.": "出口车辆订单质保条款草案。",
      "Export Vehicle Warranty Coordination Agreement": "出口车辆质保协调协议",
      "Legal and commercial boundaries to confirm before signing.": "签署前需确认的法律和商业边界。",
      "Recent activities and important company events.": "近期活动和重要公司动态。",
      "Company activity shown with buyer relevance.": "以买家相关性展示公司活动。",
      "Turn activity proof into order confidence.": "将活动证明转化为订单信心。",
      "Send your target model, quantity, and destination country.": "发送您的目标车型、数量和目的国。",
      "Send a complete request and receive a more useful reply.": "发送完整需求，获得更有价值的回复。",
      "A reply should help you decide the next step.": "回复应帮助您判断下一步。",
      "Find V-Star Auto on live maps.": "在实时地图上找到唯星汽车。",
      "Use My Email to Send": "\u7528\u6211\u7684\u90ae\u7bb1\u53d1\u9001",
      "Send from your own mailbox": "\u4ece\u60a8\u81ea\u5df1\u7684\u90ae\u7bb1\u53d1\u9001",
      "The email content is ready. Choose your mailbox, sign in if needed, then send it from your account.": "\u90ae\u4ef6\u5185\u5bb9\u5df2\u51c6\u5907\u597d\u3002\u8bf7\u9009\u62e9\u90ae\u7bb1\uff0c\u5982\u9700\u767b\u5f55\uff0c\u7136\u540e\u4ece\u60a8\u7684\u8d26\u6237\u53d1\u9001\u3002",
      "Default email": "\u9ed8\u8ba4\u90ae\u7bb1",
      "Your inquiry email is ready. Choose your mailbox below, then send it from your own account.": "\u60a8\u7684\u8be2\u76d8\u90ae\u4ef6\u5df2\u51c6\u5907\u597d\u3002\u8bf7\u5728\u4e0b\u65b9\u9009\u62e9\u90ae\u7bb1\uff0c\u7136\u540e\u4ece\u60a8\u81ea\u5df1\u7684\u8d26\u6237\u53d1\u9001\u3002",
      "Back to Vehicle Center": "返回车型中心",
      "Structured parameters": "结构化参数",
      "Reference images": "参考图片",
      "Exterior Colors": "\u5916\u89c2\u989c\u8272",
      "Interior Colors": "\u5185\u9970\u989c\u8272",
      "Vehicle Center": "车型中心",
      "Company News": "公司新闻",
      "Events and Visits": "展会与来访",
      "Delivery Updates": "交付动态",
      "Company Overview": "公司概览",
      "Bases and Ports": "基地与港口",
      "Compliance Export": "合规出口",
      "Logistics Tracking": "物流跟踪",
    },
    ar: {
      "Explore Vehicles": "استكشف السيارات",
      "Track Logistics": "تتبع الشحن",
      "Find Us": "تواصل معنا",
      "Search V-Star Auto": "البحث في V-Star Auto",
      "Search vehicles": "ابحث عن السيارات",
      "Open search": "فتح البحث",
      "Quick actions": "إجراءات سريعة",
      "Open navigation": "فتح القائمة",
      Home: "الرئيسية",
      Vehicles: "السيارات",
      "Export Services": "خدمات التصدير",
      About: "عن الشركة",
      News: "الأخبار",
      "Send Inquiry": "إرسال طلب",
      "All Vehicles": "كل السيارات",
      "Procurement Process": "عملية الشراء والتصدير",
      Sourcing: "التوريد",
      "Port Logistics": "لوجستيات الميناء",
      Services: "الخدمات",
      "Service Support": "دعم الخدمة",
      "After-sales Support": "دعم ما بعد البيع",
      "Parts Support": "دعم القطع",
      "Warranty Coordination": "تنسيق الضمان",
      "Technical Guidance": "الدعم الفني",
      Credentials: "الاعتمادات",
      "Official Proof": "إثبات رسمي",
      "V-Star": "V-Star",
      "About V-Star": "عن V-Star",
      WhatsApp: "واتساب",
      Contact: "اتصال",
      Loading: "جار التحميل",
      "Request availability": "طلب التوفر",
      "View details": "عرض التفاصيل",
      "Open Google Maps": "فتح خرائط Google",
      "Open Amap": "فتح خريطة Amap",
      "Contact on WhatsApp": "تواصل عبر واتساب",
      "Submit Inquiry": "إرسال الطلب",
      Track: "تتبع",
      "Use demo tracking number": "استخدم رقم تتبع تجريبي",
      "Confirm shipment reference": "تأكيد مرجع الشحنة",
      "View process": "عرض العملية",
      "Search parts": "بحث القطع",
      "Open agreement": "فتح الاتفاقية",
      "Contact technical support": "تواصل مع الدعم الفني",
      "Certified Chinese": "شريك صيني",
      "Vehicle Export": "لتصدير السيارات",
      Partner: "معتمد",
      "Official credentials organized in one review area.": "الاعتمادات الرسمية منظمة في منطقة مراجعة واحدة.",
      "Close to Jiangyin, Xiamen, and Pingtan ports.": "قريب من موانئ جيانغين وشيامن وبينغتان.",
      "Minhou Base": "قاعدة مينهو",
      "Jiangyin Port": "ميناء جيانغين",
      "Xiamen Port": "ميناء شيامن",
      "Pingtan Port": "ميناء بينغتان",
      "Vehicle prep": "تجهيز المركبات",
      "Nearby port handover": "تسليم قريب من الميناء",
      "Island port route": "مسار ميناء الجزيرة",
      "South Fujian route": "مسار جنوب فوجيان",
      "Illustrative port network, not a legal berth map.": "شبكة موانئ توضيحية وليست خريطة أرصفة قانونية.",
      "Curated Chinese vehicle models for export.": "نماذج سيارات صينية مختارة للتصدير.",
      "Hybrid sedan": "سيدان هجينة",
      "Electric SUV": "SUV كهربائية",
      "EREV pickup": "بيك أب بمدى ممتد",
      "Hybrid compact sedan reference for family, business, and dealer-stock export inquiries.": "مرجع سيدان هجينة مدمجة لاستفسارات العائلة والأعمال ومخزون الوكلاء.",
      "Pure electric SUV option for buyers comparing comfort, range, and new-energy supply.": "خيار SUV كهربائي للمشترين الذين يقارنون الراحة والمدى وتوريد الطاقة الجديدة.",
      "Extended-range pickup reference for utility, outdoor, and fleet-market sourcing discussions.": "مرجع بيك أب بمدى ممتد لمناقشات التوريد للاستخدام العملي والخارجي والأساطيل.",
      "From sourcing to after-sales support.": "من التوريد إلى دعم ما بعد البيع.",
      Source: "توريد",
      Contract: "عقد",
      Export: "تصدير",
      Support: "دعم",
      "Visible operations, active global relationships.": "عمليات واضحة وعلاقات عالمية نشطة.",
      "National credentials, Fujian industrial bases, and stable global vehicle sourcing.": "اعتمادات وطنية وقواعد صناعية في فوجيان وتوريد عالمي مستقر.",
      "Physical bases and port routes support real vehicle export work.": "قواعد فعلية ومسارات موانئ تدعم أعمال تصدير السيارات.",
      "Two physical bases support vehicle sourcing, inspection, and faster port handover.": "قاعدتان فعليتان تدعمان التوريد والفحص وتسليم الميناء بسرعة.",
      "Certified exporter": "مصدّر معتمد",
      "Fujian dual-base operation": "تشغيل قاعدتين في فوجيان",
      "In-yard inventory": "مخزون داخل الساحة",
      "Port-side efficiency": "كفاءة قرب الميناء",
      "Locate the Minhou base and nearby export ports.": "تحديد قاعدة مينهو والموانئ القريبة.",
      "A sincere and reliable partner for Chinese vehicle export.": "شريك موثوق لتصدير السيارات الصينية.",
      "Main certificates are centralized on the homepage Credentials section.": "الشهادات الرئيسية مجمعة في قسم الاعتمادات بالصفحة الرئيسية.",
      "Service advantages": "مزايا الخدمة",
      "Fujian-based sourcing gives buyers practical delivery and after-sales support.": "توريد فوجيان يمنح المشترين تسليما ودعما عمليا.",
      "Customization and upgrade services are available for suitable export models.": "تتوفر خدمات التخصيص والترقية للنماذج المناسبة للتصدير.",
      "Vehicle sourcing references for confirmed export orders.": "مراجع توريد المركبات لطلبات التصدير المؤكدة.",
      "Compare representative models, then confirm current stock, batch photos, export documents, pricing, and delivery timing by inquiry.": "قارن النماذج التمثيلية، ثم أكد المخزون الحالي وصور الدفعة ووثائق التصدير والسعر وموعد التسليم عبر الاستفسار.",
      "Why choose our vehicle export": "لماذا تختار تصدير سياراتنا",
      "Reliable supply, verified credentials, and export-ready service.": "توريد موثوق واعتمادات موثقة وخدمة جاهزة للتصدير.",
      "In-stock vehicles at the base": "مركبات جاهزة في القاعدة",
      "Hundreds of ready vehicles around the factory area support on-site viewing, inspection, and batch selection.": "تدعم مئات المركبات الجاهزة حول منطقة المصنع المعاينة والفحص واختيار الدفعات في الموقع.",
      "Dual national credentials": "اعتمادان وطنيان",
      "MIIT automobile import and export license plus World Manufacturer Identifier certification support compliant cooperation.": "رخصة استيراد وتصدير السيارات من MIIT مع اعتماد رمز المصنع العالمي تدعمان التعاون المتوافق.",
      "Direct supply and parts support": "توريد مباشر ودعم قطع الغيار",
      "Major-brand source access helps improve dispatch speed, vehicle cost control, and original-part support for overseas repair needs.": "الوصول إلى مصادر العلامات الكبرى يساعد في تحسين سرعة الإرسال وضبط تكلفة المركبة ودعم القطع الأصلية لاحتياجات الإصلاح الخارجية.",
      "Global service response": "استجابة خدمة عالمية",
      "Multilingual after-sales support, sales media assistance, and multi-currency settlement help match different market habits.": "دعم ما بعد البيع متعدد اللغات ومواد البيع والتسوية متعددة العملات تساعد على ملاءمة عادات الأسواق المختلفة.",
      "Geographic freight advantage": "ميزة شحن جغرافية",
      "Close access to Jiangyin, Pingtan, and Xiamen port routes helps reduce inland transfer distance and control freight cost.": "القرب من مسارات موانئ جيانغين وبينغتان وشيامن يساعد على تقليل النقل الداخلي وضبط تكلفة الشحن.",
      "Each model page is a reference pack before live stock confirmation.": "كل صفحة نموذج هي حزمة مرجعية قبل تأكيد المخزون.",
      "Review model fit": "مراجعة ملاءمة النموذج",
      "Open the detail page": "فتح صفحة التفاصيل",
      "Confirm final batch": "تأكيد الدفعة النهائية",
      "Curated demand models for overseas sourcing discussion.": "نماذج طلب مختارة لمناقشة التوريد الخارجي.",
      "Models on the website are the starting point, not the final quotation.": "النماذج على الموقع نقطة بداية وليست عرض السعر النهائي.",
      "Tell us the model, quantity, and destination country.": "أرسل النموذج والكمية وبلد الوجهة.",
      "Loading vehicle detail": "تحميل تفاصيل السيارة",
      "Core highlights": "أبرز النقاط",
      "Key selling points from the supplied model sheet.": "نقاط البيع الرئيسية من ورقة النموذج.",
      "Model data arranged as webpage content.": "بيانات النموذج منظمة كمحتوى صفحة.",
      "Key specifications": "المواصفات الرئيسية",
      "Configuration notes": "ملاحظات التجهيز",
      "Model banner images extracted from the supplied sheet.": "صور النماذج مستخرجة من المادة المرجعية.",
      "Exterior Colors": "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0647\u064a\u0643\u0644",
      "Interior Colors": "\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u0642\u0635\u0648\u0631\u0629",
      "Send the target model, quantity, and destination country.": "أرسل النموذج والكمية وبلد الوجهة.",
      "Controlled export process from vehicle sourcing to after-sales support.": "عملية تصدير مضبوطة من التوريد إلى ما بعد البيع.",
      "Designed for international dealers, importers, and fleet buyers who need compliant trade and reliable delivery.": "مصمم للوكلاء والمستوردين ومشتري الأساطيل الذين يحتاجون إلى تجارة متوافقة وتسليم موثوق.",
      "Procurement and export process.": "عملية الشراء والتصدير.",
      "Requirement confirmation": "تأكيد المتطلبات",
      "Stock and specification check": "فحص المخزون والمواصفات",
      "Quotation and contract": "عرض السعر والعقد",
      "Documentation and customs": "المستندات والجمارك",
      "Port delivery and follow-up": "تسليم الميناء والمتابعة",
      "Start the order": "بدء الطلب",
      "Confirm model, quantity, destination, and timing with V-Star.": "أكد الطراز والكمية والوجهة والتوقيت مع V-Star.",
      "Send inquiry": "إرسال استفسار",
      "Buyers receive concrete order materials, not only a price message.": "يحصل المشترون على مواد طلب واضحة وليس رسالة سعر فقط.",
      "Vehicle photo and batch review": "مراجعة صور السيارة والدفعة",
      "Export paperwork preparation": "إعداد مستندات التصدير",
      "Fujian port route coordination": "تنسيق مسار موانئ فوجيان",
      "Open logistics tracking": "فتح تتبع اللوجستيات",
      "Customization is available as a secondary service.": "التخصيص متاح كخدمة إضافية.",
      "Support beyond the loading date.": "دعم بعد تاريخ التحميل.",
      "Export after-sales workflow from first contact to case closure.": "مسار ما بعد البيع من أول تواصل إلى إغلاق الحالة.",
      "A practical service path for exported vehicles.": "مسار خدمة عملي للسيارات المصدرة.",
      "Customer contact": "تواصل العميل",
      "Case registration": "تسجيل الحالة",
      "Evidence collection": "جمع الأدلة",
      "Technical triage": "فرز فني",
      "Solution confirmation": "تأكيد الحل",
      "Parts and logistics": "القطع واللوجستيات",
      "Repair follow-up": "متابعة الإصلاح",
      "Case closure": "إغلاق الحالة",
      "Open case": "فتح حالة",
      "Order file": "ملف الطلب",
      "Proof pack": "حزمة الإثبات",
      "Route case": "توجيه الحالة",
      "Buyer approval": "موافقة المشتري",
      "Dispatch plan": "خطة الإرسال",
      "Result check": "فحص النتيجة",
      "Record result": "تسجيل النتيجة",
      "Buyer communication starts the service file.": "تواصل المشتري يبدأ ملف الخدمة.",
      "Order records are checked before routing.": "تتم مراجعة سجلات الطلب قبل توجيه الحالة.",
      "Photos and inspection notes support review.": "الصور وملاحظات الفحص تدعم المراجعة.",
      "Technical checks classify the support route.": "الفحوصات الفنية تحدد مسار الدعم.",
      "Confirmed actions keep cost and timing clear.": "الإجراءات المؤكدة توضح التكلفة والتوقيت.",
      "Parts support is tied to freight and port updates.": "دعم القطع مرتبط بتحديثات الشحن والميناء.",
      "Follow-up evidence confirms the repair result.": "أدلة المتابعة تؤكد نتيجة الإصلاح.",
      "Closed cases remain traceable for later review.": "تبقى الحالات المغلقة قابلة للتتبع للمراجعة لاحقا.",
      "Complete evidence makes export after-sales faster.": "الأدلة الكاملة تجعل خدمة ما بعد البيع أسرع.",
      "Start with a clear service case.": "ابدأ بحالة خدمة واضحة.",
      "Search common damaged-part stock for current website models.": "ابحث عن مخزون القطع الشائعة للنماذج الحالية.",
      "Common damaged parts and reference prices.": "القطع الشائعة وأسعارها المرجعية.",
      "Search model or part": "ابحث عن نموذج أو قطعة",
      "Filter by model": "تصفية حسب النموذج",
      "Filter by category": "تصفية حسب الفئة",
      "Parts support is handled as a controlled export order.": "دعم القطع يعامل كطلب تصدير منظم.",
      "Track vehicle export handover and port movement status.": "تتبع تسليم السيارة وحركة الميناء.",
      "Port logistics information lookup": "استعلام معلومات لوجستيات الميناء",
      "Enter tracking reference": "أدخل مرجع التتبع",
      "Common logistics numbers": "أرقام لوجستية شائعة",
      "Each logistics query should answer a practical order question.": "كل استعلام لوجستي يجب أن يجيب عن سؤال عملي.",
      "Vehicle handover": "تسليم السيارة",
      "Document status": "حالة المستندات",
      "Port checkpoint": "نقطة الميناء",
      "Vessel milestone": "مرحلة السفينة",
      "Designed for export orders before a full logistics API is connected.": "مصمم لطلبات التصدير قبل ربط واجهة لوجستية كاملة.",
      "Contact V-Star technical support for exported vehicle issues.": "تواصل مع دعم V-Star الفني لمشكلات السيارات المصدرة.",
      "Use WhatsApp or phone for urgent technical triage.": "استخدم واتساب أو الهاتف للحالات الفنية العاجلة.",
      "Prepare the technical information that makes diagnosis possible.": "جهز المعلومات الفنية اللازمة للتشخيص.",
      "Draft warranty terms for exported vehicle orders.": "مسودة شروط ضمان لطلبات السيارات المصدرة.",
      "Export Vehicle Warranty Coordination Agreement": "اتفاقية تنسيق ضمان السيارات المصدرة",
      "Legal and commercial boundaries to confirm before signing.": "حدود قانونية وتجارية يجب تأكيدها قبل التوقيع.",
      "Recent activities and important company events.": "أنشطة حديثة وأحداث مهمة للشركة.",
      "Company activity shown with buyer relevance.": "أنشطة الشركة معروضة بما يهم المشتري.",
      "Turn activity proof into order confidence.": "حوّل إثبات النشاط إلى ثقة في الطلب.",
      "Send your target model, quantity, and destination country.": "أرسل النموذج والكمية وبلد الوجهة.",
      "Send a complete request and receive a more useful reply.": "أرسل طلبا كاملا لتحصل على رد أكثر فائدة.",
      "A reply should help you decide the next step.": "يجب أن يساعدك الرد على تحديد الخطوة التالية.",
      "Find V-Star Auto on live maps.": "اعثر على V-Star Auto على الخرائط المباشرة."
    },
  };

  function pathFromHref(href) {
    return (href || "").split("#")[0].split("?")[0];
  }

  function linkMatchesCurrent(link, current) {
    const href = link.getAttribute("href") || "";
    if (href.includes("#")) {
      return pathFromHref(href) === current && href.split("#")[1] === location.hash.slice(1);
    }
    return pathFromHref(href) === current;
  }

  function getSavedLanguage() {
    try {
      const saved = window.localStorage.getItem(languageStorageKey);
      return supportedLanguages.includes(saved) ? saved : "en";
    } catch (_error) {
      return "en";
    }
  }

  function saveLanguage(lang) {
    try {
      window.localStorage.setItem(languageStorageKey, lang);
    } catch (_error) {
      // Language switching still works for the current page when storage is unavailable.
    }
  }

  function translateValue(value, lang) {
    if (lang === "en") return value;
    const translated = (languageCopy[lang] && languageCopy[lang][value]) || value;
    return typeof translated === "string" && translated.includes("\uFFFD") ? value : translated;
  }

  function applyTextTranslations(lang) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, noscript, [data-no-translate], [data-language-switcher]")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.__vstarOriginalText) node.__vstarOriginalText = node.nodeValue;
      const original = node.__vstarOriginalText;
      const trimmed = original.trim();
      const translated = translateValue(trimmed, lang);
      node.nodeValue = original.replace(trimmed, translated);
    });
  }

  function applyAttributeTranslations(lang) {
    [
      ["placeholder", "i18nPlaceholder"],
      ["aria-label", "i18nAriaLabel"],
      ["title", "i18nTitle"],
    ].forEach(([attribute, dataKey]) => {
      document.querySelectorAll(`[${attribute}]`).forEach((element) => {
        if (element.closest("[data-no-translate], [data-language-switcher]")) return;
        if (!element.dataset[dataKey]) element.dataset[dataKey] = element.getAttribute(attribute);
        element.setAttribute(attribute, translateValue(element.dataset[dataKey], lang));
      });
    });
  }

  function applyLineTranslations(lang) {
    document.querySelectorAll("[data-i18n-lines]").forEach((element) => {
      const key = element.dataset.i18nLines || element.textContent.trim();
      element.textContent = "";
      element.classList.remove("has-mobile-zh-lines");

      if (lang === "zh" && element.dataset.zhLines) {
        element.classList.add("has-mobile-zh-lines");
        element.dataset.zhLines.split("|").forEach((line) => {
          const span = document.createElement("span");
          span.textContent = line;
          element.append(span);
        });
        return;
      }

      element.textContent = translateValue(key, lang);
    });
  }

  function updateLanguageButtons(lang) {
    document.querySelectorAll("[data-lang-option]").forEach((button) => {
      const isActive = button.dataset.langOption === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setSiteLanguage(lang) {
    const nextLang = supportedLanguages.includes(lang) ? lang : "en";
    document.documentElement.lang = nextLang === "zh" ? "zh-CN" : nextLang;
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
    body.dataset.language = nextLang;
    saveLanguage(nextLang);
    applyTextTranslations(nextLang);
    applyAttributeTranslations(nextLang);
    applyLineTranslations(nextLang);
    updateLanguageButtons(nextLang);
  }

  function initTopDropdowns() {
    if (!nav || nav.dataset.enhanced === "true") return;
    nav.dataset.enhanced = "true";

    nav.innerHTML = `
      <div class="nav-primary">
        ${topNavItems.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
      </div>
      <div class="nav-icons" aria-label="Quick actions">
        <div class="language-switcher" aria-label="Language selector" data-language-switcher>
          <button type="button" data-lang-option="en" aria-pressed="true">EN</button>
          <button type="button" data-lang-option="zh" aria-pressed="false">中文</button>
          <button type="button" data-lang-option="ar" aria-pressed="false">عربي</button>
        </div>
      </div>
    `;
  }

  function initSidebarMarkup() {
    if (document.querySelector("[data-sidebar]")) return;
    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar-panel";
    sidebar.setAttribute("data-sidebar", "");
    sidebar.setAttribute("aria-hidden", "true");
    sidebar.innerHTML = `
      <nav class="sidebar-links" aria-label="Primary sidebar navigation">
        ${sidebarSections
          .map(
            (section) => `
              <section class="sidebar-section">
                <h2>${section.title}</h2>
                <div class="sidebar-section-links">
                  <a class="sidebar-feature" href="${section.feature[1]}">${section.feature[0]}</a>
                  ${section.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
                </div>
              </section>
            `
          )
          .join("")}
      </nav>
    `;

    const backdrop = document.createElement("button");
    backdrop.className = "sidebar-backdrop";
    backdrop.type = "button";
    backdrop.setAttribute("aria-label", "Close navigation");
    backdrop.setAttribute("data-sidebar-close", "");
    document.body.append(sidebar, backdrop);
  }

  function setActiveNav() {
    const current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach((link) => {
      if (linkMatchesCurrent(link, current)) {
        link.setAttribute("aria-current", "page");
        const parent = link.closest(".nav-item, .sidebar-section");
        if (parent) parent.classList.add("is-active");
      }
    });

    let sidebarCurrentApplied = false;
    document.querySelectorAll(".sidebar-links a").forEach((link) => {
      if (sidebarCurrentApplied || !linkMatchesCurrent(link, current)) return;
      link.setAttribute("aria-current", "page");
      const parent = link.closest(".sidebar-section");
      if (parent) parent.classList.add("is-active");
      sidebarCurrentApplied = true;
    });
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function initNav() {
    if (!navToggle) return;
    const sidebar = document.querySelector("[data-sidebar]");
    const closeButtons = document.querySelectorAll("[data-sidebar-close]");
    let closeTimer;

    function setOpen(isOpen) {
      window.clearTimeout(closeTimer);
      navToggle.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        body.classList.remove("sidebar-closing");
        body.classList.add("sidebar-open");
        if (sidebar) sidebar.setAttribute("aria-hidden", "false");
        return;
      }

      if (!body.classList.contains("sidebar-open")) {
        body.classList.remove("sidebar-closing");
        if (sidebar) sidebar.setAttribute("aria-hidden", "true");
        return;
      }

      body.classList.remove("sidebar-open");
      body.classList.add("sidebar-closing");
      closeTimer = window.setTimeout(() => {
        body.classList.remove("sidebar-closing");
        if (sidebar) sidebar.setAttribute("aria-hidden", "true");
      }, 420);
    }

    navToggle.addEventListener("click", () => {
      setOpen(!body.classList.contains("sidebar-open"));
    });
    closeButtons.forEach((button) => button.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initHeaderSearch() {
    if (!header) return;
    const toggle = document.querySelector("[data-search-toggle]");
    const form = document.querySelector("[data-search-form]");
    const input = document.querySelector("[data-search-input]");
    if (!toggle || !form || !input) return;

    function setSearchOpen(isOpen) {
      header.classList.toggle("search-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        window.setTimeout(() => input.focus(), 120);
      } else {
        input.blur();
      }
    }

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.contains("search-open");
      setSearchOpen(!isOpen);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input.value.trim();
      if (!query) {
        setSearchOpen(false);
        return;
      }
      navigateWithDelay(`vehicles.html?search=${encodeURIComponent(query)}`);
    });

    document.addEventListener("click", (event) => {
      if (!header.classList.contains("search-open")) return;
      if (event.target.closest(".nav-icons")) return;
      setSearchOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setSearchOpen(false);
    });
  }

  function initLanguageSwitcher() {
    const switcher = document.querySelector("[data-language-switcher]");
    if (switcher) {
      switcher.querySelectorAll("[data-lang-option]").forEach((button) => {
        button.addEventListener("click", () => setSiteLanguage(button.dataset.langOption));
      });
    }
    setSiteLanguage(getSavedLanguage());
  }

  function getRouteLoader() {
    let loader = document.querySelector("[data-route-loader]");
    if (loader) return loader;

    loader = document.createElement("div");
    loader.className = "route-loader";
    loader.setAttribute("data-route-loader", "");
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML = `
      <div class="route-loader-panel">
        <span>${translateValue("Loading", getSavedLanguage())}</span>
        <i aria-hidden="true"></i>
      </div>
    `;
    document.body.append(loader);
    return loader;
  }

  function normalizeInternalHref(href) {
    if (!href) return "";
    if (href.startsWith("#")) return href;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return "";

    let url;
    try {
      url = new URL(href, location.href);
    } catch (_error) {
      return "";
    }

    if (url.origin !== location.origin) return "";
    return `${url.pathname.split("/").pop() || "index.html"}${url.search}${url.hash}`;
  }

  function navigateWithDelay(href) {
    const target = normalizeInternalHref(href);
    if (!target) {
      location.href = href;
      return;
    }

    location.href = target;
  }

  function initDelayedRoutes() {
    // Navigation now uses the browser's native immediate link behavior.
  }

  function getHomeHeroIntervalMs() {
    try {
      const tools = window.VSTAR_CONTENT_OVERRIDES;
      const overrides = tools && typeof tools.read === "function" ? tools.read() : window.VSTAR_DEFAULT_CONTENT_OVERRIDES;
      const interval = Number(overrides && overrides.settings && overrides.settings.homeHeroIntervalMs);
      return Number.isFinite(interval) && interval > 0 ? interval : 5000;
    } catch (_error) {
      return 5000;
    }
  }

  function initHeroSlides() {
    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const prevButton = document.querySelector("[data-hero-prev]");
    const nextButton = document.querySelector("[data-hero-next]");
    if (window.vstarHeroSlideTimer) {
      window.clearInterval(window.vstarHeroSlideTimer);
      window.vstarHeroSlideTimer = null;
    }
    if (slides.length < 2) {
      if (prevButton) prevButton.hidden = true;
      if (nextButton) nextButton.hidden = true;
      return;
    }
    let index = 0;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === 0);
    });

    function showSlide(nextIndex) {
      slides[index].classList.remove("is-active");
      index = (nextIndex + slides.length) % slides.length;
      loadDeferredImage(slides[index].querySelector("img"));
      slides[index].classList.add("is-active");
    }

    function startAutoPlay() {
      if (window.vstarHeroSlideTimer) window.clearInterval(window.vstarHeroSlideTimer);
      window.vstarHeroSlideTimer = window.setInterval(() => {
        showSlide(index + 1);
      }, getHomeHeroIntervalMs());
    }

    [prevButton, nextButton].forEach((button) => {
      if (button) button.hidden = false;
    });
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        showSlide(index - 1);
        startAutoPlay();
      });
    }
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        showSlide(index + 1);
        startAutoPlay();
      });
    }
    startAutoPlay();
  }

  function initPortNetworkCanvas() {
    const canvas = document.querySelector("[data-port-network-canvas]");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = {
      base: [0.47, 0.33],
      jiangyin: [0.68, 0.31],
      pingtan: [0.72, 0.53],
      xiamen: [0.31, 0.78],
    };
    const routes = [
      { from: "base", to: "jiangyin", control: [0.57, 0.23], color: "#ffffff", delay: 0 },
      { from: "base", to: "pingtan", control: [0.66, 0.42], color: "#7fb4ff", delay: 0.18 },
      { from: "base", to: "xiamen", control: [0.38, 0.58], color: "#7fb4ff", delay: 0.36 },
    ];

    let width = 0;
    let height = 0;
    let frame = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function point(name) {
      const item = points[name];
      return [item[0] * width, item[1] * height];
    }

    function scaled(pair) {
      return [pair[0] * width, pair[1] * height];
    }

    function quadratic(start, control, end, progress) {
      const oneMinus = 1 - progress;
      return [
        oneMinus * oneMinus * start[0] + 2 * oneMinus * progress * control[0] + progress * progress * end[0],
        oneMinus * oneMinus * start[1] + 2 * oneMinus * progress * control[1] + progress * progress * end[1],
      ];
    }

    function draw(timestamp) {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      for (let x = 40; x < width; x += 72) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 90, height);
        ctx.stroke();
      }
      for (let y = 48; y < height; y += 82) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * 0.28, y - 34, width * 0.52, y + 34, width, y - 18);
        ctx.stroke();
      }
      ctx.restore();

      routes.forEach((route) => {
        const start = point(route.from);
        const end = point(route.to);
        const control = scaled(route.control);

        ctx.save();
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.58;
        ctx.setLineDash([8, 10]);
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.quadraticCurveTo(control[0], control[1], end[0], end[1]);
        ctx.stroke();
        ctx.restore();

        const cycle = reduceMotion ? route.delay : ((timestamp / 2200 + route.delay) % 1);
        const pulse = quadratic(start, control, end, cycle);
        ctx.save();
        ctx.fillStyle = route.color;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(pulse[0], pulse[1], 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.arc(pulse[0], pulse[1], 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      Object.keys(points).forEach((name) => {
        const [x, y] = point(name);
        ctx.save();
        ctx.strokeStyle = name === "base" ? "#f04a3a" : "#2b78d4";
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 24 + Math.sin(timestamp / 520) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      if (!reduceMotion) {
        frame = window.requestAnimationFrame(draw);
      }
    }

    resize();
    draw(performance.now());
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(frame);
      resize();
      draw(performance.now());
    });
  }

  function whenNearViewport(element, callback, options = {}) {
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      callback();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          callback();
        });
      },
      { rootMargin: options.rootMargin || "720px 0px", threshold: 0.01 }
    );
    observer.observe(element);
  }

  function loadDeferredImage(img) {
    if (!img) return;
    const tools = window.VSTAR_CONTENT_OVERRIDES;
    if (tools && typeof tools.loadDeferredImage === "function") {
      tools.loadDeferredImage(img);
      return;
    }
    if (img.dataset.lazySrc) {
      img.src = img.dataset.lazySrc;
      delete img.dataset.lazySrc;
    }
  }

  function initRemoteImages() {
    document.querySelectorAll("img[data-remote]").forEach((img) => {
      const remote = img.dataset.remote;
      if (!remote) return;

      whenNearViewport(img, () => {
        const candidate = new Image();
        candidate.decoding = "async";
        if ("fetchPriority" in candidate) candidate.fetchPriority = "low";
        candidate.onload = () => {
          img.dataset.remoteApplied = "true";
          img.src = remote;
        };
        candidate.src = remote;
      });
    });
  }

  function setAssetImageSource(img, value, options = {}) {
    const tools = window.VSTAR_CONTENT_OVERRIDES;
    if (tools && typeof tools.setImageSource === "function") {
      tools.setImageSource(img, value || "", options);
      return;
    }
    img.decoding = "async";
    img.loading = options.eager ? "eager" : "lazy";
    if ("fetchPriority" in img) img.fetchPriority = options.eager ? "high" : "low";
    img.src = value || "";
  }

  function initCredentialModal() {
    const modal = document.querySelector("[data-modal]");
    const img = document.querySelector("[data-modal-img]");
    const close = document.querySelector("[data-modal-close]");
    if (!modal || !img || !close) return;
    const fallbackImage = img.getAttribute("src") || "assets/img/credentials/manufacturer-code-certificate.jpg";

    document.querySelectorAll("[data-modal-image]").forEach((button) => {
      button.addEventListener("click", () => {
        img.src = button.getAttribute("data-modal-image");
        modal.hidden = false;
      });
    });

    function closeModal() {
      modal.hidden = true;
      img.src = fallbackImage;
    }

    close.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  function initVehicleFilters() {
    const grid = document.querySelector("[data-vehicle-grid]");
    if (!grid) return;
    const filters = Array.from(document.querySelectorAll("[data-filter]"));
    const cards = Array.from(grid.querySelectorAll(".vehicle-card"));
    const emptyState = document.querySelector("[data-empty-state]");

    function matches(card, key, value) {
      if (value === "all") return true;
      return (card.dataset[key] || "").split(" ").includes(value);
    }

    function applyFilters() {
      const values = Object.fromEntries(filters.map((filter) => [filter.dataset.filter, filter.value]));
      const query = (new URLSearchParams(location.search).get("search") || "").trim().toLowerCase();
      let visibleCount = 0;
      cards.forEach((card) => {
        const visible =
          matches(card, "type", values.type) &&
          matches(card, "energy", values.energy) &&
          matches(card, "use", values.use) &&
          (!query || card.textContent.toLowerCase().includes(query));
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    }

    filters.forEach((filter) => filter.addEventListener("change", applyFilters));
    applyFilters();
  }

  function initVehicleDetail() {
    const detail = document.querySelector("[data-vehicle-detail]");
    if (!detail) return;

    const vehicles = window.VSTAR_VEHICLES || [];
    const params = new URLSearchParams(location.search);
    const vehicleId = params.get("model");
    const vehicle = vehicles.find((item) => item.id === vehicleId) || vehicles[0];

    if (!vehicle) return;

    const inquiryHref = `contact.html?vehicle=${encodeURIComponent(vehicle.fullName)}`;
    const setText = (selector, value) => {
      const target = document.querySelector(selector);
      if (target) target.textContent = value;
    };
    const normalizeFeatureCards = () => {
      const suppliedCards = vehicle.featureCards || [];
      const fallbackCopy = [
        "Presented as a core selling point for this configuration and export positioning.",
        "Use this point to explain the model's value before confirming the final batch specification.",
        "Suitable for inquiry discussions covering stock, destination-market needs, and delivery timing.",
      ];
      const highlightCards = (vehicle.highlights || []).map((item, index) => ({
        title: item,
        text: fallbackCopy[index] || vehicle.summary,
      }));
      return [...suppliedCards, ...highlightCards].slice(0, 3);
    };
    const normalizeConfiguration = () => {
      const items = vehicle.configuration || vehicle.highlights || [];
      return items.length
        ? items
        : ["Final configuration, exterior color, interior trim, and delivery timing should be confirmed before quotation."];
    };
    const normalizeParameterSections = () => {
      if (vehicle.parameterSections && vehicle.parameterSections.length) return vehicle.parameterSections;
      return [
        {
          title: "Reference Parameters",
          items: vehicle.specs,
        },
        {
          title: "Export Confirmation",
          items: [
            ["Final configuration", "Confirm against available Chinese-market stock before quotation."],
            ["Destination review", "Check certification, charging or fuel requirements, documents, and local registration needs."],
            ["Order details", "Confirm quantity, exterior color, interior trim, delivery timing, and target port by inquiry."],
          ],
        },
      ];
    };
    const normalizeGallery = (bannerImage) => {
      const galleryImages = Array.isArray(vehicle.gallery) ? vehicle.gallery.filter((item) => item && item.src) : [];
      if (galleryImages.length) return galleryImages.slice(0, 3);
      const fallbackImages = [
        {
          label: "Model banner",
          note: "Main visual section extracted from the supplied model sheet.",
          src: bannerImage,
          alt: `${vehicle.fullName} model banner`,
        },
        {
          label: "Vehicle reference",
          note: "Vehicle visual reference from the supplied model material.",
          src: bannerImage,
          alt: `${vehicle.fullName} visual reference`,
        },
        {
          label: "Configuration reference",
          note: "Configuration visual reference arranged in the shared detail-page format.",
          src: bannerImage,
          alt: `${vehicle.fullName} configuration reference`,
        },
      ];
      return fallbackImages.slice(0, 1);
    };
    const normalizeInteriorGallery = (bannerImage) => {
      const fallbackLabels = [
        "Cabin overview",
        "Seat and trim",
        "Controls and dashboard",
        "Front row detail",
        "Rear row detail",
        "Console detail",
        "Door trim detail",
        "Storage detail",
        "Interior material detail",
      ];
      const interiorImages = Array.isArray(vehicle.interiorGallery) ? vehicle.interiorGallery : [];
      const normalizeImage = (item, index) => {
        if (typeof item === "string") {
          return {
            label: fallbackLabels[index] || `Interior reference ${index + 1}`,
            note: fallbackLabels[index] || `Interior reference ${index + 1}`,
            src: item,
            alt: `${vehicle.fullName} interior reference ${index + 1}`,
          };
        }
        return {
          label: item && item.label ? item.label : fallbackLabels[index] || `Interior reference ${index + 1}`,
          note: item && item.note ? item.note : item && item.label ? item.label : fallbackLabels[index] || `Interior reference ${index + 1}`,
          src: item && item.src ? item.src : "",
          alt: item && item.alt ? item.alt : `${vehicle.fullName} interior reference ${index + 1}`,
        };
      };
      return interiorImages.map(normalizeImage).filter((item) => item.src).slice(0, 9);
    };
    const normalizeColorItems = (items) => {
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => {
          if (typeof item === "string") {
            return {
              name: item,
              colors: [],
            };
          }
          const rawColors = item && (item.colors || item.value || item.color);
          const colors = Array.isArray(rawColors)
            ? rawColors
            : String(rawColors || "")
                .split(/[\/,|]/)
                .map((color) => color.trim())
                .filter(Boolean);
          return {
            name: item && item.name ? item.name : item && item.label ? item.label : "Color option",
            colors: colors.filter((color) => /^#[0-9a-f]{3,8}$/i.test(color)),
            note: item && item.note ? item.note : "",
          };
        })
        .filter((item) => item.name && item.colors.length);
    };
    const swatchBackground = (colors) => {
      if (!colors.length) return "#d8d8d8";
      if (colors.length === 1) return colors[0];
      if (colors.length === 2) {
        return `linear-gradient(135deg, ${colors[0]} 0 50%, ${colors[1]} 50% 100%)`;
      }
      const step = 100 / colors.length;
      return `conic-gradient(${colors
        .map((color, index) => `${color} ${index * step}% ${(index + 1) * step}%`)
        .join(", ")})`;
    };
    const colorWash = (colors) => {
      const getRgb = (color) => {
        const raw = color.replace("#", "");
        const full =
          raw.length === 3
            ? raw
                .split("")
                .map((part) => part + part)
                .join("")
            : raw.slice(0, 6);
        const value = Number.parseInt(full, 16);
        if (!Number.isFinite(value)) return null;
        return {
          r: (value >> 16) & 255,
          g: (value >> 8) & 255,
          b: value & 255,
        };
      };
      const rgbaColors = colors
        .map((color) => getRgb(color))
        .filter(Boolean)
        .map(({ r, g, b }) => `rgba(${r}, ${g}, ${b}, 0.1)`);
      if (!rgbaColors.length) return "rgba(216, 216, 216, 0.1)";
      if (rgbaColors.length === 1) return rgbaColors[0];
      const step = 100 / rgbaColors.length;
      return `linear-gradient(180deg, ${rgbaColors
        .map((color, index) => `${color} ${index * step}% ${(index + 1) * step}%`)
        .join(", ")})`;
    };
    const renderColorGroup = (blockSelector, gridSelector, items) => {
      const block = document.querySelector(blockSelector);
      const grid = document.querySelector(gridSelector);
      if (!block || !grid) return;
      grid.innerHTML = "";
      if (!items.length) {
        block.hidden = true;
        return;
      }
      block.hidden = false;
      items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "vehicle-color-card";

        const swatch = document.createElement("span");
        swatch.className = "vehicle-color-swatch";
        swatch.style.background = swatchBackground(item.colors);
        swatch.style.setProperty("--vehicle-color-wash", colorWash(item.colors));
        swatch.setAttribute("aria-hidden", "true");

        const name = document.createElement("h3");
        name.textContent = item.name;
        card.append(swatch, name);
        if (item.note) {
          const note = document.createElement("p");
          note.textContent = item.note;
          card.append(note);
        }
        grid.append(card);
      });
    };

    document.title = `${vehicle.fullName} | V-Star Auto`;
    const bannerImage =
      vehicle.bannerImage || vehicle.specImage.replace("assets/img/vehicles/", "assets/img/vehicles/banners/");
    setText("[data-detail-name]", vehicle.fullName);
    setText("[data-detail-summary]", vehicle.summary);
    setText("[data-detail-meta]", `${vehicle.brand} / ${vehicle.category} / ${vehicle.energy}`);
    setText("[data-detail-photo-name]", vehicle.name);

    const detailPhoto = document.querySelector("[data-detail-photo]");
    if (detailPhoto && bannerImage) {
      detailPhoto.classList.add("has-image");
      detailPhoto.innerHTML = "";
      const img = document.createElement("img");
      setAssetImageSource(img, bannerImage, { eager: true });
      img.alt = `${vehicle.fullName} banner reference image`;
      detailPhoto.append(img);
    }

    document.querySelectorAll("[data-detail-inquiry], [data-detail-inquiry-secondary]").forEach((link) => {
      link.href = inquiryHref;
    });

    const tags = document.querySelector("[data-detail-tags]");
    if (tags) {
      tags.innerHTML = "";
      [vehicle.brand, vehicle.type, vehicle.energy, vehicle.use].forEach((label) => {
        const tag = document.createElement("span");
        tag.textContent = label;
        tags.append(tag);
      });
    }

    const specs = document.querySelector("[data-detail-specs]");
    if (specs) {
      specs.innerHTML = "";
      vehicle.specs.forEach(([label, value]) => {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = value;
        specs.append(dt, dd);
      });
    }

    const featureCards = document.querySelector("[data-detail-feature-cards]");
    if (featureCards) {
      featureCards.innerHTML = "";
      const cards = normalizeFeatureCards();
      cards.forEach((card) => {
        const article = document.createElement("article");
        article.className = "feature-card";
        const title = document.createElement("h3");
        const text = document.createElement("p");
        title.textContent = card.title;
        text.textContent = card.text;
        article.append(title, text);
        featureCards.append(article);
      });
    }

    const configuration = document.querySelector("[data-detail-configuration]");
    if (configuration) {
      configuration.innerHTML = "";
      const items = normalizeConfiguration();
      items.forEach((item, index) => {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = `Note ${String(index + 1).padStart(2, "0")}`;
        dd.textContent = item;
        configuration.append(dt, dd);
      });
    }

    const parameterSections = document.querySelector("[data-detail-parameter-sections]");
    if (parameterSections) {
      parameterSections.innerHTML = "";
      const sections = normalizeParameterSections();
      sections.forEach((section) => {
        const article = document.createElement("article");
        article.className = "parameter-section";
        const heading = document.createElement("h3");
        const list = document.createElement("dl");
        list.className = "spec-list";
        heading.textContent = section.title;
        section.items.forEach(([label, value]) => {
          const dt = document.createElement("dt");
          const dd = document.createElement("dd");
          dt.textContent = label;
          dd.textContent = value;
          list.append(dt, dd);
        });
        article.append(heading, list);
        parameterSections.append(article);
      });
    }

    const gallery = document.querySelector("[data-detail-gallery]");
    if (gallery) {
      gallery.innerHTML = "";
      const images = normalizeGallery(bannerImage);
      images.forEach((image) => {
        const card = document.createElement("figure");
        card.className = "vehicle-gallery-card";

        const img = document.createElement("img");
        setAssetImageSource(img, image.src, { eager: false });
        img.alt = image.alt || `${vehicle.fullName} ${image.label}`;
        card.append(img);

        const caption = document.createElement("figcaption");
        caption.textContent = image.note || image.label;
        card.append(caption);
        gallery.append(card);
      });
    }

    const interiorGallery = document.querySelector("[data-detail-interior-gallery]");
    if (interiorGallery) {
      interiorGallery.innerHTML = "";
      const images = normalizeInteriorGallery(bannerImage);
      const interiorSection = interiorGallery.closest(".vehicle-detail-interior-section");
      if (interiorSection) interiorSection.hidden = !images.length;
      images.forEach((image) => {
        const card = document.createElement("figure");
        card.className = "vehicle-gallery-card vehicle-interior-card";

        const img = document.createElement("img");
        setAssetImageSource(img, image.src, { eager: false });
        img.alt = image.alt || `${vehicle.fullName} ${image.label}`;
        card.append(img);

        const caption = document.createElement("figcaption");
        caption.textContent = image.note || image.label;
        card.append(caption);
        interiorGallery.append(card);
      });
    }

    const exteriorColors = normalizeColorItems(vehicle.exteriorColors);
    const interiorColors = normalizeColorItems(vehicle.interiorColors);
    renderColorGroup("[data-detail-exterior-color-block]", "[data-detail-exterior-colors]", exteriorColors);
    renderColorGroup("[data-detail-interior-color-block]", "[data-detail-interior-colors]", interiorColors);
    const colorSection = document.querySelector("[data-detail-color-section]");
    if (colorSection) {
      colorSection.hidden = !exteriorColors.length && !interiorColors.length;
    }

  }

  function initInquiryForm() {
    const form = document.querySelector("[data-inquiry-form]");
    if (!form) return;

    const recipientEmail = "1321829600@qq.com";
    const message = document.querySelector("[data-form-message]");
    const sendPanel = document.querySelector("[data-email-send-panel]");
    const defaultEmailLink = document.querySelector("[data-email-default]");
    const gmailLink = document.querySelector("[data-email-gmail]");
    const outlookLink = document.querySelector("[data-email-outlook]");
    const params = new URLSearchParams(location.search);
    const vehicle = params.get("vehicle");

    if (vehicle) {
      const target = form.elements.namedItem("brandModel");
      if (target) target.value = vehicle;
    }

    function fieldValue(name) {
      const field = form.elements.namedItem(name);
      return field ? field.value.trim() : "";
    }

    function buildInquiryEmail() {
      const vehicleType = fieldValue("vehicleType");
      const brandModel = fieldValue("brandModel");
      const quantity = fieldValue("quantity");
      const destination = fieldValue("destination");
      const name = fieldValue("name");
      const phone = fieldValue("phone");
      const email = fieldValue("email");
      const notes = fieldValue("notes");
      const subjectModel = brandModel || vehicleType || "Vehicle export";
      const subject = `V-Star Auto inquiry - ${subjectModel}`;
      const body = [
        "Hello V-Star Auto,",
        "",
        "I would like to send a vehicle export inquiry.",
        "",
        `Vehicle type: ${vehicleType || "-"}`,
        `Brand / model: ${brandModel || "-"}`,
        `Quantity: ${quantity || "-"}`,
        `Destination country: ${destination || "-"}`,
        "",
        `Name: ${name || "-"}`,
        `Phone / WhatsApp: ${phone || "-"}`,
        `Email: ${email || "-"}`,
        "",
        "Notes:",
        notes || "-",
        "",
        "Please reply with availability, configuration, reference price, export document notes, and delivery timing.",
      ].join("\n");

      return { subject, body };
    }

    function applyEmailLinks() {
      const { subject, body } = buildInquiryEmail();
      const encodedTo = encodeURIComponent(recipientEmail);
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);

      if (defaultEmailLink) {
        defaultEmailLink.href = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
      }
      if (gmailLink) {
        gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
      }
      if (outlookLink) {
        outlookLink.href = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      applyEmailLinks();
      if (sendPanel) sendPanel.hidden = false;
      if (message) {
        message.textContent = "Your inquiry email is ready. Choose your mailbox below, then send it from your own account.";
      }
    });
  }

  function initPortLogisticsTracking() {
    const form = document.querySelector("[data-logistics-form]");
    const result = document.querySelector("[data-logistics-result]");
    const demoButton = document.querySelector("[data-logistics-demo]");
    if (!form || !result) return;

    const input = form.elements.namedItem("trackingNumber");
    const demoNumber = "VST-JY-202605-001";
    const demoShipments = {
      "VST-JY-202605-001": {
        status: "Port handover completed",
        statusNote: "Awaiting vessel loading confirmation from the forwarder.",
        order: "Toyota Corolla 2026 1.8L Hybrid Premium / 2 units",
        route: "Fuzhou Minhou base - Jiangyin Port - Jebel Ali",
        etd: "2026-06-03",
        eta: "2026-06-24",
        checkpoints: [
          ["2026-05-24 10:20", "Vehicle and document match completed", "VIN, model trim, exterior color, and buyer order reference checked by V-Star."],
          ["2026-05-26 15:40", "Export document package prepared", "Commercial invoice, packing list, and booking reference prepared for customs review."],
          ["2026-05-28 09:15", "Domestic transfer to port arranged", "Vehicle movement scheduled from Fujian base to Jiangyin port logistics area."],
          ["2026-05-29 14:30", "Port handover completed", "Cargo handover record received. Waiting for loading plan and vessel confirmation."],
        ],
      },
      "VST-XM-202605-018": {
        status: "Customs document review",
        statusNote: "Port arrival is pending after final invoice confirmation.",
        order: "BYD Destroyer 05 DM-i / 5 units",
        route: "Supplier yard - Xiamen Port - Manila",
        etd: "2026-06-08",
        eta: "2026-06-15",
        checkpoints: [
          ["2026-05-25 11:00", "Stock batch confirmed", "Vehicle batch and configuration reference checked before export arrangement."],
          ["2026-05-27 16:10", "Booking request submitted", "Forwarder booking reference requested for the agreed port route."],
          ["2026-05-29 12:00", "Customs document review", "Document set is being checked before port delivery appointment."],
        ],
      },
    };

    function normalizeTrackingNumber(value) {
      return value.trim().toUpperCase().replace(/\s+/g, "");
    }

    function renderShipment(reference, shipment) {
      const events = shipment.checkpoints
        .map(
          ([time, title, text], index) => `
            <article class="tracking-event ${index === shipment.checkpoints.length - 1 ? "is-current" : ""}">
              <time>${time}</time>
              <div>
                <h4>${title}</h4>
                <p>${text}</p>
              </div>
            </article>
          `
        )
        .join("");

      result.innerHTML = `
        <div class="tracking-summary">
          <p class="eyebrow">Current status</p>
          <h3>${shipment.status}</h3>
          <p>${shipment.statusNote}</p>
          <dl>
            <div><dt>Reference</dt><dd>${reference}</dd></div>
            <div><dt>Order</dt><dd>${shipment.order}</dd></div>
            <div><dt>Route</dt><dd>${shipment.route}</dd></div>
            <div><dt>ETD / ETA</dt><dd>${shipment.etd} / ${shipment.eta}</dd></div>
          </dl>
        </div>
        <div class="tracking-events">${events}</div>
      `;
    }

    function renderManualRequest(reference) {
      result.innerHTML = `
        <div class="tracking-summary">
          <p class="eyebrow">Manual verification required</p>
          <h3>No live record found for ${reference}</h3>
          <p>This static website does not connect to a real carrier database yet. Send this reference to V-Star Auto so the team can verify booking, B/L, container, or port handover status.</p>
          <a class="button button-dark" href="contact.html">Send reference to V-Star</a>
        </div>
      `;
    }

    function track(value) {
      const reference = normalizeTrackingNumber(value);
      if (!reference) {
        result.innerHTML = `<p class="empty-note">Please enter a freight order, booking, bill of lading, or container reference.</p>`;
        if (input) input.focus();
        return;
      }
      const shipment = demoShipments[reference];
      if (shipment) {
        renderShipment(reference, shipment);
      } else {
        renderManualRequest(reference);
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      track(input ? input.value : "");
    });

    if (demoButton && input) {
      demoButton.addEventListener("click", () => {
        input.value = demoNumber;
        track(demoNumber);
      });
    }

    const params = new URLSearchParams(location.search);
    const trackingNumber = params.get("tracking");
    if (trackingNumber && input) {
      input.value = trackingNumber;
      track(trackingNumber);
    }
  }

  function initPartsLibrary() {
    const root = document.querySelector("[data-parts-library]");
    const table = document.querySelector("[data-parts-table]");
    if (!root || !table) return;

    const searchInput = document.querySelector("[data-parts-search]");
    const modelSelect = document.querySelector("[data-parts-model]");
    const categorySelect = document.querySelector("[data-parts-category]");
    const empty = document.querySelector("[data-parts-empty]");
    const models = window.VSTAR_PART_MODELS || [];
    const parts = window.VSTAR_COMMON_PARTS || [];
    const records = models.flatMap((model, modelIndex) =>
      parts.map((part, partIndex) => ({
        model: model.model,
        segment: model.segment,
        part: part.name,
        category: part.category,
        stock: Math.max(2, (part.stock[model.segment] || 6) - (modelIndex % 3) + (partIndex % 2)),
        price: part.price[model.segment] || part.price.sedan,
        note: part.note,
      }))
    );

    function fillSelect(select, values) {
      if (!select) return;
      values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.append(option);
      });
    }

    function render() {
      const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
      const modelValue = modelSelect ? modelSelect.value : "all";
      const categoryValue = categorySelect ? categorySelect.value : "all";
      const filtered = records.filter((record) => {
        const matchesQuery =
          !query ||
          record.model.toLowerCase().includes(query) ||
          record.part.toLowerCase().includes(query) ||
          record.category.toLowerCase().includes(query);
        const matchesModel = modelValue === "all" || record.model === modelValue;
        const matchesCategory = categoryValue === "all" || record.category === categoryValue;
        return matchesQuery && matchesModel && matchesCategory;
      });

      table.innerHTML = filtered
        .map(
          (record) => `
            <tr>
              <td>${record.model}</td>
              <td>${record.part}</td>
              <td>${record.category}</td>
              <td>${record.stock} pcs</td>
              <td>USD ${record.price}</td>
              <td>${record.note}</td>
            </tr>
          `
        )
        .join("");
      if (empty) empty.hidden = filtered.length !== 0;
    }

    fillSelect(modelSelect, models.map((item) => item.model));
    fillSelect(categorySelect, [...new Set(parts.map((item) => item.category))]);
    [searchInput, modelSelect, categorySelect].forEach((control) => {
      if (control) control.addEventListener("input", render);
      if (control) control.addEventListener("change", render);
    });
    render();
  }

  function initCaseFlow() {
    document.querySelectorAll("[data-case-flow]").forEach((board) => {
      const steps = [...board.querySelectorAll("[data-flow-step]")];
      const panels = [...board.querySelectorAll("[data-flow-panel]")];
      const progress = board.querySelector("[data-flow-progress]");
      if (!steps.length || !panels.length) return;

      const activate = (targetId) => {
        const activeIndex = Math.max(
          0,
          steps.findIndex((step) => step.dataset.flowStep === targetId)
        );

        steps.forEach((step, index) => {
          const isActive = index === activeIndex;
          step.classList.toggle("is-active", isActive);
          step.setAttribute("aria-selected", String(isActive));
          step.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach((panel) => {
          const isActive = panel.id === targetId;
          panel.hidden = !isActive;
          panel.classList.toggle("is-active", isActive);
        });

        if (progress) {
          progress.style.width = `${((activeIndex + 1) / steps.length) * 100}%`;
        }
      };

      steps.forEach((step, index) => {
        step.addEventListener("click", () => activate(step.dataset.flowStep));
        step.addEventListener("keydown", (event) => {
          const isForward = event.key === "ArrowDown" || event.key === "ArrowRight";
          const isBackward = event.key === "ArrowUp" || event.key === "ArrowLeft";
          if (!isForward && !isBackward) return;

          event.preventDefault();
          const direction = isForward ? 1 : -1;
          const next = steps[(index + direction + steps.length) % steps.length];
          next.focus();
          activate(next.dataset.flowStep);
        });
      });

      const defaultStep = steps.find((step) => step.classList.contains("is-active")) || steps[0];
      activate(defaultStep.dataset.flowStep);
    });
  }

  function initFujianPortMap() {
    const roots = Array.from(document.querySelectorAll("[data-fujian-port-map]"));
    if (!roots.length || !window.L) return;

    const points = [
      {
        label: "Minhou Base",
        type: "base",
        coords: [25.9084, 119.3392],
        note: "V-Star Auto operating area near Liang'an Road, Minhou County.",
      },
      {
        label: "Jiangyin Port",
        type: "port",
        coords: [25.4666, 119.3166],
        note: "Fuzhou Jiangyin port area used for vehicle shipment planning.",
      },
      {
        label: "Pingtan Port",
        type: "port",
        coords: [25.4506, 119.6862],
        note: "Pingtan island port area for export route review.",
      },
      {
        label: "Xiamen Port",
        type: "port",
        coords: [24.4798, 118.066],
        note: "South Fujian port route for flexible shipment planning.",
      },
    ];

    roots.forEach((root) => {
      whenNearViewport(root, () => {
      if (root.dataset.mapReady === "true") return;
      root.dataset.mapReady = "true";
      root.classList.add("is-loaded");

      const map = L.map(root, {
        attributionControl: true,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const basePoint = points[0].coords;
      points.forEach((point) => {
        const icon = L.divIcon({
          className: "",
          html: `<span class="map-marker-label"><i class="map-marker-pin ${point.type === "port" ? "is-port" : ""}"></i><strong>${point.label}</strong></span>`,
          iconAnchor: [10, 10],
        });
        L.marker(point.coords, { icon })
          .addTo(map)
          .bindPopup(`<strong>${point.label}</strong><span>${point.note}</span>`);
      });

      points.slice(1).forEach((point) => {
        L.polyline([basePoint, point.coords], {
          color: "#111111",
          dashArray: "8 8",
          opacity: 0.72,
          weight: 3,
        }).addTo(map);
      });

      map.fitBounds(L.latLngBounds(points.map((point) => point.coords)), {
        padding: [36, 36],
      });

      L.control
        .scale({
          imperial: false,
          metric: true,
        })
        .addTo(map);
      });
    });
  }

  initSidebarMarkup();
  initTopDropdowns();
  initRemoteImages();
  setActiveNav();
  initNav();
  initHeaderSearch();
  initDelayedRoutes();
  initHeroSlides();
  initPortNetworkCanvas();
  initCredentialModal();
  initVehicleFilters();
  initVehicleDetail();
  initInquiryForm();
  initPortLogisticsTracking();
  initPartsLibrary();
  initCaseFlow();
  initFujianPortMap();
  initLanguageSwitcher();
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();
