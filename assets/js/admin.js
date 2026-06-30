(function () {
  const storageKey = window.VSTAR_CONTENT_STORAGE_KEY || "vstar-content-overrides";
  const schema = window.VSTAR_CONTENT_SCHEMA || [];
  const vehicles = window.VSTAR_VEHICLES || [];
  const imageLibrary = window.VSTAR_IMAGE_LIBRARY || [];
  const contentTools = window.VSTAR_CONTENT_OVERRIDES || {};
  const localAssets = contentTools.localAssets || {};
  const state = readState();

  const pageSelect = document.querySelector("[data-page-select]");
  const pageForm = document.querySelector("[data-page-form]");
  const pagePreview = document.querySelector("[data-page-preview]");
  const vehicleSelect = document.querySelector("[data-vehicle-select]");
  const vehicleForm = document.querySelector("[data-vehicle-form]");
  const vehiclePreview = document.querySelector("[data-vehicle-preview]");
  const jsonPreview = document.querySelector("[data-json-preview]");
  const settingsForm = document.querySelector("[data-settings-form]");
  const toast = document.querySelector("[data-admin-toast]");

  function readState() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const sanitized = typeof contentTools.sanitize === "function" ? contentTools.sanitize(stored) : stored;
      return typeof contentTools.merge === "function" ? contentTools.merge(contentTools.defaults || {}, sanitized) : sanitized;
    } catch (_error) {
      return typeof contentTools.merge === "function" ? contentTools.merge(contentTools.defaults || {}, {}) : {};
    }
  }

  function normalizeState() {
    state.version = 1;
    state.updatedAt = new Date().toISOString();
    state.fields = state.fields || {};
    state.vehicles = state.vehicles || {};
    state.vehicleOrder = normalizeVehicleOrderValue(state.vehicleOrder);
    state.settings = state.settings || {};
  }

  async function saveState(message) {
    normalizeState();
    try {
      const nextState = typeof contentTools.sanitize === "function" ? contentTools.sanitize(state) : state;
      if (nextState !== state) {
        Object.keys(state).forEach((key) => delete state[key]);
        Object.assign(state, nextState);
      }
      localStorage.setItem(storageKey, JSON.stringify(nextState, null, 2));
      renderJsonPreview();
      showToast(message || "\u5df2\u4fdd\u5b58", 3000);
    } catch (error) {
      console.error("V-Star admin save failed", error);
      showToast(
        isStorageQuotaError(error)
          ? `保存失败：浏览器本地文本存储空间不足。${stateSizeSummary()} 图片已改为路径或本地图片库引用；请减少超长文字内容后重试。`
          : "\u4fdd\u5b58\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u5185\u5bb9\u540e\u91cd\u8bd5",
        8200
      );
    }
  }

  function showToast(message, duration = 2400) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.hidden = true;
    }, duration);
  }

  function confirmDanger(message) {
    return window.confirm(`${message}\n\n此操作只清除后台当前浏览器里的本机修改，确认后才会执行。`);
  }

  function renderJsonPreview() {
    if (jsonPreview) jsonPreview.textContent = JSON.stringify(state, null, 2);
  }

  function findDefaultText(field) {
    if (field.default) return field.default;
    const element = document.querySelector(field.selector);
    if (!element) return "";
    if (field.type === "image") return element.getAttribute("src") || "";
    if (field.type === "poster") return element.getAttribute("poster") || "";
    if (field.type === "video") return element.getAttribute("src") || "";
    return element.textContent.trim();
  }

  function isInlineImage(value) {
    return typeof value === "string" && value.startsWith("data:image/");
  }

  function inlineCharsToApproxBytes(chars) {
    return Math.round((chars || 0) * 0.75);
  }

  function dataUrlApproxBytes(dataUrl) {
    const commaIndex = dataUrl.indexOf(",");
    const payloadLength = commaIndex >= 0 ? dataUrl.length - commaIndex - 1 : dataUrl.length;
    return inlineCharsToApproxBytes(payloadLength);
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
    const units = ["B", "KB", "MB"];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    const precision = value >= 10 || unitIndex === 0 ? 0 : 1;
    return `${value.toFixed(precision)} ${units[unitIndex]}`;
  }

  function formatDimensions(width, height) {
    return width && height ? `${width} x ${height}px` : "\u5c3a\u5bf8\u672a\u77e5";
  }

  function uploadSummary(info) {
    if (info.storedLocally) {
      return `已保存到本地图片库：${formatDimensions(info.original.width, info.original.height)} / ${formatBytes(info.original.bytes)}，JSON 只保存短引用，请点击保存`;
    }
    return `\u5df2\u4f7f\u7528\u539f\u56fe\uff08\u672a\u538b\u7f29\uff09\uff1a${formatDimensions(info.original.width, info.original.height)} / ${formatBytes(info.original.bytes)}\uff0c\u8bf7\u70b9\u51fb\u4fdd\u5b58`;
  }

  function setPreviewSource(preview, value) {
    if (!preview) return;
    if (localAssets && typeof localAssets.setImageSource === "function") {
      localAssets.setImageSource(preview, value || "");
      return;
    }
    preview.src = value || "";
  }

  function largestInlineImageChars(value) {
    if (isInlineImage(value)) return value.length;
    if (Array.isArray(value)) return Math.max(0, ...value.map((item) => largestInlineImageChars(item)));
    if (value && typeof value === "object") return Math.max(0, ...Object.values(value).map((item) => largestInlineImageChars(item)));
    return 0;
  }

  function stateSizeSummary() {
    const stateChars = JSON.stringify(state).length;
    const largestImageChars = largestInlineImageChars(state);
    return `\u5f53\u524d\u6570\u636e\u7ea6 ${formatBytes(stateChars * 2)}\uff0c\u6700\u5927\u56fe\u7247\u7ea6 ${formatBytes(inlineCharsToApproxBytes(largestImageChars))}\u3002`;
  }

  function isStorageQuotaError(error) {
    return Boolean(error && (error.name === "QuotaExceededError" || error.code === 22 || /quota/i.test(error.message || "")));
  }

  function loadInlineImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onerror = () => reject(new Error("图片解析失败"));
      image.onload = () => resolve(image);
      image.src = dataUrl;
    });
  }

  function optimizeImageFile(file) {
    if (localAssets && typeof localAssets.storeImageFile === "function") {
      return localAssets.storeImageFile(file);
    }
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        reject(new Error("\u8bf7\u9009\u62e9\u56fe\u7247\u6587\u4ef6"));
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error("\u56fe\u7247\u8bfb\u53d6\u5931\u8d25"));
      reader.onload = async () => {
        try {
          const image = await loadInlineImage(reader.result);
          resolve({
            dataUrl: reader.result,
            original: { width: image.width, height: image.height, bytes: file.size },
            optimized: { width: image.width, height: image.height, bytes: file.size },
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function parseImageList(value) {
    try {
      const items = JSON.parse(value || "[]");
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => {
          if (typeof item === "string") return { src: item, alt: "V-Star Auto homepage banner" };
          return {
            src: item && typeof item.src === "string" ? item.src.trim() : "",
            alt: item && typeof item.alt === "string" ? item.alt.trim() : "V-Star Auto homepage banner",
          };
        })
        .filter((item) => item.src);
    } catch (_error) {
      return [];
    }
  }

  function imageLibrarySelect(value) {
    const select = document.createElement("select");
    select.innerHTML = '<option value="">从图片库选择...</option>';
    const groups = [...new Set(imageLibrary.map((item) => item.group))];
    groups.forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group;
      imageLibrary
        .filter((item) => item.group === group)
        .forEach((item) => {
          const option = document.createElement("option");
          option.value = item.path;
          option.textContent = `${item.label} - ${item.path}`;
          optgroup.append(option);
        });
      select.append(optgroup);
    });
    select.value = value;
    return select;
  }

  function padIndex(index) {
    return String(index + 1).padStart(2, "0");
  }

  function listItemTitle(item) {
    if (!item || typeof item !== "object") return "";
    return (
      item.title ||
      item.label ||
      item.name ||
      item.eyebrow ||
      item.alt ||
      item.text ||
      item.note ||
      item.src ||
      ""
    );
  }

  function listRowHeading(label, index, item, meta) {
    const heading = document.createElement("div");
    heading.className = "admin-list-row-heading";
    const title = listItemTitle(item);
    const strong = document.createElement("strong");
    strong.textContent = `${label} ${padIndex(index)}`;
    const small = document.createElement("small");
    small.textContent = [title, meta].filter(Boolean).join(" · ");
    heading.append(strong, small);
    return heading;
  }

  function contextCard(title, details) {
    const card = document.createElement("div");
    card.className = "admin-context-card";
    const strong = document.createElement("strong");
    strong.textContent = title;
    const small = document.createElement("small");
    small.textContent = details;
    card.append(strong, small);
    return card;
  }

  function imageListControl(field, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-field admin-field-wide";

    const heading = document.createElement("div");
    heading.className = "admin-image-list-heading";
    heading.innerHTML = `
      <div>
        <strong>${field.label}</strong>
        <small>管理首页实际显示的 Banner 轮播图，可新增、删除、选择图片库或上传本地图片。</small>
      </div>
      <button class="button button-outline" type="button">新增轮播图</button>
    `;

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = field.key;

    const rows = document.createElement("div");
    rows.className = "admin-image-list";
    let slides = parseImageList(value);
    if (!slides.length) slides = [{ src: "", alt: "V-Star Auto homepage banner" }];

    function sync() {
      hidden.value = JSON.stringify(slides.filter((item) => item.src), null, 2);
    }

    function renderRows() {
      rows.innerHTML = "";
      slides.forEach((slide, index) => {
        const row = document.createElement("div");
        row.className = "admin-image-list-row";
        row.append(listRowHeading(field.label || "轮播图", index, slide, "首页 Banner 轮播"));

        const preview = document.createElement("img");
        preview.alt = `首页 Banner ${index + 1} 预览`;
        setPreviewSource(preview, slide.src || "");

        const pathInput = document.createElement("input");
        pathInput.type = "text";
        pathInput.value = slide.src || "";
        pathInput.placeholder = "图片路径或远程图片 URL";

        const altInput = document.createElement("input");
        altInput.type = "text";
        altInput.value = slide.alt || "";
        altInput.placeholder = "图片说明文字";

        const select = imageLibrarySelect(slide.src || "");

        const upload = document.createElement("label");
        upload.className = "admin-upload-control";
        upload.innerHTML = `
          <strong>上传本地图片</strong>
          <input type="file" accept="image/*">
          <span>上传后保留原图到本地图片库，JSON 只保存短引用。正式上线建议放入 assets/img 并改成路径。</span>
        `;
        const fileInput = upload.querySelector("input");

        const removeButton = document.createElement("button");
        removeButton.className = "button button-outline";
        removeButton.type = "button";
        removeButton.textContent = "删除此图";

        function update(nextSrc) {
          slide.src = nextSrc;
          pathInput.value = nextSrc;
          setPreviewSource(preview, nextSrc);
          sync();
        }

        pathInput.addEventListener("input", () => update(pathInput.value.trim()));
        altInput.addEventListener("input", () => {
          slide.alt = altInput.value.trim();
          sync();
        });
        select.addEventListener("change", () => {
          if (!select.value) return;
          update(select.value);
        });
        fileInput.addEventListener("change", async () => {
          const file = fileInput.files && fileInput.files[0];
          if (!file) return;
          try {
            const result = await optimizeImageFile(file);
            update(result.dataUrl);
            showToast(uploadSummary(result), 5600);          } catch (error) {
            showToast(error.message || "图片上传失败");
          }
        });
        removeButton.addEventListener("click", () => {
          slides.splice(index, 1);
          if (!slides.length) slides.push({ src: "", alt: "V-Star Auto homepage banner" });
          sync();
          renderRows();
        });

        const controls = document.createElement("div");
        controls.className = "admin-image-list-controls";
        controls.append(pathInput, altInput, select, upload, removeButton);

        row.append(preview, controls);
        rows.append(row);
      });
      sync();
    }

    heading.querySelector("button").addEventListener("click", () => {
      slides.push({ src: "", alt: "V-Star Auto homepage banner" });
      renderRows();
    });

    renderRows();
    wrapper.append(heading, hidden, rows);
    return wrapper;
  }

  function cardListControl(field, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-field admin-field-wide";
    const itemFields = field.itemFields || [
      ["title", "标题"],
      ["text", "说明"],
    ];
    let items = [];
    try {
      items = JSON.parse(value || "[]");
    } catch (_error) {
      items = [];
    }
    if (!Array.isArray(items) || !items.length) {
      items = [Object.fromEntries(itemFields.map(([key]) => [key, ""]))];
    }

    const heading = document.createElement("div");
    heading.className = "admin-image-list-heading";
    heading.innerHTML = `
      <div>
        <strong>${field.label}</strong>
        <small>${field.help || "同类内容集中在这里修改，保存后前台对应区域会同步更新。"}</small>
      </div>
      <button class="button button-outline" type="button">新增一项</button>
    `;

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = field.key;
    const rows = document.createElement("div");
    rows.className = "admin-image-list";

    function blankItem() {
      return Object.fromEntries(itemFields.map(([key]) => [key, ""]));
    }

    function sync() {
      hidden.value = JSON.stringify(
        items.filter((item) => itemFields.some(([key]) => String(item[key] || "").trim())),
        null,
        2
      );
    }

    function renderRows() {
      rows.innerHTML = "";
      items.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "admin-card-list-row";
        row.append(listRowHeading(field.label || "列表项", index, item, field.key));

        itemFields.forEach(([key, label]) => {
          const fieldLabel = document.createElement("label");
          fieldLabel.textContent = label;
          const input = key === "text" || key === "note" ? document.createElement("textarea") : document.createElement("input");
          input.value = item[key] || "";
          input.placeholder = label;
          input.addEventListener("input", () => {
            item[key] = input.value.trim();
            sync();
          });
          fieldLabel.append(input);
          row.append(fieldLabel);

          if (key === "src") {
            const tools = document.createElement("div");
            tools.className = "admin-image-tools";
            const select = imageLibrarySelect(item[key] || "");
            const preview = document.createElement("img");
            preview.className = "admin-image-preview";
            preview.alt = "图片预览";
            setPreviewSource(preview, item[key] || "");

            const upload = document.createElement("label");
            upload.className = "admin-upload-control";
            upload.innerHTML = `
              <strong>上传本地图片</strong>
              <input type="file" accept="image/*">
              <span>上传后保留原图到本地图片库，JSON 只保存短引用。正式上线建议放入 assets/img 并改成路径。</span>
            `;
            const fileInput = upload.querySelector("input");
            const updateSrc = (nextSrc) => {
              item[key] = nextSrc;
              input.value = nextSrc;
              setPreviewSource(preview, nextSrc);
              sync();
            };
            select.addEventListener("change", () => {
              if (select.value) updateSrc(select.value);
            });
            fileInput.addEventListener("change", async () => {
              const file = fileInput.files && fileInput.files[0];
              if (!file) return;
              try {
                const result = await optimizeImageFile(file);
                updateSrc(result.dataUrl);
                showToast(uploadSummary(result), 5600);              } catch (error) {
                showToast(error.message || "图片上传失败");
              }
            });
            tools.append(select, preview, upload);
            row.append(tools);
          }
        });

        const removeButton = document.createElement("button");
        removeButton.className = "button button-outline";
        removeButton.type = "button";
        removeButton.textContent = "删除此项";
        removeButton.addEventListener("click", () => {
          items.splice(index, 1);
          if (!items.length) items.push(blankItem());
          sync();
          renderRows();
        });
        row.append(removeButton);
        rows.append(row);
      });
      sync();
    }

    heading.querySelector("button").addEventListener("click", () => {
      items.push(blankItem());
      renderRows();
    });
    renderRows();
    wrapper.append(heading, hidden, rows);
    return wrapper;
  }

  function colorListControl(field, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-field admin-field-wide admin-color-list-field";
    let items = [];
    try {
      items = JSON.parse(value || "[]");
    } catch (_error) {
      items = [];
    }

    const normalizeHex = (hex) => {
      const value = String(hex || "").trim();
      if (/^#[0-9a-f]{6}$/i.test(value)) return value.toUpperCase();
      if (/^#[0-9a-f]{3}$/i.test(value)) {
        return `#${value
          .slice(1)
          .split("")
          .map((part) => part + part)
          .join("")}`.toUpperCase();
      }
      return "";
    };
    const colorArray = (item) => {
      const rawColors = item && (item.colors || item.value || item.color);
      const colors = Array.isArray(rawColors)
        ? rawColors
        : String(rawColors || "")
            .split(/[\/,|]/)
            .map((color) => color.trim());
      return colors.map(normalizeHex).filter(Boolean).slice(0, 2);
    };
    const normalizeItem = (item) => {
      const colors = colorArray(item);
      return {
        name: item && (item.name || item.label) ? item.name || item.label : "",
        colors: colors.length ? colors : ["#000000"],
        note: item && item.note ? item.note : "",
      };
    };
    items = Array.isArray(items) && items.length ? items.map(normalizeItem) : [{ name: "", colors: ["#000000"], note: "" }];

    const heading = document.createElement("div");
    heading.className = "admin-image-list-heading";
    heading.innerHTML = `
      <div>
        <strong>${field.label}</strong>
        <small>${field.help || "颜色以正圆显示。双色会在同一个圆内斜向分色，不使用重叠圆。"}</small>
      </div>
      <button class="button button-outline" type="button">新增颜色</button>
    `;

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = field.key;
    const rows = document.createElement("div");
    rows.className = "admin-color-list";

    function swatchBackground(colors) {
      const normalized = colors.map(normalizeHex).filter(Boolean);
      if (!normalized.length) return "#d8d8d8";
      if (normalized.length === 1) return normalized[0];
      return `linear-gradient(135deg, ${normalized[0]} 0 50%, ${normalized[1]} 50% 100%)`;
    }

    function sync() {
      hidden.value = JSON.stringify(
        items
          .map((item) => ({
            name: String(item.name || "").trim(),
            colors: colorArray(item),
            note: String(item.note || "").trim(),
          }))
          .filter((item) => item.name && item.colors.length),
        null,
        2
      );
    }

    function renderRows() {
      rows.innerHTML = "";
      items.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "admin-color-row";
        row.append(listRowHeading(field.label || "颜色", index, item, field.key));

        const swatch = document.createElement("span");
        swatch.className = "admin-color-swatch";
        swatch.setAttribute("aria-hidden", "true");

        const nameLabel = document.createElement("label");
        nameLabel.textContent = "颜色名称";
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = item.name || "";
        nameInput.placeholder = "Black/White";
        nameLabel.append(nameInput);

        const colorFields = document.createElement("div");
        colorFields.className = "admin-color-inputs";

        const buildColorInput = (colorIndex, labelText) => {
          const label = document.createElement("label");
          label.textContent = labelText;
          const group = document.createElement("div");
          group.className = "admin-color-input-row";
          const picker = document.createElement("input");
          picker.type = "color";
          const text = document.createElement("input");
          text.type = "text";
          text.placeholder = colorIndex === 0 ? "#000000" : "可留空";
          const current = normalizeHex(item.colors[colorIndex] || "");
          picker.value = current || "#000000";
          text.value = current;
          const update = (nextValue) => {
            const normalized = normalizeHex(nextValue);
            if (normalized) {
              item.colors[colorIndex] = normalized;
              picker.value = normalized;
              text.value = normalized;
            } else if (colorIndex > 0) {
              item.colors.splice(colorIndex, 1);
              text.value = "";
              picker.value = "#000000";
            }
            item.colors = colorArray(item);
            swatch.style.background = swatchBackground(item.colors);
            sync();
          };
          picker.addEventListener("input", () => update(picker.value));
          text.addEventListener("input", () => update(text.value));
          group.append(picker, text);
          label.append(group);
          return label;
        };

        colorFields.append(buildColorInput(0, "颜色 1"), buildColorInput(1, "颜色 2（双色可选）"));

        const noteLabel = document.createElement("label");
        noteLabel.textContent = "说明";
        const noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.value = item.note || "";
        noteInput.placeholder = "可留空";
        noteLabel.append(noteInput);

        const removeButton = document.createElement("button");
        removeButton.className = "button button-outline";
        removeButton.type = "button";
        removeButton.textContent = "删除颜色";

        const updateSwatch = () => {
          item.colors = colorArray(item);
          swatch.style.background = swatchBackground(item.colors);
        };
        nameInput.addEventListener("input", () => {
          item.name = nameInput.value;
          sync();
        });
        noteInput.addEventListener("input", () => {
          item.note = noteInput.value;
          sync();
        });
        removeButton.addEventListener("click", () => {
          items.splice(index, 1);
          if (!items.length) items.push({ name: "", colors: ["#000000"], note: "" });
          sync();
          renderRows();
        });

        updateSwatch();
        row.append(swatch, nameLabel, colorFields, noteLabel, removeButton);
        rows.append(row);
      });
      sync();
    }

    heading.querySelector("button").addEventListener("click", () => {
      items.push({ name: "", colors: ["#000000"], note: "" });
      renderRows();
    });
    renderRows();
    wrapper.append(heading, hidden, rows);
    return wrapper;
  }

  function fieldControl(field, value) {
    if (field.type === "imageList") return imageListControl(field, value);
    if (field.type === "colorList") return colorListControl(field, value);
    if (
      field.type === "cardList" ||
      field.type === "galleryList" ||
      field.type === "featureCardList" ||
      field.type === "vehiclePreviewList" ||
      field.type === "articleList" ||
      field.type === "newsGalleryList" ||
      field.type === "agreementList"
    ) {
      return cardListControl(field, value);
    }

    const wrapper = document.createElement("div");


    const isImageField = field.type === "image" || field.type === "poster";


    const isLong = !isImageField && (value.length > 80 || field.label.toLowerCase().includes("copy") || field.label.toLowerCase().includes("subtitle"));
    wrapper.className = `admin-field${isLong || isImageField ? " admin-field-wide" : ""}`;

    const label = document.createElement("label");
    label.textContent = field.label;
    const input = isLong ? document.createElement("textarea") : document.createElement("input");
    input.name = field.key;
    input.value = value;
    if (!isLong) input.type = "text";
    label.append(input);
    wrapper.append(label);

    if (isImageField) {
      const tools = document.createElement("div");
      tools.className = "admin-image-tools";

      const select = document.createElement("select");
      select.innerHTML = '<option value="">从图片库选择...</option>';
      const groups = [...new Set(imageLibrary.map((item) => item.group))];
      groups.forEach((group) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = group;
        imageLibrary
          .filter((item) => item.group === group)
          .forEach((item) => {
            const option = document.createElement("option");
            option.value = item.path;
            option.textContent = `${item.label} - ${item.path}`;
            optgroup.append(option);
          });
        select.append(optgroup);
      });
      select.value = value;

      const preview = document.createElement("img");
      preview.className = "admin-image-preview";
      preview.alt = "图片预览";
      setPreviewSource(preview, value);

      const folder = document.createElement("small");
      folder.className = "admin-image-folder";

      const upload = document.createElement("label");
      upload.className = "admin-upload-control";
      upload.innerHTML = `
        <strong>上传本地图片替换</strong>
        <input type="file" accept="image/*">
        <span>上传后保留原图到本地图片库，JSON 只保存短引用。正式上线建议把图片文件放入 assets/img 后再使用路径。</span>
      `;
      const fileInput = upload.querySelector("input");

      function updateImageMeta(nextValue) {
        setPreviewSource(preview, nextValue || "");
        if (localAssets && typeof localAssets.isRef === "function" && localAssets.isRef(nextValue)) {
          folder.textContent = "当前图片保存在浏览器本地图片库，JSON 只保存短引用，不再占用 localStorage 大容量。正式上线前如需固定为根图片，请把原图放入 assets/img 后改用文件路径。";
          return;
        }
        if (nextValue.startsWith("data:image/")) {
          folder.textContent = `\u5f53\u524d\u4f7f\u7528\u7684\u662f\u672c\u5730\u4e0a\u4f20\u56fe\u7247\uff0c\u7ea6 ${formatBytes(dataUrlApproxBytes(nextValue))}\uff0c\u4fdd\u5b58\u5728\u6b64\u6d4f\u89c8\u5668\u3002\u6b63\u5f0f\u4e0a\u7ebf\u524d\u8bf7\u5bfc\u51fa JSON\uff0c\u6216\u628a\u539f\u56fe\u653e\u5165 assets/img \u540e\u6539\u7528\u6587\u4ef6\u8def\u5f84\u3002`;          return;
        }
        const folderPath = nextValue.includes("/") ? nextValue.split("/").slice(0, -1).join("/") : "assets/img";
        folder.textContent = `当前图片位置：${folderPath || "assets/img"}。替换文件时，把新图片放到这个文件夹，再填写对应文件名。`;
      }

      select.addEventListener("change", () => {
        if (!select.value) return;
        input.value = select.value;
        updateImageMeta(select.value);
      });
      input.addEventListener("input", () => updateImageMeta(input.value.trim()));
      fileInput.addEventListener("change", async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        try {
          const result = await optimizeImageFile(file);
          input.value = result.dataUrl;
          select.value = "";
          updateImageMeta(result.dataUrl);
          showToast(uploadSummary(result), 5600);        } catch (error) {
          showToast(error.message || "图片上传失败");
        }
      });
      updateImageMeta(value);

      tools.append(select, preview, upload, folder);
      wrapper.append(tools);
    }

    const note = document.createElement("small");
    note.textContent = isImageField
      ? "\u56fe\u7247\u8def\u5f84\u793a\u4f8b\uff1aassets/img/hero-factory.jpg\u3002\u53ef\u9009\u62e9\u56fe\u7247\u5e93\u3001\u586b\u5199\u8def\u5f84\uff0c\u6216\u4e0a\u4f20\u672c\u5730\u56fe\u7247\u3002"
      : field.type === "video"
        ? "\u89c6\u9891\u8def\u5f84\u793a\u4f8b\uff1aassets/video/company-profile.mp4\u3002\u8bf7\u5148\u628a mp4 \u6587\u4ef6\u653e\u5165 assets/video \u540e\u518d\u586b\u5199\u8def\u5f84\u3002"
        : field.key;
    wrapper.append(note);
    return wrapper;
  }

  function adminSection(title, description, nodes, options = {}) {
    const section = document.createElement("details");
    section.className = "admin-form-section";
    if (options.open !== false) section.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <span>
        <strong>${title}</strong>
        ${description ? `<small>${description}</small>` : ""}
      </span>
    `;
    const body = document.createElement("div");
    body.className = "admin-form-section-body";
    nodes.filter(Boolean).forEach((node) => body.append(node));
    section.append(summary, body);
    return section;
  }

  function formActions(scope, options = {}) {
    const actions = document.createElement("div");
    actions.className = `admin-form-actions${options.sticky ? " admin-form-actions-sticky" : ""}`;
    if (scope === "page") {
      actions.innerHTML = `
        <button class="button button-outline" type="button" data-clear-page>清空本页本机修改</button>
        <button class="button button-dark" type="submit">保存本机预览</button>
      `;
      return actions;
    }
    actions.innerHTML = `
      <button class="button button-outline" type="button" data-clear-vehicle>清空此车型本机修改</button>
      <button class="button button-dark" type="submit">保存本机预览</button>
    `;
    return actions;
  }

  function renderPageForm() {
    if (!pageSelect || !pageForm) return;
    const group = schema.find((item) => item.id === pageSelect.value) || schema[0];
    pagePreview.href = group ? group.url : "index.html";
    pageForm.innerHTML = "";

    pageForm.append(formActions("page", { sticky: true }));
    if (group) {
      pageForm.append(contextCard(`当前页面：${group.label}`, `页面文件：${group.url || "index.html"} · 修改范围：页面图文、图片、列表模块`));
    }
    const pageFields = [];
    (group ? group.fields : []).forEach((field) => {
      const value = state.fields && state.fields[field.key] ? state.fields[field.key] : findDefaultText(field);
      pageFields.push(fieldControl(field, value));
    });
    pageForm.append(
      adminSection(
        "当前页面可编辑内容",
        "前台新增的标题、图片、视频、列表和说明文字会集中在这里。保存按钮固定在上方，不需要滚到底部。",
        pageFields,
        { open: true }
      ),
      formActions("page")
    );
  }

  function currentVehicle() {
    return vehicles.find((vehicle) => vehicle.id === vehicleSelect.value) || vehicles[0];
  }

  function vehiclePatch(vehicle) {
    state.vehicles = state.vehicles || {};
    state.vehicles[vehicle.id] = state.vehicles[vehicle.id] || {};
    return state.vehicles[vehicle.id];
  }

  function normalizeVehicleOrderValue(value) {
    const validIds = vehicles.map((vehicle) => vehicle.id);
    const validSet = new Set(validIds);
    const used = new Set();
    const order = [];
    if (Array.isArray(value)) {
      value.forEach((id) => {
        if (!validSet.has(id) || used.has(id)) return;
        order.push(id);
        used.add(id);
      });
    }
    validIds.forEach((id) => {
      if (used.has(id)) return;
      order.push(id);
    });
    return order;
  }

  function currentVehicleOrder() {
    state.vehicleOrder = normalizeVehicleOrderValue(state.vehicleOrder);
    return state.vehicleOrder;
  }

  function orderedVehicles() {
    const byId = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
    return currentVehicleOrder()
      .map((id) => byId.get(id))
      .filter(Boolean);
  }

  function refreshVehicleSelect(selectedId) {
    if (!vehicleSelect) return;
    const currentId = selectedId || vehicleSelect.value;
    vehicleSelect.innerHTML = "";
    orderedVehicles().forEach((vehicle, index) => {
      const option = document.createElement("option");
      option.value = vehicle.id;
      option.textContent = `${String(index + 1).padStart(2, "0")} - ${vehicle.fullName || vehicle.name}`;
      vehicleSelect.append(option);
    });
    if (currentId && vehicles.some((vehicle) => vehicle.id === currentId)) {
      vehicleSelect.value = currentId;
    }
    if (!vehicleSelect.value && vehicleSelect.options.length) {
      vehicleSelect.value = vehicleSelect.options[0].value;
    }
  }

  async function moveVehicleOrder(id, action) {
    const order = currentVehicleOrder().slice();
    const index = order.indexOf(id);
    if (index < 0) return;
    const [item] = order.splice(index, 1);
    if (action === "up") order.splice(Math.max(0, index - 1), 0, item);
    if (action === "down") order.splice(Math.min(order.length, index + 1), 0, item);
    if (action === "top") order.unshift(item);
    if (action === "bottom") order.push(item);
    state.vehicleOrder = normalizeVehicleOrderValue(order);
    refreshVehicleSelect(id);
    renderVehicleForm();
    await saveState("车型排序已保存");
  }

  function renderVehicleOrderControl(selectedId) {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-field admin-field-wide admin-vehicle-order-field";

    const heading = document.createElement("div");
    heading.className = "admin-vehicle-order-heading";
    heading.innerHTML = `
      <div>
        <strong>车型排序</strong>
        <small>调整后会影响车型展示页顺序，并决定首页车型轮播优先显示的前 7 个车型。</small>
      </div>
    `;

    const list = document.createElement("div");
    list.className = "admin-vehicle-order-list";
    const items = orderedVehicles();
    items.forEach((vehicle, index) => {
      const row = document.createElement("div");
      row.className = `admin-vehicle-order-row${vehicle.id === selectedId ? " is-active" : ""}`;
      row.innerHTML = `
        <span class="admin-vehicle-order-index">${String(index + 1).padStart(2, "0")}</span>
        <button class="admin-vehicle-order-name" type="button" data-vehicle-order-action="select" data-vehicle-order-id="${vehicle.id}">
          <strong>${vehicle.fullName || vehicle.name}</strong>
          <small>${vehicle.id}</small>
        </button>
        <div class="admin-vehicle-order-actions">
          <button type="button" data-vehicle-order-action="top" data-vehicle-order-id="${vehicle.id}"${index === 0 ? " disabled" : ""}>置顶</button>
          <button type="button" data-vehicle-order-action="up" data-vehicle-order-id="${vehicle.id}"${index === 0 ? " disabled" : ""}>上移</button>
          <button type="button" data-vehicle-order-action="down" data-vehicle-order-id="${vehicle.id}"${index === items.length - 1 ? " disabled" : ""}>下移</button>
          <button type="button" data-vehicle-order-action="bottom" data-vehicle-order-id="${vehicle.id}"${index === items.length - 1 ? " disabled" : ""}>置底</button>
        </div>
      `;
      list.append(row);
    });

    wrapper.append(heading, list);
    return wrapper;
  }

  function renderVehicleForm() {
    if (!vehicleSelect || !vehicleForm) return;
    const vehicle = currentVehicle();
    if (!vehicle) return;
    const patch = vehiclePatch(vehicle);
    const hasMeaningfulListItems = (items, keys = ["src", "title", "text", "name"]) =>
      Array.isArray(items) &&
      items.some((item) => {
        if (!item || typeof item !== "object") return false;
        return keys.some((key) => String(item[key] || "").trim());
      });
    const value = (key, fallback) => {
      if (patch[key] === undefined) return fallback || "";
      if (Array.isArray(fallback) && fallback.length) {
        if (!hasMeaningfulListItems(patch[key])) return fallback;
      }
      return patch[key];
    };
    const banner = vehicle.bannerImage || (vehicle.specImage || "").replace("assets/img/vehicles/", "assets/img/vehicles/banners/");
    vehiclePreview.href = `vehicle-detail.html?model=${encodeURIComponent(vehicle.id)}`;
    vehicleForm.innerHTML = "";

    vehicleForm.append(formActions("vehicle", { sticky: true }));
    vehicleForm.append(
      contextCard(
        `当前车型：${vehicle.fullName || vehicle.name}`,
        `${vehicle.id} · ${vehicle.brand || ""} / ${vehicle.category || ""} / ${vehicle.energy || ""} · 修改范围：车型卡片、详情页主图、内饰图、Banner、颜色`
      )
    );
    vehicleForm.append(
      adminSection("车型排序", "控制车型展示页和首页车型轮播的默认顺序。", [renderVehicleOrderControl(vehicle.id)], { open: false })
    );

    const basicFields = [];
    [
      ["name", "车型卡片名称", vehicle.name],
      ["fullName", "详情页完整车型名", vehicle.fullName],
      ["brand", "品牌", vehicle.brand],
      ["category", "车型类别", vehicle.category],
      ["energy", "能源类型", vehicle.energy],
      ["type", "筛选类型", vehicle.type],
      ["use", "用途标签", vehicle.use],
      ["summary", "车型简介", vehicle.summary],
    ].forEach(([key, label, fallback]) => {
      basicFields.push(fieldControl({ key, label, type: "text" }, value(key, fallback)));
    });
    vehicleForm.append(adminSection("车型基础信息", "控制车型卡片、筛选项、详情页标题和简介。", basicFields, { open: true }));

    const imageFields = [
      fieldControl({ key: "bannerImage", label: "车型卡片 / 详情页主图", type: "image" }, value("bannerImage", banner)),
      fieldControl({ key: "specImage", label: "参数资料图片", type: "image" }, value("specImage", vehicle.specImage)),
      fieldControl(
        {
          key: "interiorGallery",
          label: "白底内饰图片区 / 内饰参考图",
          type: "galleryList",
          help: "控制详情页 Interior Reference 白底模块，建议放 6-9 张座舱、中控、座椅和细节图。",
          itemFields: [
            ["src", "图片"],
            ["label", "图片标题"],
            ["note", "图片说明"],
            ["alt", "图片 Alt"],
          ],
        },
        JSON.stringify(value("interiorGallery", vehicle.interiorGallery || []), null, 2)
      ),
      fieldControl(
        {
          key: "gallery",
          label: "黑底图片区 / 车型展示 Banner",
          type: "galleryList",
          help: "只控制详情页黑色背景的 Reference Images 区域。这里放车型海报、外观大图、卖点 Banner，不作为内饰图使用。",
          itemFields: [
            ["src", "图片"],
            ["label", "图片标题"],
            ["note", "图片说明"],
            ["alt", "图片 Alt"],
          ],
        },
        JSON.stringify(value("gallery", vehicle.gallery || []), null, 2)
      ),
    ];
    vehicleForm.append(
      adminSection(
        "车型图片",
        "车型主图、白底内饰图库、黑底展示 Banner 都在这里修改；前台新增图片模块不会再藏在其他位置。",
        imageFields,
        { open: true }
      )
    );

    const colorFields = [
      fieldControl(
        {
          key: "exteriorColors",
          label: "车型外观颜色",
          type: "colorList",
          help: "可视化编辑外观配色。单色显示一个实心正圆；双色显示同一个正圆内的斜向分色。",
          itemFields: [
            ["name", "颜色名称"],
            ["colors", "颜色值"],
            ["note", "说明"],
          ],
        },
        JSON.stringify(value("exteriorColors", vehicle.exteriorColors || []), null, 2)
      ),
      fieldControl(
        {
          key: "interiorColors",
          label: "车型内饰颜色",
          type: "colorList",
          help: "可视化编辑内饰配色。颜色 2 可留空；需要双色时填写第二个 HEX 色值。",
          itemFields: [
            ["name", "颜色名称"],
            ["colors", "颜色值"],
            ["note", "说明"],
          ],
        },
        JSON.stringify(value("interiorColors", vehicle.interiorColors || []), null, 2)
      ),
    ];
    vehicleForm.append(adminSection("车型颜色", "控制详情页外观颜色和内饰颜色，色名请使用英文。", colorFields, { open: true }));

    vehicleForm.append(
      adminSection(
        "车型亮点卡片",
        "控制详情页核心卖点卡片。",
        [
          fieldControl(
            {
              key: "featureCards",
              label: "核心亮点卡片",
              type: "featureCardList",
              itemFields: [
                ["title", "标题"],
                ["text", "说明"],
              ],
            },
            JSON.stringify(value("featureCards", vehicle.featureCards || []), null, 2)
          ),
        ],
        { open: false }
      )
    );

    vehicleForm.append(formActions("vehicle"));
  }

  function initTabs() {
    document.querySelectorAll("[data-admin-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
        document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
          panel.classList.toggle("is-active", panel.dataset.adminPanel === button.dataset.adminTab);
        });
      });
    });
  }

  function initPages() {
    if (!pageSelect || !pageForm) return;
    schema.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.label;
      pageSelect.append(option);
    });
    pageSelect.addEventListener("change", renderPageForm);
    pageForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      state.fields = state.fields || {};
      pageForm.querySelectorAll("[name]").forEach((input) => {
        state.fields[input.name] = input.value.trim();
      });
      await saveState("本机预览已保存");
    });
    pageForm.addEventListener("click", (event) => {
      if (!event.target.matches("[data-clear-page]")) return;
      const group = schema.find((item) => item.id === pageSelect.value);
      if (!group) return;
      if (!confirmDanger(`确定清空“${group.label}”的本机修改吗？`)) return;
      group.fields.forEach((field) => {
        if (state.fields) delete state.fields[field.key];
      });
      saveState("本页本机修改已清空");
      renderPageForm();
    });
    renderPageForm();
  }

  function initVehicles() {
    if (!vehicleSelect || !vehicleForm) return;
    refreshVehicleSelect();
    vehicleSelect.addEventListener("change", renderVehicleForm);
    vehicleForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const vehicle = currentVehicle();
      const patch = vehiclePatch(vehicle);
      vehicleForm.querySelectorAll("[name]").forEach((input) => {
        if (
          input.name === "featureCards" ||
          input.name === "gallery" ||
          input.name === "interiorGallery" ||
          input.name === "exteriorColors" ||
          input.name === "interiorColors"
        ) {
          try {
            patch[input.name] = JSON.parse(input.value || "[]");
          } catch (_error) {
            showToast(`${input.name} 必须是有效 JSON`);
          }
          return;
        }
        patch[input.name] = input.value.trim();
      });
      await saveState("本机预览已保存");
    });
    vehicleForm.addEventListener("click", async (event) => {
      const orderButton = event.target.closest("[data-vehicle-order-action]");
      if (orderButton) {
        const action = orderButton.dataset.vehicleOrderAction;
        const id = orderButton.dataset.vehicleOrderId;
        if (action === "select") {
          vehicleSelect.value = id;
          renderVehicleForm();
          return;
        }
        await moveVehicleOrder(id, action);
        return;
      }
      if (!event.target.matches("[data-clear-vehicle]")) return;
      const vehicle = currentVehicle();
      if (!confirmDanger(`确定清空“${vehicle.fullName || vehicle.name}”的本机修改吗？`)) return;
      if (state.vehicles) delete state.vehicles[vehicle.id];
      saveState("此车型本机修改已清空");
      renderVehicleForm();
    });
    renderVehicleForm();
  }

  function initSettings() {
    if (!settingsForm) return;
    const secondsInput = settingsForm.elements.namedItem("homeHeroIntervalSeconds");
    if (secondsInput) {
      secondsInput.value = String(Math.round((state.settings.homeHeroIntervalMs || 5000) / 1000));
    }

    settingsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const seconds = Number(secondsInput ? secondsInput.value : 5);
      state.settings.homeHeroIntervalMs = Math.max(2, Math.min(20, Number.isFinite(seconds) ? seconds : 5)) * 1000;
      await saveState("网站设置已保存");
    });
  }

  function initDataTools() {
    const exportButton = document.querySelector("[data-export-json]");
    const exportDefaultsBundleButton = document.querySelector("[data-export-defaults-bundle]");
    const downloadDefaultsButton = document.querySelector("[data-download-defaults-js]");
    const writeDefaultsButton = document.querySelector("[data-write-defaults-js]");
    const defaultsStatus = document.querySelector("[data-defaults-js-status]");
    const importArea = document.querySelector("[data-import-json]");
    const importButton = document.querySelector("[data-import-json-button]");
    const resetButton = document.querySelector("[data-reset-all]");
    const localAssetMarker = "vstar-local-image:";

    function downloadBlob(blob, filename) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    function collectLocalAssetRefs(value, path = "root", refs = []) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (
          trimmed.startsWith(localAssetMarker) ||
          (localAssets && typeof localAssets.isRef === "function" && localAssets.isRef(trimmed))
        ) {
          refs.push({ path, value: trimmed });
          return refs;
        }
        if ((trimmed.startsWith("[") || trimmed.startsWith("{")) && trimmed.includes(localAssetMarker)) {
          try {
            collectLocalAssetRefs(JSON.parse(trimmed), path, refs);
          } catch (_error) {
            refs.push({ path, value: localAssetMarker });
          }
        }
        return refs;
      }
      if (Array.isArray(value)) {
        value.forEach((item, index) => collectLocalAssetRefs(item, `${path}.${index}`, refs));
        return refs;
      }
      if (value && typeof value === "object") {
        Object.keys(value).forEach((key) => collectLocalAssetRefs(value[key], `${path}.${key}`, refs));
      }
      return refs;
    }

    function uniqueLocalAssetRefs(value) {
      const refs = collectLocalAssetRefs(value);
      const seen = new Set();
      return refs.filter((item) => {
        if (!item.value || seen.has(item.value)) return false;
        seen.add(item.value);
        return true;
      });
    }

    function slugify(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
    }

    function guessImageExtension(record) {
      const name = String((record && record.name) || "");
      const nameMatch = name.match(/\.([a-zA-Z0-9]{2,5})$/);
      if (nameMatch) return `.${nameMatch[1].toLowerCase().replace("jpeg", "jpg")}`;
      const type = String((record && record.type) || "");
      if (type.includes("png")) return ".png";
      if (type.includes("webp")) return ".webp";
      if (type.includes("gif")) return ".gif";
      return ".jpg";
    }

    function publishedImagePath(refItem, record, index) {
      const pathSlug = slugify(refItem.path.replace(/^root\./, ""));
      const nameSlug = slugify(String((record && record.name) || "").replace(/\.[a-zA-Z0-9]{2,5}$/, ""));
      const base = pathSlug || nameSlug || `image-${index + 1}`;
      return `assets/img/admin/published/${String(index + 1).padStart(3, "0")}-${base}${guessImageExtension(record)}`;
    }

    function replaceLocalAssetRefs(value, pathMap) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (pathMap.has(trimmed)) return pathMap.get(trimmed);
        if ((trimmed.startsWith("[") || trimmed.startsWith("{")) && trimmed.includes(localAssetMarker)) {
          try {
            const parsed = JSON.parse(trimmed);
            return JSON.stringify(replaceLocalAssetRefs(parsed, pathMap), null, 2);
          } catch (_error) {
            return value;
          }
        }
        return value;
      }
      if (Array.isArray(value)) return value.map((item) => replaceLocalAssetRefs(item, pathMap));
      if (value && typeof value === "object") {
        const next = {};
        Object.keys(value).forEach((key) => {
          next[key] = replaceLocalAssetRefs(value[key], pathMap);
        });
        return next;
      }
      return value;
    }

    function dataUrlToBlob(dataUrl) {
      const match = String(dataUrl || "").match(/^data:([^;,]+)?(;base64)?,(.*)$/);
      if (!match) throw new Error("本地图片数据无效，无法写入根图片。");
      const mimeType = match[1] || "application/octet-stream";
      const isBase64 = Boolean(match[2]);
      const payload = match[3] || "";
      const binary = isBase64 ? atob(payload) : decodeURIComponent(payload);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return new Blob([bytes], { type: mimeType });
    }

    async function readLocalAsset(ref) {
      if (localAssets && typeof localAssets.getRecord === "function") {
        const record = await localAssets.getRecord(ref);
        if (record && record.dataUrl) return record;
      }
      if (localAssets && typeof localAssets.resolve === "function") {
        const dataUrl = await localAssets.resolve(ref);
        if (dataUrl) {
          const typeMatch = dataUrl.match(/^data:([^;,]+)/);
          return { id: ref.slice(localAssetMarker.length), name: ref.slice(localAssetMarker.length), type: typeMatch ? typeMatch[1] : "", dataUrl };
        }
      }
      throw new Error(`找不到本地图片：${ref}`);
    }

    async function buildDefaultPublishPlan() {
      const defaultState = currentDefaultState();
      const refs = uniqueLocalAssetRefs(defaultState);
      const pathMap = new Map();
      const files = [];

      for (const [index, refItem] of refs.entries()) {
        const record = await readLocalAsset(refItem.value);
        const path = publishedImagePath(refItem, record, index);
        pathMap.set(refItem.value, path);
        files.push({
          ref: refItem.value,
          originalName: record.name || "",
          type: record.type || "",
          path,
          dataUrl: record.dataUrl,
        });
      }

      const publishedState = replaceLocalAssetRefs(defaultState, pathMap);
      const contentDefaultsJs = buildDefaultsJs(publishedState, { allowLocalAssets: false });
      return {
        generatedAt: new Date().toISOString(),
        defaultState: publishedState,
        files,
        contentDefaultsJs,
      };
    }

    async function getOrCreateDirectory(rootHandle, parts) {
      let handle = rootHandle;
      for (const part of parts) {
        handle = await handle.getDirectoryHandle(part, { create: true });
      }
      return handle;
    }

    async function writeProjectFile(rootHandle, filePath, content) {
      const parts = filePath.split("/").filter(Boolean);
      const fileName = parts.pop();
      const directory = await getOrCreateDirectory(rootHandle, parts);
      const fileHandle = await directory.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    }

    async function assertProjectRoot(rootHandle) {
      try {
        await rootHandle.getFileHandle("admin.html");
        await rootHandle.getDirectoryHandle("assets");
      } catch (_error) {
        throw new Error("请选择 vstar-auto-site 项目根目录，不要选择 assets 或其他子文件夹。");
      }
    }

    function buildDefaultsBundle(plan) {
      return {
        type: "vstar-default-content-bundle",
        generatedAt: plan.generatedAt,
        instructions:
          "Run: node tools/apply-default-content-bundle.js path/to/this-json. It writes assets/js/content-defaults.js and root images under assets/img/admin/published/.",
        files: plan.files,
        defaultState: plan.defaultState,
        contentDefaultsJs: plan.contentDefaultsJs,
      };
    }

    function downloadDefaultsBundle(plan) {
      downloadBlob(
        new Blob([JSON.stringify(buildDefaultsBundle(plan), null, 2)], { type: "application/json" }),
        `vstar-default-content-bundle-${new Date().toISOString().slice(0, 10)}.json`
      );
    }

    async function publishDefaultsToProject() {
      const plan = await buildDefaultPublishPlan();
      if (!window.showDirectoryPicker) {
        downloadDefaultsBundle(plan);
        setDefaultsStatus("浏览器不支持直接写入项目文件，已下载固化包 JSON。请用 tools/apply-default-content-bundle.js 写入默认根图片。");
        return;
      }

      const rootHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      await assertProjectRoot(rootHandle);

      for (const file of plan.files) {
        await writeProjectFile(rootHandle, file.path, dataUrlToBlob(file.dataUrl));
      }
      await writeProjectFile(rootHandle, "assets/js/content-defaults.js", plan.contentDefaultsJs);

      setDefaultsStatus(`已固化为默认内容：写入 ${plan.files.length} 张根图片，并更新 assets/js/content-defaults.js。无痕模式和正式上线会读取同一套图片。`);
    }

    function currentDefaultState() {
      normalizeState();
      const exportState = typeof contentTools.sanitize === "function" ? contentTools.sanitize(state) : state;
      return JSON.parse(JSON.stringify({ ...exportState, version: 1, updatedAt: new Date().toISOString() }));
    }

    function buildDefaultsJs(defaultState = currentDefaultState(), options = {}) {
      const localRefs = collectLocalAssetRefs(defaultState);
      if (localRefs.length && options.allowLocalAssets !== true) {
        const first = localRefs[0];
        throw new Error(
          `不能只写入默认配置：${first.path} 仍是浏览器本地图片。请使用“固化为默认根图片”，系统会把图片写入 assets/img/admin/published/。`
        );
      }
      return `(function () {\n  window.VSTAR_DEFAULT_CONTENT_OVERRIDES = ${JSON.stringify(defaultState, null, 2)};\n})();\n`;
    }

    function setDefaultsStatus(message) {
      if (defaultsStatus) defaultsStatus.textContent = message;
      showToast(message, 5200);
    }

    async function writeDefaultsJsFile(source) {
      const filename = "content-defaults.js";
      if (!window.showSaveFilePicker) {
        downloadBlob(new Blob([source], { type: "text/javascript" }), filename);
        setDefaultsStatus("浏览器不支持直接写入，已改为下载 content-defaults.js。请替换 assets/js/content-defaults.js。");
        return;
      }
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "JavaScript files",
            accept: { "text/javascript": [".js"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(source);
      await writable.close();
      setDefaultsStatus("默认配置已写入。刷新无痕页面即可看到默认图一致。");
    }

    if (exportButton) {
      exportButton.addEventListener("click", () => {
        normalizeState();
        const exportState = typeof contentTools.sanitize === "function" ? contentTools.sanitize(state) : state;
        downloadBlob(
          new Blob([JSON.stringify(exportState, null, 2)], { type: "application/json" }),
          `vstar-content-overrides-${new Date().toISOString().slice(0, 10)}.json`
        );
      });
    }

    if (downloadDefaultsButton) {
      downloadDefaultsButton.addEventListener("click", () => {
        try {
          downloadBlob(new Blob([buildDefaultsJs()], { type: "text/javascript" }), "content-defaults.js");
          setDefaultsStatus("已生成默认配置 JS。用它替换 assets/js/content-defaults.js 后，无痕模式会读取同一套默认图。");
        } catch (error) {
          setDefaultsStatus(error.message || "默认配置生成失败");
        }
      });
    }

    if (exportDefaultsBundleButton) {
      exportDefaultsBundleButton.addEventListener("click", async () => {
        try {
          const plan = await buildDefaultPublishPlan();
          downloadDefaultsBundle(plan);
          setDefaultsStatus(`已生成默认内容固化包：包含 ${plan.files.length} 张本地图片和默认配置。`);
        } catch (error) {
          setDefaultsStatus(error.message || "默认内容固化包生成失败");
        }
      });
    }

    if (writeDefaultsButton) {
      writeDefaultsButton.addEventListener("click", async () => {
        try {
          await publishDefaultsToProject();
        } catch (error) {
          setDefaultsStatus(error.message || "默认根图片固化失败");
        }
      });
    }

    if (importButton && importArea) {
      importButton.addEventListener("click", () => {
        try {
          const imported = JSON.parse(importArea.value || "{}");
          Object.keys(state).forEach((key) => delete state[key]);
          Object.assign(state, imported);
          saveState("Imported");
          renderPageForm();
          renderVehicleForm();
        } catch (_error) {
          showToast("导入 JSON 格式无效");
        }
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        if (!confirmDanger("确定清空当前浏览器里的所有本机修改吗？")) return;
        localStorage.removeItem(storageKey);
        Object.keys(state).forEach((key) => delete state[key]);
        saveState("本机修改已清空");
        renderPageForm();
        renderVehicleForm();
        initSettings();
      });
    }
  }

  normalizeState();
  initTabs();
  initPages();
  initVehicles();
  initSettings();
  initDataTools();
  renderJsonPreview();
})();

