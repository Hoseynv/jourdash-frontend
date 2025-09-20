export const translations = {
  // Navigation
  dashboard: "داشبورد",
  masterData: "اطلاعات پایه",
  warehouse: "انبار",
  pricing: "قیمت‌گذاری",
  pos: "فروش",
  returns: "مرجوعی",
  exchanges: "تعویض",
  inventory: "موجودی",
  customers: "مشتریان",
  loyalty: "وفاداری",
  labeling: "برچسب‌گذاری",
  audit: "حسابرسی",
  access: "دسترسی",
  goodsReceiptMain: "رسید کالا",
  transfers: "انتقالات",

  // Master Data
  brands: "برندها",
  categories: "دسته‌بندی‌ها",
  subcategories: "زیردسته‌ها",
  models: "مدل‌ها",
  colors: "رنگ‌ها",
  sizes: "سایزها",
  uom: "واحد اندازه‌گیری",
  skus: "کالاها",
  skuMedia: "تصاویر کالا",
  skuBarcodes: "بارکدهای کالا",

  // Warehouse
  itemUnits: "واحدهای کالا",
  goodsReceipts: "رسید کالا",
  qc: "کنترل کیفیت",
  putaway: "جایگذاری",
  layout: "چیدمان انبار",

  // POS
  sell: "فروش",
  shifts: "شیفت‌ها",

  // Customers
  profiles: "پروفایل‌ها",
  tiers: "سطوح",
  points: "امتیازات",
  newCustomer: "مشتری جدید",
  createCustomer: "ایجاد مشتری",
  saveAndSelect: "ذخیره و انتخاب",
  fullName: "نام کامل",
  tier: "سطح مشتری",
  consents: "رضایت‌نامه‌ها",
  smsConsent: "پیامک",
  emailConsent: "ایمیل",
  pushConsent: "اعلان",
  customerCreatedSuccess: "مشتری با موفقیت اضافه شد و به فاکتور وصل شد.",
  phoneAlreadyExists: "این شماره قبلاً ثبت شده است.",
  removeCustomer: "حذف مشتری",

  // Access
  users: "کاربران",
  roles: "نقش‌ها",
  permissions: "مجوزها",

  // Transfers Navigation
  transfersHistory: "تاریخچه انتقالات",
  newTransfer: "ثبت انتقال جدید",
  receiveTransfer: "دریافت انتقال",
  transferDetails: "جزئیات انتقال",

  // Transfer Status
  readyToShip: "آماده ارسال",
  shipped: "ارسال شد",
  received: "دریافت شد",
  draft: "پیش‌نویس",

  // Transfer Types
  storeToStore: "شعبه به شعبه",
  warehouseToStore: "انبار به شعبه",
  storeToWarehouse: "شعبه به انبار",

  // Transfer Fields
  transferNo: "شماره انتقال",
  fromOwner: "مبدأ",
  toOwner: "مقصد",
  fromOwnerType: "نوع مبدأ",
  toOwnerType: "نوع مقصد",
  transferType: "نوع انتقال",
  plannedDate: "تاریخ برنامه‌ریزی‌شده",
  createdAt: "تاریخ ایجاد",
  shippedAt: "تاریخ ارسال",
  receivedAt: "تاریخ دریافت",
  itemsCount: "تعداد اقلام",
  receivedCount: "تعداد دریافتی",
  totalCount: "تعداد کل",
  progress: "پیشرفت",

  // Transfer Actions
  markAsShipped: "تغییر وضعیت به ارسال شد",
  startReceiving: "شروع دریافت",
  confirmFullReceipt: "ثبت دریافت کامل",
  saveAsReadyToShip: "ذخیره به‌عنوان آماده ارسال",
  nextScanItems: "مرحله بعد (اسکن اقلام)",
  backToPrevious: "بازگشت به مرحله قبل",
  backToHistory: "بازگشت به تاریخچه",
  openReceivePage: "شروع دریافت",

  // Transfer Steps
  transferHeader: "مشخصات انتقال",
  scanItems: "اسکن اقلام",
  outboundItems: "اقلام ارسالی",
  inboundItems: "اقلام دریافتی",
  expectedItems: "اقلام مورد انتظار",
  receivedItems: "اقلام دریافتی",

  // Transfer Messages
  transferNotReadyToReceive: "این انتقال آمادهٔ دریافت نیست.",
  alreadyScannedForTransfer: "این کالا قبلاً برای این انتقال ثبت شده است.",
  itemCannotBeShipped: "این کالا قابل ارسال نیست.",
  notIncludedInTransfer: "این کالا در لیست ارسال این انتقال نیست.",
  alreadyReceived: "این کالا قبلاً دریافت شده است.",
  notEditableInReadyToShip: "در حالت آماده ارسال قابل ویرایش نیست.",
  transferCreatedSuccess: "انتقال با موفقیت ایجاد شد.",
  transferUpdatedSuccess: "انتقال با موفقیت به‌روزرسانی شد.",
  itemScannedSuccess: "کالا با موفقیت اسکن شد.",
  transferMarkedAsShipped: "انتقال به عنوان ارسال شده علامت‌گذاری شد.",
  transferMarkedAsReceived: "انتقال به عنوان دریافت شده علامت‌گذاری شد.",

  // Transfer Tabs
  timeline: "تایم‌لاین",
  variance: "گزارش مغایرت",
  outbound: "خروجی",
  inbound: "دریافتی",

  // Owner Types
  warehouse: "انبار",
  store: "شعبه",

  // Common Actions
  search: "جستجو",
  add: "افزودن",
  edit: "ویرایش",
  delete: "حذف",
  save: "ذخیره",
  cancel: "لغو",
  confirm: "تأیید",
  close: "بستن",
  open: "باز",
  active: "فعال",
  inactive: "غیرفعال",
  status: "وضعیت",
  actions: "عملیات",
  submit: "ارسال",
  reset: "بازنشانی",
  clear: "پاک کردن",
  refresh: "بروزرسانی",
  export: "خروجی",
  import: "ورودی",
  print: "چاپ",

  // Form Fields
  name: "نام",
  code: "کد",
  description: "توضیحات",
  price: "قیمت",
  quantity: "تعداد",
  date: "تاریخ",
  time: "زمان",
  email: "ایمیل",
  phone: "تلفن",
  address: "آدرس",
  notes: "یادداشت",

  // Status Messages
  success: "موفقیت",
  error: "خطا",
  warning: "هشدار",
  info: "اطلاعات",
  loading: "در حال بارگذاری...",
  noData: "داده‌ای یافت نشد",
  pleaseWait: "لطفاً صبر کنید",
  processing: "در حال پردازش...",

  // Validation Messages
  required: "این فیلد الزامی است",
  invalidEmail: "ایمیل نامعتبر است",
  invalidPhone: "شماره تلفن نامعتبر است",
  passwordTooShort: "رمز عبور باید حداقل ۸ کاراکتر باشد",
  passwordsNotMatch: "رمزهای عبور مطابقت ندارند",
  invalidFormat: "فرمت نامعتبر است",

  // Confirmation Messages
  confirmDelete: "آیا از حذف این مورد اطمینان دارید؟",
  confirmSave: "آیا از ذخیره تغییرات اطمینان دارید؟",
  confirmCancel: "آیا از لغو عملیات اطمینان دارید؟",
  unsavedChanges: "تغییرات ذخیره نشده وجود دارد",

  // Barcode
  scanBarcode: "اسکن بارکد",
  barcodeRequired: "بارکد باید دقیقاً ۱۲ رقم باشد",
  invalidBarcode: "بارکد نامعتبر",
  barcodeNotFound: "بارکد یافت نشد",
  barcodeAlreadyExists: "این بارکد قبلاً وجود دارد",

  // Store
  selectStore: "انتخاب فروشگاه",
  mainStore: "فروشگاه مرکزی",
  branch: "شعبه",

  // User menu
  profile: "پروفایل",
  settings: "تنظیمات",
  logout: "خروج",
  changePassword: "تغییر رمز عبور",
  accountSettings: "تنظیمات حساب",

  // Keyboard shortcuts
  searchShortcut: 'برای جستجو "/" را فشار دهید',
  dashboardShortcut: 'برای داشبورد "g g" را فشار دهید',

  // Time and Date
  today: "امروز",
  yesterday: "دیروز",
  thisWeek: "این هفته",
  thisMonth: "این ماه",
  lastWeek: "هفته گذشته",
  lastMonth: "ماه گذشته",

  // Pagination
  previous: "قبلی",
  next: "بعدی",
  first: "اول",
  last: "آخر",
  page: "صفحه",
  of: "از",
  showing: "نمایش",
  to: "تا",
  results: "نتیجه",

  // Theme
  lightMode: "حالت روز",
  darkMode: "حالت شب",
  toggleTheme: "تغییر حالت",

  // Coming Soon
  comingSoon: "به‌زودی",
  featureNotAvailable: "این قابلیت هنوز در دسترس نیست",
  underDevelopment: "در حال توسعه",

  // Empty States
  noItemsFound: "هیچ موردی یافت نشد",
  noResultsFound: "نتیجه‌ای یافت نشد",
  emptyList: "لیست خالی است",
  noDataAvailable: "داده‌ای در دسترس نیست",

  // File Operations
  upload: "بارگذاری",
  download: "دانلود",
  selectFile: "انتخاب فایل",
  dragDropFile: "فایل را اینجا بکشید یا کلیک کنید",
  fileUploaded: "فایل با موفقیت بارگذاری شد",
  fileUploadError: "خطا در بارگذاری فایل",

  // Goods Receipt enhancements
  productTitle: "عنوان کالا",
  productSpecs: "ویژگی‌ها",
  brand: "برند",
  gender: "جنسیت",
  season: "فصل",
  category: "دسته",
  subcategory: "زیردسته",
  model: "مدل",
  color: "رنگ",
  size: "سایز",
  expectedQty: "مقدار انتظار",
  countedQty: "مقدار شمارش",
  diffQty: "اختلاف",
  sortBy: "مرتب‌سازی بر اساس",
  searchProducts: "جستجو در کالاها",
  expandRow: "نمایش واحدها",
  collapseRow: "بستن واحدها",
  units: "واحدها",
  barcode12: "بارکد ۱۲ رقمی",
  techCode: "کد فنی",
  stage: "مرحله",

  // Color and Model creation
  searchOrCreateColor: "جستجو یا ایجاد رنگ جدید",
  searchOrCreateModel: "جستجو یا ایجاد مدل جدید",
  createNewColor: "ایجاد رنگ جدید",
  createNewModel: "ایجاد مدل جدید",
  defineNewModel: "تعریف مدل جدید",
  modelNameRequired: "نام مدل را وارد کنید.",
  modelCodeThreeDigits: "کد مدل (سه رقمی)",
  modelCodeMustBeUnique: "کد مدل باید یکتا باشد.",
  colorName: "نام رنگ",
  colorCode: "کد رنگ",
  modelName: "نام مدل",
  modelCode: "کد مدل",
  colorCodeMustBe3Digits: "کد رنگ باید دقیقاً سه رقم باشد.",
  modelCodeMustBe3Digits: "کد مدل باید دقیقاً سه رقم باشد.",
  invalidSKU: "SKU نامعتبر: فیلدهای لازم کامل نیست.",
  duplicateItemDetected: "افزودن تکراری شناسایی شد؛ می‌خواهید تعداد را افزایش دهید؟",

  // Gender options
  male: "مردانه",
  female: "زنانه",

  // Season codes
  spring: "بهار",
  summer: "تابستان",
  autumn: "پاییز",
  winter: "زمستان",
  allSeason: "همه فصل",
  noSeason: "بدون فصل",

  // Pricing page
  pricingManagement: "مدیریت قیمت‌گذاری",
  setPriceModal: "ثبت قیمت",
  setPrice: "ثبت قیمت",
  savePrice: "ذخیره قیمت",
  lastPrice: "آخرین قیمت",
  effectiveFrom: "از تاریخ",
  effectiveTo: "تا تاریخ",
  priced: "قیمت‌دار",
  unpriced: "بی‌قیمت",
  unpricedFilter: "قیمت‌گذاری نشده",
  recentlyPriced: "آخرین قیمت‌گذاری",
  dateRange: "بازه زمانی",
  all: "همه",
  images: "عکس‌ها",
  skuCode: "کد SKU",
  itemTitle: "عنوان کالا",
  basePrice: "قیمت",
  currency: "ارز",
  taxRate: "مالیات (%)",
  netPrice: "قبل مالیات",
  taxAmount: "مالیات",
  grossPrice: "پس از مالیات",
  priceCalculation: "خلاصه محاسبات",
  noImage: "بدون تصویر",
  multipleImages: "چند تصویر",
  imageViewer: "نمایشگر تصویر",
  previousImage: "تصویر قبلی",
  nextImage: "تصویر بعدی",
  closeViewer: "بستن نمایشگر",
  priceHistory: "تاریخچه قیمت",

  // Pricing validation messages
  priceRequired: "قیمت الزامی است",
  priceMustBePositive: "قیمت باید عددی بزرگ‌تر از صفر باشد",
  endDateMustBeAfterStart: "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد",
  overlappingPricePeriod: "بازه زمانی قیمت با مورد دیگری تداخل دارد",

  // Pricing success messages
  priceSavedSuccess: "قیمت با موفقیت ثبت شد",

  // Pricing empty states
  noUnpricedItems: "کالایی بدون قیمت یافت نشد",
  noRecentlyPricedItems: "کالایی با قیمت‌گذاری اخیر یافت نشد",

  // Pricing filters
  statusFilter: "وضعیت",
  searchPlaceholder: "جستجو در کد SKU، مدل، رنگ، سایز، برند...",
  last30Days: "۳۰ روز گذشته",
}

export const t = (key: keyof typeof translations): string => {
  return translations[key] || key
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("fa-IR").format(num)
}

export const formatCurrency = (amount: number): string => {
  return `${formatNumber(amount)} ریال`
}

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("fa-IR").format(dateObj)
}

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}
