(function () {
  const storageKey = "vstar-content-overrides";
  const defaultOverrides = window.VSTAR_DEFAULT_CONTENT_OVERRIDES || {};
  const localAssetPrefix = "vstar-local-image:";

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function mergeOverrides(base, patch) {
    if (Array.isArray(base) || Array.isArray(patch)) return patch !== undefined ? clone(patch) : clone(base);
    if (!isPlainObject(base) || !isPlainObject(patch)) return patch !== undefined ? clone(patch) : clone(base);
    const result = clone(base) || {};
    Object.keys(patch).forEach((key) => {
      result[key] = mergeOverrides(base[key], patch[key]);
    });
    return result;
  }

  function replaceInlineImagesWithDefaults(value, fallback) {
    if (typeof value === "string") {
      if (value.startsWith("data:image/") && typeof fallback === "string" && !fallback.startsWith("data:image/")) {
        return fallback;
      }
      const trimmed = value.trim();
      const fallbackTrimmed = typeof fallback === "string" ? fallback.trim() : "";
      if ((trimmed.startsWith("[") || trimmed.startsWith("{")) && trimmed.includes("data:image/") && (fallbackTrimmed.startsWith("[") || fallbackTrimmed.startsWith("{"))) {
        try {
          const parsedValue = JSON.parse(value);
          const parsedFallback = JSON.parse(fallback);
          return JSON.stringify(replaceInlineImagesWithDefaults(parsedValue, parsedFallback), null, 2);
        } catch (_error) {
          return value;
        }
      }
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item, index) => replaceInlineImagesWithDefaults(item, Array.isArray(fallback) ? fallback[index] : undefined));
    }
    if (isPlainObject(value)) {
      const next = {};
      Object.keys(value).forEach((key) => {
        next[key] = replaceInlineImagesWithDefaults(value[key], isPlainObject(fallback) ? fallback[key] : undefined);
      });
      return next;
    }
    return value;
  }

  function migrateLegacyNewsLinks(value) {
    if (typeof value === "string") {
      return value
        .replaceAll("news.html#venezuelan-business-delegation", "news-venezuelan-business-delegation.html")
        .replaceAll('"href": "#venezuelan-business-delegation"', '"href": "news-venezuelan-business-delegation.html"');
    }
    if (Array.isArray(value)) return value.map((item) => migrateLegacyNewsLinks(item));
    if (isPlainObject(value)) {
      const next = {};
      Object.keys(value).forEach((key) => {
        next[key] = migrateLegacyNewsLinks(value[key]);
      });
      return next;
    }
    return value;
  }

  const legacyVehicleImageMap = {
    "assets/img/admin/vehicles/toyota-corolla-2026-premium-banner-image.jpg": "assets/img/vehicles/banners/toyota-corolla-hybrid-premium.jpg",
    "assets/img/admin/vehicles/toyota-corolla-2026-elite-banner-image.jpg": "assets/img/vehicles/banners/toyota-corolla-hybrid-elite.jpg",
    "assets/img/admin/vehicles/toyota-corolla-2026-pioneer-banner-image.jpg": "assets/img/vehicles/banners/toyota-corolla-hybrid-pioneer.jpg",
    "assets/img/admin/vehicles/kia-k3-2024-comfort-banner-image.jpg": "assets/img/vehicles/banners/kia-k3-comfort.jpg",
    "assets/img/admin/vehicles/changan-hunter-warrior-1031km-banner-image.jpg": "assets/img/vehicles/banners/changan-hunter-warrior.jpg",
    "assets/img/admin/vehicles/toyota-corolla-cross-2026-banner-image.jpg": "assets/img/vehicles/banners/toyota-corolla-cross.jpg",
    "assets/img/admin/vehicles/hyundai-elantra-2023-premium-banner-image.jpg": "assets/img/vehicles/banners/hyundai-elantra.jpg",
    "assets/img/admin/vehicles/geely-bin-yue-l-2025-banner-image.jpg": "assets/img/vehicles/banners/geely-bin-yue-l.jpg",
    "assets/img/admin/vehicles/mazda-ez-60-600-max-banner-image.jpg": "assets/img/vehicles/banners/mazda-ez-60.jpg",
    "assets/img/admin/vehicles/byd-destroyer-05-dmi-banner-image.jpg": "assets/img/vehicles/banners/byd-destroyer-05.jpg",
  };

  function migrateLegacyLowResVehicleImages(value) {
    if (typeof value === "string") {
      let next = value;
      Object.keys(legacyVehicleImageMap).forEach((legacyPath) => {
        next = next.replaceAll(legacyPath, legacyVehicleImageMap[legacyPath]);
      });
      return next;
    }
    if (Array.isArray(value)) return value.map((item) => migrateLegacyLowResVehicleImages(item));
    if (isPlainObject(value)) {
      const next = {};
      Object.keys(value).forEach((key) => {
        next[key] = migrateLegacyLowResVehicleImages(value[key]);
      });
      return next;
    }
    return value;
  }

  function migrateHomeHeroSlides(value) {
    if (!isPlainObject(value) || !isPlainObject(value.fields)) return value;
    const defaultSlides = defaultOverrides.fields && defaultOverrides.fields["home.hero.slides"];
    const currentSlides = value.fields["home.hero.slides"];
    if (typeof defaultSlides !== "string") return value;
    try {
      const defaultList = JSON.parse(defaultSlides);
      const currentList = typeof currentSlides === "string" ? JSON.parse(currentSlides) : [];
      const requiredMobileImages = Array.isArray(defaultList)
        ? defaultList.map((item) => item && item.mobileSrc).filter(Boolean)
        : [];
      const currentMobileImages = Array.isArray(currentList)
        ? currentList.map((item) => item && item.mobileSrc).filter(Boolean)
        : [];
      const needsLatestMobileSlides =
        !Array.isArray(currentList) ||
        currentList.length < requiredMobileImages.length ||
        !requiredMobileImages.every((src) => currentMobileImages.includes(src));
      if (needsLatestMobileSlides) {
        value.fields["home.hero.slides"] = defaultSlides;
      }
    } catch (_error) {
      value.fields["home.hero.slides"] = defaultSlides;
    }
    return value;
  }

  function migrateLegacyHomeActivityCards(value) {
    if (!isPlainObject(value) || !isPlainObject(value.fields)) return value;
    const currentCards = value.fields["home.activity.cards"];
    const activeDefaults = migrateLegacyLowResVehicleImages(defaultOverrides);
    const defaultCards = activeDefaults.fields && activeDefaults.fields["home.activity.cards"];
    if (typeof currentCards !== "string" || typeof defaultCards !== "string") return value;
    try {
      const cards = JSON.parse(currentCards);
      const defaultCardList = JSON.parse(defaultCards);
      const latestCard = Array.isArray(defaultCardList)
        ? defaultCardList.find((card) => card && card.href === "news-venezuelan-business-delegation.html")
        : null;
      const isOldActivityDefault =
        Array.isArray(cards) &&
        cards[0] &&
        cards[0].title === "Venezuelan Business Delegation Visits Our Company for Industrial Inspection and Exchange" &&
        cards.slice(1).some((card) => card && !card.title);
      if (isOldActivityDefault) {
        value.fields["home.activity.cards"] = defaultCards;
        return value;
      }
      if (Array.isArray(cards) && latestCard) {
        const latestIndex = cards.findIndex(
          (card) => card && (card.href === latestCard.href || card.src === latestCard.src || card.title === latestCard.title)
        );
        if (latestIndex === -1) {
          value.fields["home.activity.cards"] = JSON.stringify([latestCard, ...cards], null, 2);
        } else if (latestIndex > 0) {
          const nextCards = cards.slice();
          const [existingLatestCard] = nextCards.splice(latestIndex, 1);
          value.fields["home.activity.cards"] = JSON.stringify([existingLatestCard, ...nextCards], null, 2);
        }
      }
    } catch (_error) {
      return value;
    }
    return value;
  }

  function sanitizeOverrides(overrides) {
    return migrateHomeHeroSlides(
      migrateLegacyHomeActivityCards(
        migrateLegacyLowResVehicleImages(migrateLegacyNewsLinks(replaceInlineImagesWithDefaults(overrides || {}, defaultOverrides)))
      )
    );
  }

  function currentDefaultOverrides() {
    return migrateLegacyLowResVehicleImages(defaultOverrides);
  }

  function openLocalAssetDb() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("当前浏览器不支持本地图片库"));
        return;
      }
      const request = window.indexedDB.open("vstar-local-assets", 1);
      request.onerror = () => reject(request.error || new Error("本地图片库打开失败"));
      request.onupgradeneeded = () => {
        request.result.createObjectStore("images", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
    });
  }

  function localAssetRequest(mode, callback) {
    return openLocalAssetDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction("images", mode);
          const store = tx.objectStore("images");
          const request = callback(store);
          request.onerror = () => reject(request.error || new Error("本地图片库读取失败"));
          request.onsuccess = () => resolve(request.result);
          tx.oncomplete = () => db.close();
          tx.onerror = () => reject(tx.error || new Error("本地图片库操作失败"));
        })
    );
  }

  function isLocalAssetRef(value) {
    return typeof value === "string" && value.startsWith(localAssetPrefix);
  }

  function resolveAssetSrc(value) {
    if (!isLocalAssetRef(value)) return Promise.resolve(value || "");
    const id = value.slice(localAssetPrefix.length);
    return localAssetRequest("readonly", (store) => store.get(id)).then((record) => (record && record.dataUrl) || "");
  }

  function getLocalAssetRecord(value) {
    if (!isLocalAssetRef(value)) return Promise.resolve(null);
    const id = value.slice(localAssetPrefix.length);
    return localAssetRequest("readonly", (store) => store.get(id)).then((record) => record || null);
  }

  function getAllLocalAssetRecords() {
    return localAssetRequest("readonly", (store) => store.getAll()).then((records) => records || []);
  }

  function loadDeferredImage(image) {
    if (!image) return;
    const lazySrc = image.dataset.lazySrc;
    if (!lazySrc) return;
    image.src = lazySrc;
    delete image.dataset.lazySrc;
  }

  function markImageLoading(image, options = {}) {
    if (!image) return;
    const eager = options.eager === true;
    image.decoding = "async";
    image.loading = eager ? "eager" : "lazy";
    if ("fetchPriority" in image) image.fetchPriority = eager ? "high" : "low";
  }

  function applyResolvedImageSource(image, src, options = {}) {
    if (!image) return;
    markImageLoading(image, options);
    if (!src) {
      image.removeAttribute("src");
      delete image.dataset.lazySrc;
      return;
    }
    if (options.defer === true) {
      image.dataset.lazySrc = src;
      image.removeAttribute("src");
      return;
    }
    delete image.dataset.lazySrc;
    image.src = src;
  }

  function shouldLoadEagerly(image) {
    return Boolean(
      image &&
        (image.closest(".page-hero") ||
          image.closest(".hero-slide.is-active") ||
          image.closest("[data-detail-photo]") ||
          image.matches("[data-modal-img]"))
    );
  }

  function setImageSource(image, value, options = {}) {
    if (!image) return;
    const loadingOptions = { ...options };
    if (loadingOptions.eager === undefined) loadingOptions.eager = shouldLoadEagerly(image);
    if (!isLocalAssetRef(value)) {
      applyResolvedImageSource(image, value || "", loadingOptions);
      return;
    }
    resolveAssetSrc(value)
      .then((src) => {
        applyResolvedImageSource(image, src || "", loadingOptions);
      })
      .catch(() => {
        image.removeAttribute("src");
        delete image.dataset.lazySrc;
      });
  }

  function setSourceSrcset(source, value) {
    if (!source) return;
    if (!value) {
      source.removeAttribute("srcset");
      return;
    }
    if (!isLocalAssetRef(value)) {
      source.srcset = value;
      return;
    }
    resolveAssetSrc(value)
      .then((src) => {
        if (src) source.srcset = src;
        else source.removeAttribute("srcset");
      })
      .catch(() => source.removeAttribute("srcset"));
  }

  function createResponsiveImage(item, fallbackAlt, options = {}) {
    const image = document.createElement("img");
    const src = item && typeof item.src === "string" ? item.src : "";
    const mobileSrc = item && typeof item.mobileSrc === "string" ? item.mobileSrc.trim() : "";
    setImageSource(image, src, options);
    image.alt = (item && item.alt) || fallbackAlt || "";
    if (!mobileSrc) return image;
    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.media = "(max-width: 680px)";
    setSourceSrcset(source, mobileSrc);
    picture.append(source, image);
    return picture;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("图片读取失败"));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  function measureImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onerror = () => reject(new Error("图片解析失败"));
      image.onload = () => resolve({ width: image.width, height: image.height });
      image.src = dataUrl;
    });
  }

  async function storeLocalImageFile(file) {
    if (!file || !file.type || !file.type.startsWith("image/")) throw new Error("请选择图片文件");
    const dataUrl = await readFileAsDataUrl(file);
    const dimensions = await measureImage(dataUrl);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${file.name.replace(/[^a-zA-Z0-9.]+/g, "-").toLowerCase()}`;
    await localAssetRequest("readwrite", (store) =>
      store.put({
        id,
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
        updatedAt: new Date().toISOString(),
      })
    );
    const ref = `${localAssetPrefix}${id}`;
    return {
      dataUrl: ref,
      ref,
      original: { ...dimensions, bytes: file.size },
      optimized: { ...dimensions, bytes: file.size },
      storedLocally: true,
    };
  }

  const schema = [
    {
      id: "home",
      label: "首页",
      url: "index.html",
      fields: [
        { key: "home.hero.eyebrow", label: "首页 Banner 小标题", selector: ".hero-home .hero-content .eyebrow", type: "text", default: "Verified credentials. Port-side delivery." },
        { key: "home.hero.title", label: "首页 Banner 主标题", selector: ".hero-home .hero-content h1", type: "text", default: "Certified Chinese Vehicle Export Partner" },
        { key: "home.hero.subtitle", label: "首页 Banner 副标题", selector: ".hero-home .hero-content > p:not(.eyebrow)", type: "text", default: "Two bases, verified credentials, and direct vehicle supply." },
        {
          key: "home.hero.slides",
          label: "首页 Banner 轮播图片列表",
          selector: ".hero-home",
          type: "imageList",
          default: JSON.stringify(
            [
              {
                src: "assets/img/admin/pages/home-hero-slides-0.jpg",
                mobileSrc: "assets/img/admin/pages/home-hero-slides-0-mobile.jpg",
                alt: "V-Star Auto homepage banner",
              },
              {
                src: "assets/img/admin/pages/home-hero-slides-1.jpg",
                mobileSrc: "assets/img/admin/pages/home-hero-slides-1-mobile.jpg",
                alt: "V-Star Auto homepage banner",
              },
              {
                src: "assets/img/admin/pages/home-hero-slides-2.png",
                mobileSrc: "assets/img/admin/pages/home-hero-slides-2-mobile.png",
                alt: "V-Star Auto homepage banner",
              },
              {
                src: "assets/img/admin/pages/home-hero-slides-3.jpg",
                mobileSrc: "assets/img/admin/pages/home-hero-slides-3-mobile.jpg",
                alt: "V-Star Auto international delegation visit",
              },
            ],
            null,
            2
          ),
          itemFields: [
            ["src", "电脑图"],
            ["mobileSrc", "手机图（可选）"],
            ["alt", "图片说明"],
          ],
        },
        { key: "home.credentials.title", label: "资质区标题", selector: "#credentials .section-heading h2", type: "text", default: "Official credentials organized in one review area." },
        { key: "home.credentials.copy", label: "资质区说明", selector: "#credentials .section-heading p:not(.eyebrow)", type: "text", default: "V-Star Auto's import and export license, company registration, manufacturer code, WMI code, and quality management certificate are grouped here so overseas buyers can review the main compliance documents without repeated pages." },
        { key: "home.location.title", label: "港口优势标题", selector: "#location .split-copy h2", type: "text", default: "Close to Jiangyin, Xiamen, and Pingtan ports." },
        { key: "home.location.copy", label: "港口优势说明", selector: "#location .split-copy p:not(.eyebrow)", type: "text", default: "Bases in Minhou and Pingtan reduce inland transfer time, support faster vehicle dispatch, and help control logistics cost for overseas buyers." },
        { key: "home.vehicle.eyebrow", label: "首页车型区小标题", selector: "[data-home-vehicle-eyebrow]", type: "text", default: "Vehicle center" },
        { key: "home.vehicle.title", label: "首页车型区标题", selector: "[data-home-vehicle-title]", type: "text", default: "Curated Chinese vehicle models for export." },
        { key: "home.vehicle.cta", label: "首页车型区按钮文字", selector: "[data-home-vehicle-cta]", type: "text", default: "Explore Vehicles" },
        {
          key: "home.vehicle.cards",
          label: "首页车型展示卡片",
          selector: "[data-home-vehicle-cards]",
          type: "vehiclePreviewList",
          default: JSON.stringify(
            [
              {
                src: "assets/img/vehicles/home-toyota-corolla-exterior.jpg",
                alt: "Toyota Corolla 2026 Premium hybrid sedan",
                eyebrow: "Hybrid sedan",
                title: "Toyota Corolla 2026 Premium",
                text: "Hybrid compact sedan reference for family, business, and dealer-stock export inquiries.",
                href: "vehicle-detail.html?model=toyota-corolla-2026-premium",
                action: "View details",
              },
              {
                src: "assets/img/vehicles/home-mazda-ez-60-exterior.jpg",
                alt: "Mazda EZ-60 600 Max electric SUV",
                eyebrow: "Electric SUV",
                title: "Mazda EZ-60 600 Max",
                text: "Pure electric SUV option for buyers comparing comfort, range, and new-energy supply.",
                href: "vehicle-detail.html?model=mazda-ez-60-600-max",
                action: "View details",
              },
              {
                src: "assets/img/vehicles/home-changan-hunter-exterior.jpg",
                alt: "Changan Hunter Warrior 1031km EREV pickup",
                eyebrow: "EREV pickup",
                title: "Changan Hunter Warrior 1031km",
                text: "Extended-range pickup reference for utility, outdoor, and fleet-market sourcing discussions.",
                href: "vehicle-detail.html?model=changan-hunter-warrior-1031km",
                action: "View details",
              },
            ],
            null,
            2
          ),
          itemFields: [
            ["src", "图片"],
            ["alt", "图片说明"],
            ["eyebrow", "分类小标题"],
            ["title", "车型标题"],
            ["text", "简介"],
            ["href", "详情链接"],
            ["action", "按钮文字"],
          ],
        },
        { key: "home.activity.title", label: "首页活动区标题", selector: "[data-home-activity-title]", type: "text", default: "Visible operations, active global relationships." },
        {
          key: "home.activity.cards",
          label: "首页活动卡片",
          selector: "[data-home-activity-cards]",
          type: "cardList",
          default: JSON.stringify(
            [
              {
                src: "assets/img/news/venezuelan-delegation/cover.jpg",
                mobileSrc: "assets/img/news/venezuelan-delegation/cover-mobile.jpg",
                alt: "Venezuelan business delegation group photo at V-Star Auto",
                eyebrow: "Industrial inspection / International exchange",
                title: "Venezuelan delegation visits V-Star.",
                text: "Company inspection, vehicle review, and cooperation exchange.",
                href: "news-venezuelan-business-delegation.html",
                featured: "true",
              },
              {
                src: "assets/img/expo-booth.jpg",
                alt: "V-Star Auto exhibition booth",
                eyebrow: "Exhibition / Channel development",
                title: "Domestic automotive exhibitions and industry presence.",
                text: "Long-term channel contact and market activity records.",
                href: "news.html",
              },
              {
                src: "assets/img/client-visit.jpg",
                alt: "International clients visiting V-Star Auto factory",
                eyebrow: "Client visit / On-site inspection",
                title: "International clients visit bases for vehicle inspection.",
                text: "Factory visits support order review and cooperation talks.",
                href: "news.html",
              },
              {
                src: "assets/img/press-event.jpg",
                alt: "V-Star Auto cooperation event",
                eyebrow: "Cooperation / Supply capability",
                title: "Strategic cooperation supports larger sourcing demand.",
                text: "Business execution materials for buyer confidence.",
                href: "news.html",
              },
            ],
            null,
            2
          ),
          itemFields: [
            ["src", "图片"],
            ["mobileSrc", "手机图（可选）"],
            ["alt", "图片说明"],
            ["eyebrow", "小标题"],
            ["title", "标题"],
            ["text", "卡片文字"],
            ["href", "链接"],
            ["featured", "是否大图 true/false"],
          ],
        },
      ],
    },
    {
      id: "vehicles",
      label: "车型展示页",
      url: "vehicles.html",
      fields: [
        { key: "vehicles.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "Vehicle center" },
        { key: "vehicles.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Vehicle sourcing references for confirmed export orders." },
        { key: "vehicles.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "Compare representative models, then confirm current stock, batch photos, export documents, pricing, and delivery timing by inquiry." },
        { key: "vehicles.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/admin/pages/home-hero-slides-1.jpg" },
        { key: "vehicles.usage.title", label: "服务优势标题", selector: "[data-vehicles-usage] .section-heading h2", type: "text", default: "Reliable supply, verified credentials, and export-ready service." },
      ],
    },
    {
      id: "services",
      label: "出口服务页",
      url: "services.html",
      fields: [
        { key: "services.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "Export services" },
        { key: "services.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Controlled export process from vehicle sourcing to after-sales support." },
        { key: "services.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "Designed for international dealers, importers, and fleet buyers who need compliant trade and reliable delivery." },
        { key: "services.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/expo-meeting.jpg" },
        { key: "services.process.title", label: "采购流程标题", selector: ".section .section-heading h2", type: "text", default: "Procurement and export process." },
        { key: "services.process.copy", label: "采购流程说明", selector: ".section .section-heading p:not(.eyebrow)", type: "text", default: "Each step creates a visible confirmation point for the buyer, so the order can move from target model to shipment without vague promises." },
      ],
    },
    {
      id: "about",
      label: "关于我们页",
      url: "about.html",
      fields: [
      { key: "about.hero.eyebrow", label: "\u9875\u9762 Banner \u5c0f\u6807\u9898", selector: ".page-hero .eyebrow", type: "text", default: "About V-Star" },
      { key: "about.hero.title", label: "\u9875\u9762 Banner \u4e3b\u6807\u9898", selector: ".page-hero h1", type: "text", default: "National credentials, Fujian industrial bases, and stable global vehicle sourcing." },
      { key: "about.hero.subtitle", label: "\u9875\u9762 Banner \u526f\u6807\u9898", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "V-Star Auto operates from Fujian with certified export qualifications, physical vehicle yards, and port routes designed for efficient overseas delivery." },
      { key: "about.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/about/about-fujian-aerial-hero.jpg" },
      { key: "about.profile.image", label: "\u4f01\u4e1a\u7b80\u4ecb\u56fe\u7247", selector: "[data-about-profile] .split-media img", type: "image", default: "assets/img/about/about-base-gate.jpg" },
      { key: "about.profile.eyebrow", label: "\u4f01\u4e1a\u7b80\u4ecb\u5c0f\u6807\u9898", selector: "[data-about-profile] .split-copy .eyebrow", type: "text", default: "Company profile" },
      { key: "about.profile.title", label: "\u4f01\u4e1a\u7b80\u4ecb\u4e3b\u6807\u9898", selector: "[data-about-profile] .split-copy h2", type: "text", default: "A sincere and reliable partner for Chinese vehicle export." },
      { key: "about.profile.copy1", label: "\u4f01\u4e1a\u7b80\u4ecb\u8bf4\u660e 1", selector: "[data-about-profile] .split-copy p:nth-of-type(2)", type: "text", default: "V-Star Auto supports overseas customers with cost-effective Chinese vehicle products, transparent trade processes, physical inspection opportunities, and full lifecycle support." },
      { key: "about.profile.copy2", label: "\u4f01\u4e1a\u7b80\u4ecb\u8bf4\u660e 2", selector: "[data-about-profile] .split-copy p:nth-of-type(3)", type: "text", default: "The company profile highlights cooperation with major domestic automotive groups, batch vehicle supply, overseas market delivery experience, and public corporate settlement for compliant transactions." },
      { key: "about.profile.copy3", label: "\u4f01\u4e1a\u7b80\u4ecb\u8bf4\u660e 3", selector: "[data-about-profile] .split-copy p:nth-of-type(4)", type: "text", default: "Clients can visit the Fujian bases, inspect vehicles on site, sign formal Chinese-English contracts, and coordinate export through verified documentation and port logistics follow-up." },
      { key: "about.video.eyebrow", label: "\u4f01\u4e1a\u89c6\u9891\u5c0f\u6807\u9898", selector: "[data-about-video] .section-heading .eyebrow .company-video-copy-en", type: "text", default: "Company video" },
      { key: "about.video.title", label: "\u4f01\u4e1a\u89c6\u9891\u4e3b\u6807\u9898", selector: "[data-about-video] #company-video-title .company-video-copy-en", type: "text", default: "Watch V-Star Auto's company profile and export service workflow." },
      { key: "about.video.copy", label: "\u4f01\u4e1a\u89c6\u9891\u8bf4\u660e", selector: "[data-about-video] .section-heading > p:not(.eyebrow) .company-video-copy-en", type: "text", default: "Review the company background, physical bases, vehicle export process, and service capability." },
      { key: "about.video.coverTitle", label: "\u4f01\u4e1a\u89c6\u9891\u5c01\u9762\u6807\u9898", selector: "[data-video-cover-title]", type: "text", default: "Built for Customization. Ready for Global Export." },
    { key: "about.video.poster", label: "\u4f01\u4e1a\u89c6\u9891\u5c01\u9762\u56fe", selector: "[data-about-video] video", type: "poster", default: "assets/img/about/about-base-gate.jpg" },
      { key: "about.video.src", label: "\u4f01\u4e1a\u89c6\u9891\u6587\u4ef6\u8def\u5f84", selector: "[data-about-video] video source", type: "video", default: "assets/video/company-profile.mp4" },
      { key: "about.evidence.eyebrow", label: "\u73b0\u573a\u8bc1\u636e\u5c0f\u6807\u9898", selector: "[data-about-evidence] .section-heading .eyebrow", type: "text", default: "Field evidence" },
      { key: "about.evidence.title", label: "\u73b0\u573a\u8bc1\u636e\u4e3b\u6807\u9898", selector: "[data-about-evidence] .section-heading h2", type: "text", default: "Real places and real order materials help buyers check before payment and shipment." },
      { key: "about.evidence.card1.image", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 01 \u56fe\u7247", selector: "[data-about-evidence] .evidence-card:nth-child(1) img", type: "image", default: "assets/img/about/about-vehicle-inspection.jpg" },
      { key: "about.evidence.card1.eyebrow", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 01 \u5c0f\u6807\u9898", selector: "[data-about-evidence] .evidence-card:nth-child(1) .eyebrow", type: "text", default: "Inventory yard" },
      { key: "about.evidence.card1.title", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 01 \u6807\u9898", selector: "[data-about-evidence] .evidence-card:nth-child(1) h3", type: "text", default: "On-site vehicle inspection" },
      { key: "about.evidence.card1.copy", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 01 \u8bf4\u660e", selector: "[data-about-evidence] .evidence-card:nth-child(1) h3 + p", type: "text", default: "Overseas customers can review available vehicles, confirm trims and colors, and discuss order details directly at the Fujian base." },
      { key: "about.evidence.card2.image", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 02 \u56fe\u7247", selector: "[data-about-evidence] .evidence-card:nth-child(2) img", type: "image", default: "assets/img/about/about-expo-activity.jpg" },
      { key: "about.evidence.card2.eyebrow", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 02 \u5c0f\u6807\u9898", selector: "[data-about-evidence] .evidence-card:nth-child(2) .eyebrow", type: "text", default: "Industry presence" },
      { key: "about.evidence.card2.title", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 02 \u6807\u9898", selector: "[data-about-evidence] .evidence-card:nth-child(2) h3", type: "text", default: "Exhibitions and cooperation" },
      { key: "about.evidence.card2.copy", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 02 \u8bf4\u660e", selector: "[data-about-evidence] .evidence-card:nth-child(2) h3 + p", type: "text", default: "Regular participation in automotive exhibitions and business events supports long-term channels, supplier communication, and buyer trust." },
      { key: "about.evidence.card3.image", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 03 \u56fe\u7247", selector: "[data-about-evidence] .evidence-card:nth-child(3) img", type: "image", default: "assets/img/about/about-compliance-records.jpg" },
      { key: "about.evidence.card3.eyebrow", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 03 \u5c0f\u6807\u9898", selector: "[data-about-evidence] .evidence-card:nth-child(3) .eyebrow", type: "text", default: "Risk control" },
      { key: "about.evidence.card3.title", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 03 \u6807\u9898", selector: "[data-about-evidence] .evidence-card:nth-child(3) h3", type: "text", default: "Documents before shipment" },
      { key: "about.evidence.card3.copy", label: "\u73b0\u573a\u8bc1\u636e\u5361\u7247 03 \u8bf4\u660e", selector: "[data-about-evidence] .evidence-card:nth-child(3) h3 + p", type: "text", default: "Export records, customs references, packing lists, invoices, and shipment documents are prepared to reduce risk across the order process." },      { key: "about.credentials.eyebrow", label: "\u8bc1\u4e66\u8def\u5f84\u5c0f\u6807\u9898", selector: "[data-about-credentials] .section-heading .eyebrow", type: "text", default: "Credential review path" },
      { key: "about.credentials.title", label: "\u8bc1\u4e66\u8def\u5f84\u4e3b\u6807\u9898", selector: "[data-about-credentials] .section-heading h2", type: "text", default: "Main certificates are centralized on the homepage Credentials section." },
      { key: "about.credentials.copy", label: "\u8bc1\u4e66\u8def\u5f84\u8bf4\u660e", selector: "[data-about-credentials] .section-heading p:not(.eyebrow)", type: "text", default: "About V-Star introduces the company background; the certificate gallery keeps formal documents in one review area for easier buyer due diligence." },
      { key: "about.credentials.image", label: "\u8bc1\u4e66\u5927\u56fe", selector: "[data-about-credentials] .about-wide-image img", type: "image", default: "assets/img/about/about-certificates.jpg" },
      { key: "about.credentials.item1.title", label: "\u8bc1\u4e66\u5c0f\u9879 01 \u6807\u9898", selector: "[data-about-credentials] .process-grid article:nth-child(1) h3", type: "text", default: "Company entity" },
      { key: "about.credentials.item1.copy", label: "\u8bc1\u4e66\u5c0f\u9879 01 \u8bf4\u660e", selector: "[data-about-credentials] .process-grid article:nth-child(1) p", type: "text", default: "Business license and registered entity information support contract review." },
      { key: "about.credentials.item2.title", label: "\u8bc1\u4e66\u5c0f\u9879 02 \u6807\u9898", selector: "[data-about-credentials] .process-grid article:nth-child(2) h3", type: "text", default: "Manufacturer codes" },
      { key: "about.credentials.item2.copy", label: "\u8bc1\u4e66\u5c0f\u9879 02 \u8bf4\u660e", selector: "[data-about-credentials] .process-grid article:nth-child(2) p", type: "text", default: "Manufacturer code and WMI materials identify the vehicle business scope." },
      { key: "about.credentials.item3.title", label: "\u8bc1\u4e66\u5c0f\u9879 03 \u6807\u9898", selector: "[data-about-credentials] .process-grid article:nth-child(3) h3", type: "text", default: "Quality system" },
      { key: "about.credentials.item3.copy", label: "\u8bc1\u4e66\u5c0f\u9879 03 \u8bf4\u660e", selector: "[data-about-credentials] .process-grid article:nth-child(3) p", type: "text", default: "Quality management certification supports production and sales management review." },
      { key: "about.credentials.item4.title", label: "\u8bc1\u4e66\u5c0f\u9879 04 \u6807\u9898", selector: "[data-about-credentials] .process-grid article:nth-child(4) h3", type: "text", default: "Document check" },
      { key: "about.credentials.item4.copy", label: "\u8bc1\u4e66\u5c0f\u9879 04 \u8bf4\u660e", selector: "[data-about-credentials] .process-grid article:nth-child(4) p", type: "text", default: "Open Credentials to review the certificate images." },
      { key: "about.service.eyebrow", label: "\u670d\u52a1\u4f18\u52bf\u5c0f\u6807\u9898", selector: "[data-about-service] .section-heading .eyebrow", type: "text", default: "Service advantages" },
      { key: "about.service.title", label: "\u670d\u52a1\u4f18\u52bf\u4e3b\u6807\u9898", selector: "[data-about-service] .section-heading h2", type: "text", default: "Fujian-based sourcing gives buyers practical delivery and after-sales support." },
      { key: "about.service.item1.title", label: "\u670d\u52a1\u4f18\u52bf 01 \u6807\u9898", selector: "[data-about-service] .process-grid article:nth-child(1) h3", type: "text", default: "First-hand sourcing" },
      { key: "about.service.item1.copy", label: "\u670d\u52a1\u4f18\u52bf 01 \u8bf4\u660e", selector: "[data-about-service] .process-grid article:nth-child(1) p", type: "text", default: "Direct links to mainstream vehicle supply help improve dispatch speed, pricing control, and model availability." },
      { key: "about.service.item2.title", label: "\u670d\u52a1\u4f18\u52bf 02 \u6807\u9898", selector: "[data-about-service] .process-grid article:nth-child(2) h3", type: "text", default: "Multilingual response" },
      { key: "about.service.item2.copy", label: "\u670d\u52a1\u4f18\u52bf 02 \u8bf4\u660e", selector: "[data-about-service] .process-grid article:nth-child(2) p", type: "text", default: "International sales and after-sales communication can support fast buyer follow-up across different time zones." },
      { key: "about.service.item3.title", label: "\u670d\u52a1\u4f18\u52bf 03 \u6807\u9898", selector: "[data-about-service] .process-grid article:nth-child(3) h3", type: "text", default: "Sales material support" },
      { key: "about.service.item3.copy", label: "\u670d\u52a1\u4f18\u52bf 03 \u8bf4\u660e", selector: "[data-about-service] .process-grid article:nth-child(3) p", type: "text", default: "Model photos, short videos, and reference configuration materials can support local promotion before bulk purchase." },
      { key: "about.service.item4.title", label: "\u670d\u52a1\u4f18\u52bf 04 \u6807\u9898", selector: "[data-about-service] .process-grid article:nth-child(4) h3", type: "text", default: "Flexible settlement" },
      { key: "about.service.item4.copy", label: "\u670d\u52a1\u4f18\u52bf 04 \u8bf4\u660e", selector: "[data-about-service] .process-grid article:nth-child(4) p", type: "text", default: "Multiple cross-border payment and settlement arrangements can be discussed according to country and order structure." },
      { key: "about.customization.image", label: "\u8f66\u8f86\u5b9a\u5236\u56fe\u7247", selector: "[data-about-customization] .split-media img", type: "image", default: "assets/img/about/about-customization-upgrade.jpg" },
      { key: "about.customization.eyebrow", label: "\u8f66\u8f86\u5b9a\u5236\u5c0f\u6807\u9898", selector: "[data-about-customization] .split-copy .eyebrow", type: "text", default: "Vehicle customization" },
      { key: "about.customization.title", label: "\u8f66\u8f86\u5b9a\u5236\u4e3b\u6807\u9898", selector: "[data-about-customization] .split-copy h2", type: "text", default: "Customization and upgrade services are available for suitable export models." },
      { key: "about.customization.copy1", label: "\u8f66\u8f86\u5b9a\u5236\u8bf4\u660e 1", selector: "[data-about-customization] .split-copy p:nth-of-type(2)", type: "text", default: "V-Star also supports vehicle customization experience, including exterior kits, interior changes, and selected smart configuration upgrades." },
      { key: "about.customization.copy2", label: "\u8f66\u8f86\u5b9a\u5236\u8bf4\u660e 2", selector: "[data-about-customization] .split-copy p:nth-of-type(3)", type: "text", default: "Customization scope should be confirmed by model, destination market, export standard, and final order quantity before quotation." },
      ],
    },
    {
      id: "afterSales",
      page: "after-sales",
      label: "售后服务页",
      url: "after-sales.html",
      fields: [
        { key: "afterSales.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "After-sales support" },
        { key: "afterSales.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Export after-sales workflow from first contact to case closure." },
        { key: "afterSales.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "Built for overseas dealers, importers, and fleet buyers who need a clear path for vehicle issues after shipment." },
        { key: "afterSales.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/client-visit.jpg" },
      ],
    },
    {
      id: "portLogistics",
      page: "port-logistics",
      label: "港口物流页",
      url: "port-logistics.html",
      fields: [
        { key: "port.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "Port logistics" },
        { key: "port.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Track vehicle export handover and port movement status." },
        { key: "port.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "Enter a V-Star freight order, booking, bill of lading, or container reference to review the latest logistics checkpoint." },
        { key: "port.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/map-ports.jpg" },
        { key: "port.lookup.eyebrow", label: "查询区小标题", selector: ".logistics-query-section > .section-heading .eyebrow", type: "text", default: "Logistics tracking" },
        { key: "port.lookup.title", label: "查询区标题", selector: ".logistics-query-section > .section-heading h2", type: "text", default: "Port logistics information lookup" },
        { key: "port.lookup.copy", label: "查询区说明", selector: ".logistics-query-section > .section-heading > p", type: "text", default: "This demo query area is structured like ocean-carrier tracking tools. It can later connect to real carrier, freight forwarder, or internal V-Star order data." },
        { key: "port.scope.image", label: "底部说明图", selector: ".split-section .split-media img", type: "image", default: "assets/img/customs-doc.jpg" },
        { key: "port.scope.title", label: "底部说明标题", selector: ".split-section .split-copy h2", type: "text", default: "Designed for export orders before a full logistics API is connected." },
        { key: "port.scope.copy", label: "底部说明文字", selector: ".split-section .split-copy p:not(.eyebrow)", type: "text", default: "The page first works as a professional tracking interface for V-Star order updates. When a real shipment is confirmed, the same page can link carrier tracking, container events, and internal order notes." },
      ],
    },
    {
      id: "partsSupport",
      page: "parts-support",
      label: "零件支持页",
      url: "parts-support.html",
      fields: [
        { key: "parts.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "Parts support" },
        { key: "parts.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Search common damaged-part stock for current website models." },
        { key: "parts.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "Reference inventory and indicative export prices help buyers estimate after-sales parts needs before confirming a service order." },
        { key: "parts.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/factory-vehicles.jpg" },
        { key: "parts.library.eyebrow", label: "零件库小标题", selector: ".page-main > .section:nth-of-type(2) .section-heading .eyebrow", type: "text", default: "Parts library" },
        { key: "parts.library.title", label: "零件库标题", selector: ".page-main > .section:nth-of-type(2) .section-heading h2", type: "text", default: "Common damaged parts and reference prices." },
        { key: "parts.library.copy", label: "零件库说明", selector: ".section .section-heading.spread > p", type: "text", default: "Final price, package weight, compatibility, and delivery timing must be confirmed by VIN, destination country, and current supplier stock." },
        { key: "parts.process.title", label: "流程标题", selector: ".muted-band .section-heading h2", type: "text", default: "Parts support is handled as a controlled export order." },
      ],
    },
    {
      id: "warranty",
      page: "warranty-coordination",
      label: "保修协调页",
      url: "warranty-coordination.html",
      fields: [
        { key: "warranty.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "Warranty coordination" },
        { key: "warranty.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Draft warranty terms for exported vehicle orders." },
        { key: "warranty.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "A practical agreement framework for B2B export orders. Final wording should be reviewed against the destination market and signed contract." },
        { key: "warranty.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/customs-doc.jpg" },
        { key: "warranty.draft.eyebrow", label: "协议区小标题", selector: ".wide-heading .eyebrow", type: "text", default: "Draft agreement" },
        { key: "warranty.draft.title", label: "协议区标题", selector: ".wide-heading h2", type: "text", default: "Export Vehicle Warranty Coordination Agreement" },
        { key: "warranty.draft.copy", label: "协议区说明", selector: ".wide-heading p:not(.eyebrow)", type: "text", default: "This page is a business draft for negotiation. It does not replace legal review by the buyer, importer, local counsel, or destination-market compliance adviser." },
        {
          key: "warranty.agreement.items",
          label: "保修协议条款",
          selector: ".agreement-shell",
          type: "agreementList",
          default: JSON.stringify(
            [
              { title: "1. Parties and order scope", text: "This agreement applies to vehicles exported by V-Star Auto under the confirmed sales contract, commercial invoice, packing list, and VIN list. The covered buyer, destination country, vehicle model, quantity, Incoterms, and delivery route must be written in the signed order documents." },
              { title: "2. Warranty coordination role", text: "V-Star Auto coordinates communication, evidence review, supplier feedback, parts sourcing, and technical support. Unless separately agreed in writing, V-Star Auto does not replace the destination-market importer, local repair workshop, insurer, or statutory consumer-service provider." },
              { title: "3. Warranty period", text: "The standard coordination period should be stated per order, such as 12 months from export handover or a defined mileage limit, whichever comes first. OEM warranty, local registration rules, and mandatory destination-market warranty obligations may override or supplement this clause." },
              { title: "4. Covered issues", text: "Coverage may include verified manufacturing defects in major assemblies or parts supplied under the confirmed order. Coverage does not automatically include consumables, normal wear, accident damage, misuse, overload, unauthorized modification, poor maintenance, unsuitable fuel or charging conditions, or damage caused by local transport after handover." },
              { title: "5. Claim evidence", text: "The buyer should notify V-Star Auto within seven days after discovering an issue and provide order number, VIN, mileage, photos, video, diagnostic report, maintenance records, and local workshop comments. Parts should not be dismantled or discarded before evidence is recorded unless urgent safety repair is required." },
              { title: "6. Review and response", text: "V-Star Auto should acknowledge a complete claim within two business days and provide an initial assessment or information request within five business days. Complex claims may require supplier inspection, remote diagnostic review, or return of the disputed part where legally and logistically possible." },
              { title: "7. Remedies", text: "Approved remedies may include technical guidance, replacement parts, partial repair-cost support, commercial credit, supplier escalation, or other written settlement. Consequential losses, downtime, lost profit, local penalties, and indirect costs are excluded unless mandatory law or the signed contract requires otherwise." },
              { title: "8. Parts logistics and costs", text: "Replacement parts should be confirmed by VIN and part photos. Unless agreed otherwise, buyer is responsible for local labor, import duties, local taxes, and destination customs clearance. V-Star Auto coordinates export packing, part invoice, and shipment reference after solution approval." },
              { title: "9. Compliance and governing terms", text: "The final agreement should identify governing law, dispute forum, language priority, Incoterms, destination-market warranty obligations, and any mandatory product liability rules. If a conflict exists between this draft and mandatory law, mandatory law should prevail." },
              { title: "10. Signature block", text: "Seller: Fujian Rontai V-Star Automobile Industry Co., Ltd. Buyer: [Buyer legal name]. Vehicle order: [Contract / invoice / VIN list]. Effective date: [Date]. Authorized signatures: [Seller] / [Buyer]." },
            ],
            null,
            2
          ),
          itemFields: [
            ["title", "条款标题"],
            ["text", "条款内容"],
          ],
        },
      ],
    },
    {
      id: "technicalGuidance",
      page: "technical-guidance",
      label: "技术指导页",
      url: "technical-guidance.html",
      fields: [
        { key: "technical.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "Technical guidance" },
        { key: "technical.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Contact V-Star technical support for exported vehicle issues." },
        { key: "technical.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "Send VIN, order number, photos, video, and diagnostic notes before arranging parts or warranty coordination." },
        { key: "technical.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/inspection.jpg" },
        { key: "technical.contact.eyebrow", label: "联系区小标题", selector: ".support-contact-layout .contact-copy .eyebrow", type: "text", default: "Fast contact" },
        { key: "technical.contact.title", label: "联系区标题", selector: ".support-contact-layout .contact-copy h2", type: "text", default: "Use WhatsApp or phone for urgent technical triage." },
        { key: "technical.contact.copy", label: "联系区说明", selector: ".support-contact-layout .contact-copy > p:not(.eyebrow)", type: "text", default: "For faster support, send the issue summary and evidence in one message. V-Star will classify the case and guide the next step." },
        { key: "technical.phone", label: "电话 / WhatsApp", selector: ".contact-list p:nth-child(1) span", type: "text", default: "+86 13852965434" },
        { key: "technical.email", label: "邮箱", selector: ".contact-list p:nth-child(3) span", type: "text", default: "1321829600@qq.com" },
      ],
    },
    {
      id: "news",
      label: "新闻活动页",
      url: "news.html",
      fields: [
        { key: "news.hero.eyebrow", label: "页面 Banner 小标题", selector: ".page-hero .eyebrow", type: "text", default: "News center" },
        { key: "news.hero.title", label: "页面 Banner 主标题", selector: ".page-hero h1", type: "text", default: "Recent activities and important company events." },
        { key: "news.hero.subtitle", label: "页面 Banner 副标题", selector: ".page-hero p:not(.eyebrow)", type: "text", default: "Exhibitions, client visits, export milestones, and cooperation updates from V-Star Auto." },
        { key: "news.hero.image", label: "顶部背景图（页面 Banner 图）", selector: ".page-hero img", type: "image", default: "assets/img/news/venezuelan-delegation/cover.jpg" },
        { key: "news.activity.eyebrow", label: "活动区小标题", selector: ".section-tight .section-heading .eyebrow", type: "text", default: "Activity log" },
        { key: "news.activity.title", label: "活动区标题", selector: ".section-tight .section-heading h2", type: "text", default: "Company activity shown with buyer relevance." },
        { key: "news.activity.copy", label: "活动区说明", selector: ".section-tight .section-heading p:not(.eyebrow)", type: "text", default: "These updates focus on what overseas buyers care about: site visits, export preparation, cooperation proof, and operating consistency." },
        {
          key: "news.article.cards",
          label: "新闻活动卡片",
          selector: ".article-grid",
          type: "articleList",
          default: JSON.stringify(
            [
              {
                src: "assets/img/news/venezuelan-delegation/cover.jpg",
                mobileSrc: "assets/img/news/venezuelan-delegation/cover-mobile.jpg",
                alt: "Venezuelan business delegation group photo at V-Star Auto",
                eyebrow: "Industrial inspection / International exchange",
                title: "Venezuelan Business Delegation Visits Our Company for Industrial Inspection and Exchange",
                text: "A nearly 30-member Venezuelan business delegation visited V-Star Auto to understand company development, automotive export services, and future cooperation opportunities.",
                href: "news-venezuelan-business-delegation.html",
                featured: "true",
              },
              { src: "assets/img/expo-booth.jpg", alt: "V-Star Auto at a domestic automotive exhibition", eyebrow: "Exhibition / Channel development", title: "V-Star Auto meets industry partners and overseas channels.", text: "Exhibition participation helps the team maintain brand contact, model updates, and supply discussions with upstream and overseas partners." },
              { src: "assets/img/client-visit.jpg", alt: "International clients visiting V-Star Auto factory", eyebrow: "Client visit / On-site inspection", title: "International buyers inspect vehicles at the Fujian base.", text: "Visitors can review sample vehicles, discuss target models, confirm order documents, and evaluate the team before shipment." },
              { src: "assets/img/press-event.jpg", alt: "Strategic cooperation event", eyebrow: "Cooperation / Supply capability", title: "Vehicle business cooperation supports larger sourcing demand.", text: "Strategic cooperation materials are used as proof points when buyers evaluate order capacity, supply stability, and long-term service capability." },
              { src: "assets/img/event-award.jpg", alt: "V-Star Auto award and recognition", eyebrow: "Milestone / Compliance operation", title: "Recognized operations and continuous market expansion.", text: "Company milestones, credentials, and delivery records help buyers see that V-Star Auto is operated as a long-term export partner." },
            ],
            null,
            2
          ),
          itemFields: [
            ["src", "图片"],
            ["mobileSrc", "手机图（可选）"],
            ["alt", "图片说明"],
            ["eyebrow", "小标题"],
            ["title", "标题"],
            ["text", "说明"],
            ["href", "链接"],
            ["featured", "是否大图 true/false"],
          ],
        },
      ],
    },
    {
      id: "newsDetail",
      page: "news-detail",
      label: "委内瑞拉新闻详情页",
      url: "news-venezuelan-business-delegation.html",
      fields: [
        { key: "news.feature.eyebrow", label: "委内瑞拉新闻详情小标题", selector: "[data-news-feature-eyebrow]", type: "text", default: "Industrial inspection / International exchange" },
        { key: "news.feature.title", label: "委内瑞拉新闻详情标题", selector: "[data-news-feature-title]", type: "text", default: "Venezuelan Business Delegation Visits Our Company for Industrial Inspection and Exchange" },
        { key: "news.feature.intro", label: "委内瑞拉新闻详情简介", selector: "[data-news-feature-intro]", type: "text", default: "A nearly 30-member Venezuelan business delegation visited V-Star Auto for company introduction, vehicle display review, and cooperation discussion." },
        { key: "news.feature.cover", label: "委内瑞拉新闻封面图", selector: "[data-news-feature-cover]", type: "image", default: "assets/img/news/venezuelan-delegation/cover.jpg" },
        {
          key: "news.feature.body",
          label: "委内瑞拉新闻正文",
          selector: "[data-news-feature-body]",
          type: "paragraphText",
          default:
            "Recently, a business delegation from Venezuela comprising nearly 30 members visited Fuzhou to conduct an industrial inspection and enterprise exchange program, under the coordinated arrangement of relevant Chinese commerce authorities and local institutions. The delegation was mainly composed of government and commerce system representatives, with the purpose of gaining an on-site understanding of China's industrial development and exploring potential opportunities for future economic and trade cooperation.\n\nDuring the visit, the delegation conducted an on-site inspection at our company. We provided an overview of our overall corporate development, business layout, and capabilities in automotive export services, with a focus on vehicle supply systems and international market cooperation models. The delegation then toured our exhibition hall and related display areas to gain a detailed understanding of our current operations and product offerings.\n\nBoth sides held preliminary discussions on automotive export and regional market cooperation. The exchange was conducted in a friendly and pragmatic atmosphere, with the delegation expressing interest in the company's operational model and international service capabilities.\n\nAt the conclusion of the visit, both parties took a group photograph, marking the end of a constructive exchange and laying a foundation for further mutual understanding and potential future cooperation.",
        },
        {
          key: "news.feature.gallery",
          label: "委内瑞拉新闻内容图片",
          selector: "[data-news-feature-gallery]",
          type: "newsGalleryList",
          default: JSON.stringify(
            [
              { src: "assets/img/news/venezuelan-delegation/inspection-01.jpg", alt: "Venezuelan delegation inspecting vehicles at V-Star Auto", title: "Vehicle display area inspection" },
              { src: "assets/img/news/venezuelan-delegation/inspection-02.jpg", alt: "V-Star Auto presenting company information to the Venezuelan delegation", title: "Company introduction and exchange session" },
              { src: "assets/img/news/venezuelan-delegation/inspection-03.jpg", alt: "Venezuelan delegation discussing automotive export cooperation with V-Star Auto", title: "On-site business communication" },
              { src: "assets/img/news/venezuelan-delegation/inspection-04.jpg", alt: "V-Star Auto team introducing business operations to the delegation", title: "Operational model briefing" },
              { src: "assets/img/news/venezuelan-delegation/inspection-05.jpg", alt: "Venezuelan delegation listening to V-Star Auto service introduction", title: "Automotive export service introduction" },
              { src: "assets/img/news/venezuelan-delegation/inspection-06.jpg", alt: "Delegation members reviewing vehicle customization and display materials", title: "Display area review" },
              { src: "assets/img/news/venezuelan-delegation/inspection-07.jpg", alt: "Vehicle interior discussion during the Venezuelan delegation visit", title: "Vehicle interior discussion" },
              { src: "assets/img/news/venezuelan-delegation/inspection-08.jpg", alt: "V-Star Auto presentation during Venezuelan business delegation visit", title: "International cooperation discussion" },
              { src: "assets/img/news/venezuelan-delegation/inspection-09.jpg", alt: "Delegation inspecting vehicle display hall at V-Star Auto", title: "Exhibition hall visit" },
              { src: "assets/img/news/venezuelan-delegation/inspection-10.jpg", alt: "Delegation member reviewing vehicle cabin during the company visit", title: "Vehicle cabin review" },
            ],
            null,
            2
          ),
          itemFields: [
            ["src", "图片"],
            ["alt", "图片说明"],
            ["title", "图片标题"],
            ["text", "补充说明"],
          ],
        },
      ],
    },
    {
      id: "vehicleDetailTemplate",
      page: "vehicle-detail",
      label: "车型详情模板",
      url: "vehicle-detail.html",
      fields: [
        { key: "vehicleDetail.highlights.title", label: "核心亮点标题", selector: ".vehicle-detail-highlight-heading h2", type: "text", default: "Core highlights" },
        { key: "vehicleDetail.parameters.eyebrow", label: "参数区小标题", selector: ".vehicle-detail-section .section-heading.spread .eyebrow", type: "text", default: "Structured parameters" },
        { key: "vehicleDetail.parameters.title", label: "参数区标题", selector: ".vehicle-detail-section .section-heading.spread h2", type: "text", default: "Model data arranged as webpage content." },
        { key: "vehicleDetail.gallery.eyebrow", label: "图片区小标题", selector: ".vehicle-gallery-heading .eyebrow", type: "text", default: "Reference images" },
        { key: "vehicleDetail.gallery.title", label: "图片区标题", selector: ".vehicle-gallery-heading h2", type: "text", default: "Model banner images extracted from the supplied sheet." },
        { key: "vehicleDetail.gallery.copy", label: "图片区说明", selector: ".vehicle-gallery-heading p:not(.eyebrow)", type: "text", default: "These banners are arranged as full-width visual sections so the model page reads like a product page, not a poster image pasted into the page." },
        { key: "vehicleDetail.interior.eyebrow", label: "内饰图区小标题", selector: ".vehicle-interior-heading .eyebrow", type: "text", default: "Interior reference" },
        { key: "vehicleDetail.interior.title", label: "内饰图区标题", selector: ".vehicle-interior-heading h2", type: "text", default: "Interior images for cabin, seats, controls, and trim." },
        { key: "vehicleDetail.interior.copy", label: "内饰图区说明", selector: ".vehicle-interior-heading p:not(.eyebrow)", type: "text", default: "Add six to nine interior reference images for buyers who need cabin materials, seat layout, dashboard controls, and trim confirmation before placing an inquiry." },
        { key: "vehicleDetail.exteriorColors.title", label: "外观颜色标题", selector: "[data-detail-exterior-color-block] h2", type: "text", default: "Exterior Colors" },
        { key: "vehicleDetail.interiorColors.title", label: "内饰颜色标题", selector: "[data-detail-interior-color-block] h2", type: "text", default: "Interior Colors" },
        { key: "vehicleDetail.colors.disclaimer", label: "颜色说明", selector: "[data-detail-color-disclaimer]", type: "text", default: "Colors are for reference only. Actual available vehicles shall prevail." },
        { key: "vehicleDetail.cta.title", label: "底部 CTA 标题", selector: ".final-cta h2", type: "text", default: "Send the target model, quantity, and destination country." },
      ],
    },
    {
      id: "contact",
      label: "联系方式页",
      url: "contact.html",
      fields: [
        { key: "contact.title", label: "联系页主标题", selector: ".contact-copy h1", type: "text", default: "Send your target model, quantity, and destination country." },
        { key: "contact.copy", label: "联系页说明", selector: ".contact-copy > p:not(.eyebrow)", type: "text", default: "Our multilingual team will respond with availability, sourcing suggestions, export process details, and next steps." },
        { key: "contact.phone", label: "热线电话", selector: ".contact-list p:nth-child(1) span", type: "text", default: "400-1622-789 / +86 13852965434" },
        { key: "contact.email", label: "邮箱", selector: ".contact-list p:nth-child(2) span", type: "text", default: "1321829600@qq.com" },
        { key: "contact.address", label: "地址", selector: ".contact-list p:nth-child(3) span", type: "text", default: "No. 20 Liang'an Road, Minhou County, Fuzhou City, Fujian Province, China" },
        { key: "contact.checklist.title", label: "询盘清单标题", selector: ".muted-band .section-heading h2", type: "text", default: "Send a complete request and receive a more useful reply." },
        { key: "contact.checklist.copy", label: "询盘清单说明", selector: ".muted-band .section-heading p:not(.eyebrow)", type: "text", default: "A structured inquiry helps the team check real stock, export restrictions, documents, and delivery routes before quoting." },
        { key: "contact.return.image", label: "回复说明图片", selector: ".split-section .split-media img", type: "image", default: "assets/img/customs-doc.jpg" },
        { key: "contact.return.title", label: "回复说明标题", selector: ".split-section .split-copy h2", type: "text", default: "A reply should help you decide the next step." },
        { key: "contact.return.copy", label: "回复说明文字", selector: ".split-section .split-copy p:not(.eyebrow)", type: "text", default: "Based on the inquiry, V-Star Auto can respond with model availability, reference price, configuration notes, photo material, export document direction, port route suggestions, and the information still needed before contract." },
      ],
    },
  ];

  function readOverrides() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
      return mergeOverrides(currentDefaultOverrides(), sanitizeOverrides(stored));
    } catch (_error) {
      return clone(currentDefaultOverrides()) || {};
    }
  }

  function orderVehiclesById(vehicles, vehicleOrder) {
    if (!Array.isArray(vehicles) || !Array.isArray(vehicleOrder) || !vehicleOrder.length) return vehicles;
    const byId = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
    const used = new Set();
    const ordered = [];
    vehicleOrder.forEach((id) => {
      if (!byId.has(id) || used.has(id)) return;
      ordered.push(byId.get(id));
      used.add(id);
    });
    vehicles.forEach((vehicle) => {
      if (used.has(vehicle.id)) return;
      ordered.push(vehicle);
    });
    return ordered;
  }

  function mergeVehicleOverrides() {
    const overrides = readOverrides();
    const vehicleOverrides = overrides.vehicles || {};
    if (!window.VSTAR_VEHICLES) return;

    function isLegacyAdminGallerySrc(src) {
      return typeof src === "string" && src.includes("assets/img/admin/vehicles/") && src.includes("-gallery-");
    }

    function hasUsableGalleryImage(gallery) {
      return (
        Array.isArray(gallery) &&
        gallery.some((item) => {
          const src = typeof item === "string" ? item : item && item.src;
          return typeof src === "string" && src.trim();
        })
      );
    }

    function normalizeVehicleGallery(gallery, sourceGallery) {
      if (!Array.isArray(gallery)) return sourceGallery;
      if (!Array.isArray(sourceGallery) || !sourceGallery.length) return gallery;
      if (!hasUsableGalleryImage(gallery)) return sourceGallery;
      return gallery.map((item, index) => {
        if (!item || typeof item !== "object") return item;
        const source = sourceGallery[index];
        if (!source || !isLegacyAdminGallerySrc(item.src)) return item;
        return {
          ...item,
          src: source.src,
          alt: item.alt || source.alt,
        };
      });
    }

    function isFallbackInteriorGallery(gallery) {
      if (!Array.isArray(gallery) || !gallery.length) return true;
      return gallery.every((item) => {
        const src = typeof item === "string" ? item : item && item.src;
        return typeof src === "string" && src.includes("assets/img/vehicles/banners/");
      });
    }

    function normalizeVehicleInteriorGallery(gallery, sourceGallery) {
      if (!Array.isArray(gallery)) return sourceGallery;
      if (Array.isArray(sourceGallery) && sourceGallery.length && !hasUsableGalleryImage(gallery)) return sourceGallery;
      const containsBannerFallback = gallery.some((item) => {
        const src = typeof item === "string" ? item : item && item.src;
        return typeof src === "string" && src.includes("assets/img/vehicles/banners/");
      });
      if ((isFallbackInteriorGallery(gallery) || containsBannerFallback) && Array.isArray(sourceGallery) && sourceGallery.length) {
        return sourceGallery;
      }
      return gallery;
    }

    function hasNonAsciiColorName(colors) {
      return Array.isArray(colors) && colors.some((item) => /[^\u0000-\u007f]/.test((item && item.name) || ""));
    }

    function hasBrokenColorName(colors) {
      return (
        Array.isArray(colors) &&
        colors.some((item) => {
          const name = String((item && item.name) || "");
          return /\?{2,}/.test(name) || /�/.test(name);
        })
      );
    }

    function normalizeVehicleColors(colors, sourceColors) {
      if (!Array.isArray(colors)) return sourceColors;
      if (!Array.isArray(sourceColors) || !sourceColors.length) return colors;
      if (!colors.length) return sourceColors;
      if (hasBrokenColorName(colors)) return sourceColors;
      const colorsHaveNonAscii = hasNonAsciiColorName(colors);
      const sourceHasNonAscii = hasNonAsciiColorName(sourceColors);
      if (colorsHaveNonAscii !== sourceHasNonAscii) {
        return sourceHasNonAscii ? colors : sourceColors;
      }
      return colors;
    }

    const mergedVehicles = window.VSTAR_VEHICLES.map((vehicle) => {
      const patch = vehicleOverrides[vehicle.id];
      if (!patch) return vehicle;
      return {
        ...vehicle,
        ...patch,
        featureCards: Array.isArray(patch.featureCards) ? patch.featureCards : vehicle.featureCards,
        gallery: Array.isArray(patch.gallery) ? normalizeVehicleGallery(patch.gallery, vehicle.gallery) : vehicle.gallery,
        interiorGallery: Array.isArray(patch.interiorGallery)
          ? normalizeVehicleInteriorGallery(patch.interiorGallery, vehicle.interiorGallery)
          : vehicle.interiorGallery,
        exteriorColors: Array.isArray(patch.exteriorColors)
          ? normalizeVehicleColors(patch.exteriorColors, vehicle.exteriorColors)
          : vehicle.exteriorColors,
        interiorColors: Array.isArray(patch.interiorColors)
          ? normalizeVehicleColors(patch.interiorColors, vehicle.interiorColors)
          : vehicle.interiorColors,
      };
    });
    window.VSTAR_VEHICLES = orderVehiclesById(mergedVehicles, overrides.vehicleOrder);
  }

  function setField(field, value) {
    document.querySelectorAll(field.selector).forEach((element) => {
      if (field.type === "imageList" && field.key === "home.hero.slides") {
        renderHomeHeroSlides(element, value);
        return;
      }
      if (field.type === "cardList" && field.key === "home.activity.cards") {
        renderActivityCards(element, value);
        return;
      }
      if (field.type === "vehiclePreviewList") {
        renderHomeVehicleCards(element, value);
        return;
      }
      if (field.type === "articleList") {
        renderArticleCards(element, value);
        return;
      }
      if (field.type === "newsGalleryList") {
        renderNewsGalleryCards(element, value);
        return;
      }
      if (field.type === "agreementList") {
        renderAgreementItems(element, value);
        return;
      }
      if (field.type === "paragraphText") {
        renderParagraphText(element, value);
        return;
      }
      if (field.type === "image") {
        setImageSource(element, value);
        element.removeAttribute("data-remote");
        return;
      }
      if (field.type === "poster") {
        if (!isLocalAssetRef(value)) {
          element.setAttribute("poster", value);
        } else {
          resolveAssetSrc(value).then((src) => element.setAttribute("poster", src || ""));
        }
        return;
      }
      if (field.type === "video") {
        element.setAttribute("src", value);
        const video = element.closest ? element.closest("video") : null;
        if (video && typeof video.load === "function") video.load();
        return;
      }
      element.textContent = value;
    });
  }

  function parseCardList(value) {
    try {
      const items = JSON.parse(value);
      if (!Array.isArray(items)) return [];
      return items.filter((item) => item && typeof item === "object");
    } catch (_error) {
      return [];
    }
  }

  function setupNewsCarousel(container) {
    const carousel = container ? container.closest("[data-news-carousel]") : null;
    if (!carousel || !container) return;
    const prevButton = carousel.querySelector("[data-news-prev]");
    const nextButton = carousel.querySelector("[data-news-next]");
    const sourceCards = Array.from(container.children).filter((card) => card && card.nodeType === 1);
    const baseLength = sourceCards.length;
    if (!baseLength) return;

    const baseCards = sourceCards.map((card) => card.cloneNode(true));
    const state = { trackIndex: baseLength, step: 0, animating: false };
    const desiredSlots = () => {
      if (window.matchMedia("(max-width: 680px)").matches) return 1.18;
      if (window.matchMedia("(max-width: 980px)").matches) return 2.16;
      if (window.matchMedia("(max-width: 1280px)").matches) return 3.18;
      return 4.18;
    };
    const visibleSlots = () => {
      if (baseLength <= 1) return 1;
      return Math.max(1.08, Math.min(desiredSlots(), baseLength - 0.18));
    };
    const setButtonsDisabled = (disabled) => {
      [prevButton, nextButton].forEach((button) => {
        if (button) button.disabled = disabled || baseLength <= 1;
      });
    };
    const updateMetrics = () => {
      const slots = visibleSlots();
      const styles = window.getComputedStyle(container);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const width = container.clientWidth;
      const cardWidth = Math.max(190, (width - gap * (slots - 1)) / slots);
      container.style.setProperty("--news-card-width", `${cardWidth}px`);
      state.step = cardWidth + gap;
    };
    const setTrackPosition = (animate = true) => {
      updateMetrics();
      if (!animate) container.style.transition = "none";
      container.style.transform = `translate3d(${-state.trackIndex * state.step}px, 0, 0)`;
      if (!animate) {
        container.offsetHeight;
        container.style.transition = "";
      }
    };
    const normalizeTrackPosition = () => {
      if (state.trackIndex >= baseLength * 2) {
        state.trackIndex -= baseLength;
        setTrackPosition(false);
      } else if (state.trackIndex < baseLength) {
        state.trackIndex += baseLength;
        setTrackPosition(false);
      }
      state.animating = false;
      carousel.dataset.newsCarouselAnimating = "false";
      setButtonsDisabled(false);
    };
    const renderTrack = () => {
      const logicalIndex = ((state.trackIndex % baseLength) + baseLength) % baseLength;
      state.trackIndex = baseLength + logicalIndex;
      carousel.dataset.newsCarouselIndex = String(logicalIndex);
      container.innerHTML = "";
      container.classList.add("is-loop-track");
      for (let copy = 0; copy < 3; copy += 1) {
        baseCards.forEach((card) => {
          const clone = card.cloneNode(true);
          if (copy !== 1) clone.dataset.newsClone = "true";
          container.append(clone);
        });
      }
      setTrackPosition(false);
      setButtonsDisabled(false);
    };
    const move = (direction) => {
      if (baseLength <= 1 || state.animating || carousel.dataset.newsCarouselAnimating === "true") return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      state.trackIndex += direction;
      carousel.dataset.newsCarouselIndex = String(((state.trackIndex % baseLength) + baseLength) % baseLength);
      if (reduceMotion) {
        setTrackPosition(false);
        normalizeTrackPosition();
        return;
      }
      state.animating = true;
      carousel.dataset.newsCarouselAnimating = "true";
      setButtonsDisabled(true);
      setTrackPosition(true);
    };

    carousel._newsCarouselMove = move;
    carousel._newsCarouselSetTrackPosition = setTrackPosition;
    carousel._newsCarouselNormalize = normalizeTrackPosition;
    if (carousel.dataset.newsCarouselReady !== "true") {
      carousel.dataset.newsCarouselReady = "true";
      if (prevButton) prevButton.addEventListener("click", () => carousel._newsCarouselMove && carousel._newsCarouselMove(-1));
      if (nextButton) nextButton.addEventListener("click", () => carousel._newsCarouselMove && carousel._newsCarouselMove(1));
      container.addEventListener("transitionend", (event) => {
        if (event.target === container && event.propertyName === "transform" && carousel._newsCarouselNormalize) {
          carousel._newsCarouselNormalize();
        }
      });
      window.addEventListener("resize", () => {
        if (carousel._newsCarouselSetTrackPosition) carousel._newsCarouselSetTrackPosition(false);
      });
    }
    renderTrack();
  }

  function renderActivityCards(container, value) {
    const cards = parseCardList(value);
    if (!container || !cards.length) return;
    container.innerHTML = "";
    cards.forEach((card) => {
      const article = document.createElement("article");
      if (card.featured === true || card.featured === "true") article.classList.add("news-card-featured");
      const image = createResponsiveImage(card, "V-Star Auto activity");
      const target = card.href ? document.createElement("a") : document.createDocumentFragment();
      if (card.href) {
        target.className = "news-card-link";
        target.href = card.href;
      }
      if (card.title || card.eyebrow) {
        const body = document.createElement("div");
        body.className = "news-card-body";
        if (card.eyebrow) {
          const eyebrow = document.createElement("p");
          eyebrow.className = "eyebrow";
          eyebrow.textContent = card.eyebrow;
          body.append(eyebrow);
        }
        const title = document.createElement("h3");
        title.textContent = card.title || "";
        const text = document.createElement("p");
        text.textContent = card.text || "";
        body.append(title, text);
        target.append(image, body);
      } else {
        const text = document.createElement("p");
        text.textContent = card.text || "";
        target.append(image, text);
      }
      article.append(target);
      container.append(article);
    });
    setupNewsCarousel(container);
  }

  function renderHomeVehicleCards(container, value) {
    const carousel = container ? container.closest("[data-home-vehicle-carousel]") : null;
    const vehicleItems = (window.VSTAR_VEHICLES || []).slice(0, 7);
    if (carousel && container && vehicleItems.length) {
      const prevButton = carousel.querySelector("[data-home-vehicle-prev]");
      const nextButton = carousel.querySelector("[data-home-vehicle-next]");
      const baseLength = vehicleItems.length;
      const state = carousel._vehicleCarouselState || { trackIndex: baseLength, step: 0, animating: false };
      const visibleSlots = () => {
        if (window.matchMedia("(max-width: 680px)").matches) return 1.16;
        if (window.matchMedia("(max-width: 980px)").matches) return 2.14;
        return 3.22;
      };
      const cardTitle = (vehicle) => {
        const name = vehicle.name || vehicle.fullName || "Vehicle model";
        if (!vehicle.brand || name.toLowerCase().includes(vehicle.brand.toLowerCase())) return name;
        return `${vehicle.brand} ${name}`;
      };
      const cardImage = (vehicle) =>
        vehicle.bannerImage || (vehicle.specImage || "").replace("assets/img/vehicles/", "assets/img/vehicles/banners/");
      const setButtonsDisabled = (disabled) => {
        [prevButton, nextButton].forEach((button) => {
          if (button) button.disabled = disabled;
        });
      };
      const buildCard = (vehicle) => {
        const titleText = cardTitle(vehicle);
        const link = document.createElement("a");
        link.className = "vehicle-preview-card";
        link.href = `vehicle-detail.html?model=${encodeURIComponent(vehicle.id)}`;
        link.setAttribute("aria-label", `View ${titleText} details`);

        const image = document.createElement("img");
        setImageSource(image, cardImage(vehicle) || "");
        image.alt = `${titleText} reference image`;

        const body = document.createElement("div");
        const eyebrow = document.createElement("p");
        eyebrow.className = "eyebrow";
        const title = document.createElement("h3");
        const text = document.createElement("p");
        const action = document.createElement("span");
        eyebrow.textContent = [vehicle.energy, vehicle.type].filter(Boolean).join(" ");
        title.textContent = titleText;
        text.textContent = vehicle.summary || "";
        action.textContent = "View details";
        body.append(eyebrow, title, text, action);
        link.append(image, body);
        return link;
      };
      const updateMetrics = () => {
        const slots = Math.min(visibleSlots(), baseLength);
        carousel.dataset.carouselVisible = String(Math.floor(slots));
        const styles = window.getComputedStyle(container);
        const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
        const width = carousel.clientWidth;
        const cardWidth = Math.max(220, (width - gap * (slots - 1)) / slots);
        container.style.setProperty("--vehicle-card-width", `${cardWidth}px`);
        state.step = cardWidth + gap;
      };
      const setTrackPosition = (animate = true) => {
        updateMetrics();
        if (!animate) {
          container.style.transition = "none";
        }
        container.style.transform = `translate3d(${-state.trackIndex * state.step}px, 0, 0)`;
        if (!animate) {
          container.offsetHeight;
          container.style.transition = "";
        }
      };
      const normalizeTrackPosition = () => {
        if (state.trackIndex >= baseLength * 2) {
          state.trackIndex -= baseLength;
          setTrackPosition(false);
        } else if (state.trackIndex < baseLength) {
          state.trackIndex += baseLength;
          setTrackPosition(false);
        }
        state.animating = false;
        carousel.dataset.carouselAnimating = "false";
        setButtonsDisabled(false);
      };
      const renderTrack = () => {
        const logicalIndex = ((state.trackIndex % baseLength) + baseLength) % baseLength;
        state.trackIndex = baseLength + logicalIndex;
        carousel._vehicleCarouselState = state;
        carousel.dataset.vehicleCarouselIndex = String(logicalIndex);
        container.dataset.manualCards = "true";
        container.innerHTML = "";
        container.classList.remove("is-exiting-next", "is-exiting-prev", "is-entering-next", "is-entering-prev");
        container.classList.add("is-loop-track");
        for (let copy = 0; copy < 3; copy += 1) {
          vehicleItems.forEach((vehicle) => container.append(buildCard(vehicle)));
        }
        setTrackPosition(false);
      };
      const move = (direction) => {
        if (state.animating || carousel.dataset.carouselAnimating === "true") return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        state.trackIndex += direction;
        const logicalIndex = ((state.trackIndex % baseLength) + baseLength) % baseLength;
        carousel.dataset.vehicleCarouselIndex = String(logicalIndex);
        if (reduceMotion) {
          setTrackPosition(false);
          normalizeTrackPosition();
          return;
        }
        state.animating = true;
        carousel.dataset.carouselAnimating = "true";
        setButtonsDisabled(true);
        setTrackPosition(true);
      };
      if (carousel.dataset.carouselReady !== "true") {
        carousel.dataset.carouselReady = "true";
        carousel.dataset.vehicleCarouselIndex = "0";
        if (prevButton) prevButton.addEventListener("click", () => move(-1));
        if (nextButton) nextButton.addEventListener("click", () => move(1));
        let touchStartX = 0;
        let touchStartY = 0;
        const isMobileCarousel = () => window.matchMedia("(max-width: 680px)").matches;
        carousel.addEventListener(
          "touchstart",
          (event) => {
            if (!isMobileCarousel() || !event.touches.length) return;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
          },
          { passive: true }
        );
        carousel.addEventListener(
          "touchend",
          (event) => {
            if (!isMobileCarousel() || !touchStartX || !event.changedTouches.length) return;
            const deltaX = event.changedTouches[0].clientX - touchStartX;
            const deltaY = event.changedTouches[0].clientY - touchStartY;
            touchStartX = 0;
            touchStartY = 0;
            if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
            move(deltaX < 0 ? 1 : -1);
          },
          { passive: true }
        );
        container.addEventListener("transitionend", (event) => {
          if (event.target === container && event.propertyName === "transform") normalizeTrackPosition();
        });
        window.addEventListener("resize", () => setTrackPosition(false));
      }
      renderTrack();
      return;
    }

    const cards = parseCardList(value);
    if (!container || !cards.length) return;
    container.dataset.manualCards = "true";
    container.innerHTML = "";
    cards.forEach((card) => {
      const link = document.createElement("a");
      link.className = "vehicle-preview-card";
      link.href = card.href || "vehicles.html";
      link.setAttribute("aria-label", `View ${card.title || "vehicle"} details`);

      const image = document.createElement("img");
      setImageSource(image, card.src || "");
      image.alt = card.alt || card.title || "V-Star Auto vehicle";

      const body = document.createElement("div");
      const eyebrow = document.createElement("p");
      eyebrow.className = "eyebrow";
      const title = document.createElement("h3");
      const text = document.createElement("p");
      const action = document.createElement("span");
      eyebrow.textContent = card.eyebrow || "";
      title.textContent = card.title || "";
      text.textContent = card.text || "";
      action.textContent = card.action || "View details";
      body.append(eyebrow, title, text, action);
      link.append(image, body);
      container.append(link);
    });
  }

  function renderArticleCards(container, value) {
    const cards = parseCardList(value);
    if (!container || !cards.length) return;
    container.innerHTML = "";
    cards.forEach((card) => {
      const article = document.createElement("article");
      article.className = "article-card";
      if (card.featured === true || card.featured === "true") article.classList.add("article-card-featured");
      const target = card.href ? document.createElement("a") : document.createDocumentFragment();
      if (card.href) target.href = card.href;
      const image = createResponsiveImage(card, card.title || "V-Star Auto activity");
      const body = document.createElement("div");
      const eyebrow = document.createElement("p");
      eyebrow.className = "eyebrow";
      const title = document.createElement("h2");
      const text = document.createElement("p");
      eyebrow.textContent = card.eyebrow || "";
      title.textContent = card.title || "";
      text.textContent = card.text || "";
      body.append(eyebrow, title, text);
      target.append(image, body);
      article.append(target);
      container.append(article);
    });
  }

  function renderNewsGalleryCards(container, value) {
    const cards = parseCardList(value);
    if (!container || !cards.length) return;
    container.innerHTML = "";
    cards.forEach((card) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      setImageSource(image, card.src || "");
      image.alt = card.alt || card.title || "V-Star Auto delegation visit";
      const caption = document.createElement("figcaption");
      caption.textContent = card.title || card.text || "";
      figure.append(image, caption);
      container.append(figure);
    });
  }

  function renderParagraphText(container, value) {
    if (!container) return;
    const paragraphs = String(value || "")
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!paragraphs.length) return;
    container.innerHTML = "";
    paragraphs.forEach((paragraph) => {
      const text = document.createElement("p");
      text.textContent = paragraph;
      container.append(text);
    });
  }

  function renderAgreementItems(container, value) {
    const items = parseCardList(value);
    if (!container || !items.length) return;
    container.innerHTML = "";
    items.forEach((item) => {
      const article = document.createElement("article");
      const title = document.createElement("h3");
      const text = document.createElement("p");
      title.textContent = item.title || "";
      text.textContent = item.text || "";
      article.append(title, text);
      container.append(article);
    });
  }

  function parseImageList(value) {
    try {
      const items = JSON.parse(value);
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => {
          if (typeof item === "string") return { src: item, alt: "V-Star Auto homepage banner" };
          return {
            src: item && typeof item.src === "string" ? item.src.trim() : "",
            mobileSrc: item && typeof item.mobileSrc === "string" ? item.mobileSrc.trim() : "",
            alt: item && typeof item.alt === "string" ? item.alt.trim() : "V-Star Auto homepage banner",
          };
        })
        .filter((item) => item.src);
    } catch (_error) {
      return [];
    }
  }

  function renderHomeHeroSlides(hero, value) {
    const slides = parseImageList(value);
    if (!hero || !slides.length) return;
    hero.querySelectorAll(".hero-slide").forEach((slide) => slide.remove());
    const overlay = hero.querySelector(".hero-overlay");
    slides.forEach((slide, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = `hero-slide${index === 0 ? " is-active" : ""}`;
      const media = createResponsiveImage(slide, "V-Star Auto homepage banner", index === 0 ? { eager: true } : { defer: true });
      wrapper.append(media);
      hero.insertBefore(wrapper, overlay || hero.firstChild);
    });
  }

  function applyFieldOverrides() {
    const overrides = readOverrides();
    const values = overrides.fields || {};
    const currentPage = document.body.dataset.page || "";
    schema.forEach((group) => {
      const targetPage = group.page || group.id;
      if (currentPage && currentPage !== targetPage) return;
      group.fields.forEach((field) => {
        const value = values[field.key];
        if (typeof value === "string" && value.trim()) setField(field, value);
      });
    });
  }

  function applyVehicleCardOverrides() {
    const vehicles = window.VSTAR_VEHICLES || [];
    if (!vehicles.length) return;

    document.querySelectorAll("[data-vehicle-grid]").forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll(".vehicle-card"));
      if (!cards.length) return;
      const cardsById = new Map();
      cards.forEach((card) => {
        const modelLink = card.querySelector('a[href*="vehicle-detail.html?model="]');
        if (!modelLink) return;
        const modelId = new URL(modelLink.href, location.href).searchParams.get("model");
        if (modelId) cardsById.set(modelId, card);
      });
      const used = new Set();
      vehicles.forEach((vehicle) => {
        const card = cardsById.get(vehicle.id);
        if (!card || used.has(card)) return;
        grid.append(card);
        used.add(card);
      });
      cards.forEach((card) => {
        if (used.has(card)) return;
        grid.append(card);
      });
    });

    document.querySelectorAll("[data-vehicle-grid] .vehicle-card").forEach((card) => {
      const modelLink = card.querySelector('a[href*="vehicle-detail.html?model="]');
      if (!modelLink) return;
      const modelId = new URL(modelLink.href, location.href).searchParams.get("model");
      const vehicle = vehicles.find((item) => item.id === modelId);
      if (!vehicle) return;

      const image = card.querySelector(".vehicle-card-media img");
      const title = card.querySelector("h2 a");
      const meta = card.querySelector(".eyebrow");
      const summary = card.querySelector("h2 + p");
      const inquiry = card.querySelector('.vehicle-card-actions a[href*="contact.html"]');
      const banner = vehicle.bannerImage || (vehicle.specImage || "").replace("assets/img/vehicles/", "assets/img/vehicles/banners/");

      if (image && banner) {
        setImageSource(image, banner);
        image.alt = `${vehicle.fullName || vehicle.name} reference image`;
      }
      if (title) title.textContent = vehicle.name || vehicle.fullName;
      if (meta) meta.textContent = [vehicle.brand, vehicle.category, vehicle.energy].filter(Boolean).join(" / ");
      if (summary) summary.textContent = vehicle.summary || "";
      if (inquiry) inquiry.href = `contact.html?vehicle=${encodeURIComponent(vehicle.fullName || vehicle.name || "")}`;
    });

    document.querySelectorAll(".vehicle-preview-card").forEach((card) => {
      const previewContainer = card.closest("[data-home-vehicle-cards]");
      if (previewContainer && previewContainer.dataset.manualCards === "true") return;

      const modelId = new URL(card.href, location.href).searchParams.get("model");
      const vehicle = vehicles.find((item) => item.id === modelId);
      if (!vehicle) return;

      const image = card.querySelector("img");
      const meta = card.querySelector(".eyebrow");
      const title = card.querySelector("h3");
      const summary = card.querySelector("h3 + p");
      const banner = vehicle.bannerImage || (vehicle.specImage || "").replace("assets/img/vehicles/", "assets/img/vehicles/banners/");

      if (image && banner) {
        setImageSource(image, banner);
        image.alt = `${vehicle.fullName || vehicle.name} reference image`;
      }
      if (meta) meta.textContent = [vehicle.energy, vehicle.type].filter(Boolean).join(" ");
      if (title) title.textContent = vehicle.fullName || vehicle.name;
      if (summary) summary.textContent = vehicle.summary || "";
      card.setAttribute("aria-label", `View ${vehicle.fullName || vehicle.name} details`);
    });
  }

  mergeVehicleOverrides();
  window.VSTAR_CONTENT_SCHEMA = schema;
  window.VSTAR_CONTENT_STORAGE_KEY = storageKey;
  window.VSTAR_CONTENT_OVERRIDES = {
    read: readOverrides,
    defaults: currentDefaultOverrides(),
    sanitize: sanitizeOverrides,
    merge: mergeOverrides,
    isLocalAssetRef,
    resolveAssetSrc,
    setImageSource,
    loadDeferredImage,
    localAssets: {
      isRef: isLocalAssetRef,
      resolve: resolveAssetSrc,
      getRecord: getLocalAssetRecord,
      getAll: getAllLocalAssetRecords,
      setImageSource,
      loadDeferredImage,
      storeImageFile: storeLocalImageFile,
    },
    apply: function () {
      applyFieldOverrides();
      applyVehicleCardOverrides();
    },
  };

  function applyWhenReady() {
    window.VSTAR_CONTENT_OVERRIDES.apply();
  }

  if (document.body) {
    applyWhenReady();
  } else {
    window.addEventListener("DOMContentLoaded", applyWhenReady);
  }
})();

