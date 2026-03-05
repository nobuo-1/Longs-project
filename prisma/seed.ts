import { PrismaClient, UserRole, ImportDataset, ImportStatus, IssueLevel } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // デモユーザーのパスワードをハッシュ化
  const passwordHash = await bcrypt.hash("demopass", 10)

  // UserAccountを作成（冪等性確保のためupsert）
  const user = await prisma.userAccount.upsert({
    where: { email: "owner@apparel.jp" },
    update: {
      passwordHash, // パスワードのみ更新
    },
    create: {
      email: "owner@apparel.jp",
      name: "オーナー",
      passwordHash,
      role: UserRole.admin,
    },
  })

  const testUser = await prisma.userAccount.upsert({
    where: { email: "testuser@apparel.jp" },
    update: {},
    create: {
      email: "testuser@apparel.jp",
      name: "テストユーザー",
      passwordHash: await
  bcrypt.hash("testpass", 10),
      role: UserRole.general,
    },
  })

  console.log(`✓ Created demo user: ${user.email}`)
  console.log(`✓ Created demo user: ${testUser.email}`)

  // DesignAsset サンプルデータ（デモ用 POP 4件）
  // ※ imageUrl が null のものは元々ローカルファイル保存だったため画像なし
  const designAssets = [
    {
      id: "9071df2c-1c06-434f-af08-33a765ca46e4",
      type: "pop" as const,
      title: "カメラバッグのPOP",
      prompt:
        "Create a promotional POP design for retail display.\n" +
        "Style: retro vintage design, nostalgic colors, classic typography.\n" +
        'Catchphrase text to display: "持ち運びたいのは、思い出"\n' +
        'Main text to display: "Healthknit Product カメラバッグ HKB-1084"\n' +
        "Additional requirements: 商品着用モデルとしてセミロングヘアの女性を中央に配置してください。女性は肩から[image 1] を提げてがカメラを構えて趣味に没入しています。穏やかで日常的な生活の自然風景の中にたたずんでいます\n" +
        "Make the design eye-catching, professional, and suitable for apparel retail business.",
      style: "retro",
      color: null,
      ratio: null,
      imageUrl: "https://kdrwnbqxhjlzvvmrwexp.supabase.co/storage/v1/object/public/design-assets/2026/02/1771230620418-vy8pj96a.png",
    },
    {
      id: "b2db981a-656d-4452-9c53-7a5c5adc04b4",
      type: "pop" as const,
      title: "スリングバッグ",
      prompt:
        "Create a promotional POP design for retail display.\n" +
        'Catchphrase text to display: "カッコよさも\\n機能性も、\\nどちらも譲れない。"\n' +
        'Main text to display: "¥8,690 (税抜 ¥7,900)"\n' +
        "Additional requirements: 晴れた日の明るい日本の街並みを背景に、20代から40代くらいの清潔感のある日本人男性が、クロスバイクなどの自転車に乗って颯爽と走っている。彼はネイビーのスリングバッグ[image 1] を体にフィットするように斜めがけにしている。服装はシックなカジュアルスタイルで、快活な印象。\n" +
        "画像の上部または余白の読みやすい位置に、洗練された細身のゴシック体フォントでCatchphrase を配置。\n" +
        "商品の近くまたは下部に、視認性の高い細めのフォントで Main textを配置。\n" +
        "Make the design eye-catching, professional, and suitable for apparel retail business.",
      style: null,
      color: null,
      ratio: null,
      imageUrl:
        "https://kdrwnbqxhjlzvvmrwexp.supabase.co/storage/v1/object/public/design-assets/2026/02/1771303409774-8lieqs0i.jpg",
    },
    {
      id: "51283fbd-09c4-4b15-9ea1-0c9b46071cb9",
      type: "pop" as const,
      title: null,
      prompt:
        "Create a promotional POP design for retail display.\n" +
        'Catchphrase text to display: "リバーシブルだから１個で２味楽しめる"\n' +
        'Main text to display: "¥4,290 (税抜 ¥3,900)"\n' +
        "Additional requirements: 自然光がたっぷりと入る明るいカフェのテラス席、あるいは白い壁を背景にした清潔感のある空間で、30代の女性が[image 1] （白地に鮮やかなオレンジの持ち手・トリミングが特徴）を肩にかけ、リラックスした様子で立っている。バッグの生地の質感や、くしゃっとした自然なシワ感を描写し、パッカブルな機能性を暗示させる。画像内の余白（ネガティブスペース）を十分に確保し、そこに以下のテキストをバランスよく配置する。\n" +
        "Make the design eye-catching, professional, and suitable for apparel retail business.",
      style: null,
      color: null,
      ratio: null,
      imageUrl:
        "https://kdrwnbqxhjlzvvmrwexp.supabase.co/storage/v1/object/public/design-assets/2026/02/1771305042743-vnqbmhm8.jpg",
    },
    {
      id: "8e86d072-20c3-4aea-933d-47db8c934e54",
      type: "pop" as const,
      title: "新色発売",
      prompt:
        "Create a promotional POP design for retail display.\n" +
        "Style: casual friendly design, warm, approachable.\n" +
        'Catchphrase text to display: "新色登場"\n' +
        'Main text to display: "11ポケット撥水リュック"\n' +
        "Additional requirements: あるリュックサックシリーズの新色登場を宣伝するPOPを作成します。3つの画像のリュックサックが寄り添いあって置かれている様子を中央に配置してください。新しい季節が到来したような心躍るイメージを持たせてください\n" +
        "Make the design eye-catching, professional, and suitable for apparel retail business.",
      style: "casual",
      color: null,
      ratio: null,
      imageUrl:
        "https://kdrwnbqxhjlzvvmrwexp.supabase.co/storage/v1/object/public/design-assets/2026/02/1771305513839-ff8z6zxf.jpg",
    },
  ]

  for (const asset of designAssets) {
    await prisma.designAsset.upsert({
      where: { id: asset.id },
      update: {},
      create: {
        ...asset,
        createdBy: user.id,
      },
    })
    console.log(`✓ Upserted design asset: ${asset.title ?? "(タイトルなし)"}`)
  }

  // ============================================================
  // DataImport デモデータ（8件）
  // ============================================================
  const importSeed = [
    {
      id: "a1b2c3d4-0001-0001-0001-000000000001",
      dataset: ImportDataset.sales,
      fileName: "sales_2024-12.csv",
      status: ImportStatus.success,
      summary: "全レコードが正常に取り込まれました。",
      importedAt: new Date("2024-12-20T10:30:00+09:00"),
      rowsTotal: 12450, rowsSuccess: 12450, rowsSkipped: 0,
      warningsCount: 0, errorsCount: 0,
    },
    {
      id: "a1b2c3d4-0001-0001-0001-000000000002",
      dataset: ImportDataset.sales,
      fileName: "sales_2024-11.csv",
      status: ImportStatus.success,
      summary: "売上データを問題なく取り込みました。",
      importedAt: new Date("2024-11-25T09:12:00+09:00"),
      rowsTotal: 11980, rowsSuccess: 11980, rowsSkipped: 0,
      warningsCount: 0, errorsCount: 0,
    },
    {
      id: "a1b2c3d4-0001-0001-0002-000000000001",
      dataset: ImportDataset.payables,
      fileName: "payables_2024-12.xlsx",
      status: ImportStatus.success,
      summary: "支払い予定データが正常に取り込まれました。",
      importedAt: new Date("2024-12-18T14:02:00+09:00"),
      rowsTotal: 3580, rowsSuccess: 3580, rowsSkipped: 0,
      warningsCount: 0, errorsCount: 0,
    },
    {
      id: "a1b2c3d4-0001-0001-0002-000000000002",
      dataset: ImportDataset.payables,
      fileName: "payables_2024-11.xlsx",
      status: ImportStatus.partial,
      summary: "一部欠損行を除外して取り込みました。",
      note: "数行の欠損あり",
      importedAt: new Date("2024-11-20T13:50:00+09:00"),
      rowsTotal: 3400, rowsSuccess: 3380, rowsSkipped: 20,
      warningsCount: 2, errorsCount: 0,
    },
    {
      id: "a1b2c3d4-0001-0001-0003-000000000001",
      dataset: ImportDataset.receivables,
      fileName: "receivables_2024-12.csv",
      status: ImportStatus.success,
      summary: "入金予定データを問題なく取り込みました。",
      importedAt: new Date("2024-12-19T16:20:00+09:00"),
      rowsTotal: 6720, rowsSuccess: 6720, rowsSkipped: 0,
      warningsCount: 0, errorsCount: 0,
    },
    {
      id: "a1b2c3d4-0001-0001-0003-000000000002",
      dataset: ImportDataset.receivables,
      fileName: "receivables_2024-11.csv",
      status: ImportStatus.success,
      summary: "入金予定データを問題なく取り込みました。",
      importedAt: new Date("2024-11-22T11:05:00+09:00"),
      rowsTotal: 6550, rowsSuccess: 6550, rowsSkipped: 0,
      warningsCount: 0, errorsCount: 0,
    },
    {
      id: "a1b2c3d4-0001-0001-0004-000000000001",
      dataset: ImportDataset.gross_profit,
      fileName: "profit_2024.csv",
      status: ImportStatus.success,
      summary: "年度粗利データが正常に取り込まれました。",
      importedAt: new Date("2024-12-10T08:45:00+09:00"),
      rowsTotal: 980, rowsSuccess: 980, rowsSkipped: 0,
      warningsCount: 0, errorsCount: 0,
    },
    {
      id: "a1b2c3d4-0001-0001-0004-000000000002",
      dataset: ImportDataset.gross_profit,
      fileName: "profit_2023.csv",
      status: ImportStatus.failed,
      summary: "フォーマット不一致のため取り込みに失敗しました。",
      note: "フォーマット不一致",
      importedAt: new Date("2024-11-01T08:45:00+09:00"),
      rowsTotal: 960, rowsSuccess: 0, rowsSkipped: 0,
      warningsCount: 0, errorsCount: 3,
    },
  ] as const

  for (const imp of importSeed) {
    await prisma.dataImport.upsert({
      where: { id: imp.id },
      update: {},
      create: { ...imp, importedBy: user.id },
    })
    console.log(`✓ Upserted data import: ${imp.fileName}`)
  }

  // DataImportIssue（payables-2024-11の警告2件 + gross-profit-2023のエラー3件）
  const issueSeed = [
    {
      id: "b1000000-0000-0000-0000-000000000001",
      importId: "a1b2c3d4-0001-0001-0002-000000000002",
      level: IssueLevel.warning,
      message: "仕入先コードが未設定の行が20件ありスキップしました。",
      rowNumber: null, columnName: null,
    },
    {
      id: "b1000000-0000-0000-0000-000000000002",
      importId: "a1b2c3d4-0001-0001-0002-000000000002",
      level: IssueLevel.warning,
      message: "日付形式の揺れが2件あり自動補正しました。",
      rowNumber: null, columnName: null,
    },
    {
      id: "b1000000-0000-0000-0000-000000000003",
      importId: "a1b2c3d4-0001-0001-0004-000000000002",
      level: IssueLevel.error,
      message: "列数が想定と一致しません（期待: 12列 / 実際: 9列）。",
      rowNumber: null, columnName: null,
    },
    {
      id: "b1000000-0000-0000-0000-000000000004",
      importId: "a1b2c3d4-0001-0001-0004-000000000002",
      level: IssueLevel.error,
      message: '必須列「gross_margin」が見つかりません。',
      rowNumber: null, columnName: null,
    },
    {
      id: "b1000000-0000-0000-0000-000000000005",
      importId: "a1b2c3d4-0001-0001-0004-000000000002",
      level: IssueLevel.error,
      message: '日付列「month」がYYYY-MM形式ではありません。',
      rowNumber: null, columnName: null,
    },
  ] as const

  for (const issue of issueSeed) {
    await prisma.dataImportIssue.upsert({
      where: { id: issue.id },
      update: {},
      create: issue,
    })
  }
  console.log("✓ Upserted data import issues")

  // ============================================================
  // ファクトテーブル デモデータ（各20件）
  // sales_fact: 2サンプル行 × 10コピー
  // ============================================================
  const salesBase = [
    {
      customerCategory1Code: "C01", customerCategory1Name: "セレクトA",
      brandCode: "BR01", brandName: "UrbanLine",
      itemCode: "IT01", itemName: "トップス",
      productCode: "SKU001", productName1: "リネンシャツ", productName2: "ベージュ",
      cs1Code: "CS10", cs1Name: "定番", cs2Code: "CS20", cs2Name: "新作",
      staffCode: "S001", staffName: "佐藤",
      janCode: "4901234567890",
      netQty: 120, listPriceYen: BigInt(8900), netSalesYen: BigInt(1068000),
      returnYen: BigInt(0), grossProfitYen: BigInt(392000), grossProfitRate: 36.7,
    },
    {
      customerCategory1Code: "C02", customerCategory1Name: "百貨店B",
      brandCode: "BR02", brandName: "LuxeCoat",
      itemCode: "IT02", itemName: "アウター",
      productCode: "SKU005", productName1: "ウールコート", productName2: "グレー",
      cs1Code: "CS30", cs1Name: "高単価", cs2Code: "CS40", cs2Name: "定番",
      staffCode: "S002", staffName: "田中",
      janCode: "4901234567891",
      netQty: 45, listPriceYen: BigInt(28000), netSalesYen: BigInt(1260000),
      returnYen: BigInt(0), grossProfitYen: BigInt(420000), grossProfitRate: 33.3,
    },
  ]

  const salesImportId = "a1b2c3d4-0001-0001-0001-000000000001"
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < salesBase.length; j++) {
      const base = salesBase[j]
      const month = String(12 - (i % 12)).padStart(2, "0")
      await prisma.salesFact.upsert({
        where: { id: `c1${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001` },
        update: {},
        create: {
          id: `c1${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001`,
          importId: salesImportId,
          ...base,
          periodYm: new Date(`2024-${month}-01`),
          salesDate: new Date(`2024-${month}-${String(10 + i).padStart(2, "0")}`),
          netQty: base.netQty + i * 5,
          netSalesYen: base.netSalesYen + BigInt(i * 50000),
        },
      })
    }
  }
  console.log("✓ Upserted sales_fact (20 rows)")

  // payables_fact: 2サンプル行 × 10コピー
  const payablesBase = [
    {
      vendorName: "大阪繊維", vendorShort: "大阪繊維",
      prevBalanceYen: BigInt(820000), paymentYen: BigInt(1180000), carryoverYen: BigInt(0),
      netPurchaseYen: BigInt(1250000), purchaseYen: BigInt(1250000),
      returnYen: BigInt(0), discountYen: BigInt(0), otherYen: BigInt(0),
      taxYen: BigInt(125000), purchaseTaxInYen: BigInt(1375000), monthEndBalanceYen: BigInt(940000),
      cashYen: BigInt(0), checkYen: BigInt(0), transferYen: BigInt(1180000),
      billYen: BigInt(0), offsetYen: BigInt(0), discount2Yen: BigInt(0), feeYen: BigInt(0), other2Yen: BigInt(0),
    },
    {
      vendorName: "京都染工", vendorShort: "京都染工",
      prevBalanceYen: BigInt(540000), paymentYen: BigInt(760000), carryoverYen: BigInt(0),
      netPurchaseYen: BigInt(820000), purchaseYen: BigInt(820000),
      returnYen: BigInt(0), discountYen: BigInt(0), otherYen: BigInt(0),
      taxYen: BigInt(82000), purchaseTaxInYen: BigInt(902000), monthEndBalanceYen: BigInt(600000),
      cashYen: BigInt(0), checkYen: BigInt(0), transferYen: BigInt(760000),
      billYen: BigInt(0), offsetYen: BigInt(0), discount2Yen: BigInt(0), feeYen: BigInt(0), other2Yen: BigInt(0),
    },
  ]

  const payablesImportId = "a1b2c3d4-0001-0001-0002-000000000001"
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < payablesBase.length; j++) {
      const base = payablesBase[j]
      await prisma.payablesFact.upsert({
        where: { id: `c2${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001` },
        update: {},
        create: {
          id: `c2${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001`,
          importId: payablesImportId,
          ...base,
          paymentYen: base.paymentYen + BigInt(i * 10000),
          monthEndBalanceYen: base.monthEndBalanceYen + BigInt(i * 5000),
        },
      })
    }
  }
  console.log("✓ Upserted payables_fact (20 rows)")

  // receivables_fact: 2サンプル行 × 10コピー
  const receivablesBase = [
    {
      staffName: "佐藤", customerName: "南青山セレクト", customerShort: "南青山",
      prevBalanceYen: BigInt(420000), receivedYen: BigInt(980000), carryoverYen: BigInt(0),
      netSalesYen: BigInt(1080000), salesYen: BigInt(1080000),
      returnYen: BigInt(0), discountYen: BigInt(0), otherYen: BigInt(0),
      taxYen: BigInt(108000), salesTaxInYen: BigInt(1188000), monthEndBalanceYen: BigInt(520000),
      cashYen: BigInt(0), checkYen: BigInt(0), transferYen: BigInt(980000),
      billYen: BigInt(0), offsetYen: BigInt(0), discount2Yen: BigInt(0), feeYen: BigInt(0), other2Yen: BigInt(0),
      npCreditYen: BigInt(1200000), npPaymentsYen: BigInt(300000), creditLimitBalanceYen: BigInt(900000),
      notes: "主要卸先",
    },
    {
      staffName: "田中", customerName: "北陸百貨店", customerShort: "北陸",
      prevBalanceYen: BigInt(680000), receivedYen: BigInt(620000), carryoverYen: BigInt(0),
      netSalesYen: BigInt(940000), salesYen: BigInt(940000),
      returnYen: BigInt(0), discountYen: BigInt(0), otherYen: BigInt(0),
      taxYen: BigInt(94000), salesTaxInYen: BigInt(1034000), monthEndBalanceYen: BigInt(1000000),
      cashYen: BigInt(0), checkYen: BigInt(0), transferYen: BigInt(620000),
      billYen: BigInt(0), offsetYen: BigInt(0), discount2Yen: BigInt(0), feeYen: BigInt(0), other2Yen: BigInt(0),
      npCreditYen: BigInt(900000), npPaymentsYen: BigInt(120000), creditLimitBalanceYen: BigInt(780000),
      notes: "新規拡大",
    },
  ]

  const receivablesImportId = "a1b2c3d4-0001-0001-0003-000000000001"
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < receivablesBase.length; j++) {
      const base = receivablesBase[j]
      await prisma.receivablesFact.upsert({
        where: { id: `c3${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001` },
        update: {},
        create: {
          id: `c3${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001`,
          importId: receivablesImportId,
          ...base,
          receivedYen: base.receivedYen + BigInt(i * 10000),
          monthEndBalanceYen: base.monthEndBalanceYen + BigInt(i * 8000),
        },
      })
    }
  }
  console.log("✓ Upserted receivables_fact (20 rows)")

  // gross_profit_fact: 2サンプル行 × 10コピー
  const grossProfitBase = [
    {
      staffName: "佐藤", fiscalYear: 2024,
      customerCategory1Code: "C01", customerCategory1Name: "セレクトA",
      netQty: 1320, listPriceYen: BigInt(8600), netSalesYen: BigInt(10980000),
      returnYen: BigInt(0), grossProfitYen: BigInt(3920000), grossProfitRate: 35.7,
    },
    {
      staffName: "田中", fiscalYear: 2024,
      customerCategory1Code: "C02", customerCategory1Name: "百貨店B",
      netQty: 760, listPriceYen: BigInt(21500), netSalesYen: BigInt(16340000),
      returnYen: BigInt(0), grossProfitYen: BigInt(4860000), grossProfitRate: 29.7,
    },
  ]

  const grossProfitImportId = "a1b2c3d4-0001-0001-0004-000000000001"
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < grossProfitBase.length; j++) {
      const base = grossProfitBase[j]
      await prisma.grossProfitFact.upsert({
        where: { id: `c4${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001` },
        update: {},
        create: {
          id: `c4${String(i).padStart(6, "0")}-0000-0000-${String(j + 1).padStart(4, "0")}-000000000001`,
          importId: grossProfitImportId,
          ...base,
          fiscalYear: base.fiscalYear - (i % 3),
          netQty: base.netQty + i * 20,
          netSalesYen: base.netSalesYen + BigInt(i * 100000),
        },
      })
    }
  }
  console.log("✓ Upserted gross_profit_fact (20 rows)")

  // ============================================================
  // ProductBrand 初期データ
  // ============================================================
  const brands = [
    { brandCode: "BR01", name: "UrbanLine" },
    { brandCode: "BR02", name: "LuxeCoat" },
    { brandCode: "BR03", name: "ActiveGear" },
    { brandCode: "BR04", name: "RelaxWear" },
  ]

  for (const brand of brands) {
    await prisma.productBrand.upsert({
      where: { name: brand.name },
      update: { brandCode: brand.brandCode },
      create: brand,
    })
    console.log(`✓ Upserted product brand: ${brand.brandCode} ${brand.name}`)
  }

  // ============================================================
  // ProductCategory 初期データ
  // ============================================================
  const categories = [
    { categoryCode: "IT01", name: "トップス" },
    { categoryCode: "IT02", name: "アウター" },
    { categoryCode: "IT03", name: "ボトムス" },
    { categoryCode: "IT04", name: "小物" },
    { categoryCode: "IT05", name: "BAG" },
    { categoryCode: "IT06", name: "財布" },
    { categoryCode: "IT07", name: "首" },
    { categoryCode: "IT08", name: "ソックス" },
    { categoryCode: "IT09", name: "アンダー" },
  ]

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { name: cat.name },
      update: { categoryCode: cat.categoryCode, sellThroughDays: 60 },
      create: { ...cat, sellThroughDays: 60 },
    })
    console.log(`✓ Upserted product category: ${cat.categoryCode} ${cat.name}`)
  }

  // ============================================================
  // Warehouse（1件）
  // ============================================================
  const warehouseId = "eeee0001-0000-0000-0000-000000000001"
  await prisma.warehouse.upsert({
    where: { id: warehouseId },
    update: {},
    create: { id: warehouseId, name: "本社倉庫" },
  })
  console.log("✓ Upserted warehouse: 本社倉庫")

  // ============================================================
  // Products（4件）
  // ============================================================
  const brandUrbanLine = await prisma.productBrand.findUnique({ where: { name: "UrbanLine" } })
  const brandLuxeCoat = await prisma.productBrand.findUnique({ where: { name: "LuxeCoat" } })
  const brandActiveGear = await prisma.productBrand.findUnique({ where: { name: "ActiveGear" } })
  const brandRelaxWear = await prisma.productBrand.findUnique({ where: { name: "RelaxWear" } })
  const catTops = await prisma.productCategory.findUnique({ where: { name: "トップス" } })
  const catOuter = await prisma.productCategory.findUnique({ where: { name: "アウター" } })
  const catBottoms = await prisma.productCategory.findUnique({ where: { name: "ボトムス" } })

  const productsData = [
    {
      productCode: "SKU001",
      name: "リネンシャツ",
      brandId: brandUrbanLine?.id ?? null,
      categoryId: catTops?.id ?? null,
      season: "SS",
    },
    {
      productCode: "SKU005",
      name: "ウールコート",
      brandId: brandLuxeCoat?.id ?? null,
      categoryId: catOuter?.id ?? null,
      season: "AW",
    },
    {
      productCode: "SKU003",
      name: "デニムパンツ",
      brandId: brandActiveGear?.id ?? null,
      categoryId: catBottoms?.id ?? null,
      season: null,
    },
    {
      productCode: "SKU002",
      name: "コットンポロシャツ",
      brandId: brandRelaxWear?.id ?? null,
      categoryId: catTops?.id ?? null,
      season: "SS",
    },
  ]

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { productCode: product.productCode },
      update: { name: product.name, brandId: product.brandId, categoryId: product.categoryId, season: product.season },
      create: product,
    })
    console.log(`✓ Upserted product: ${product.productCode} ${product.name}`)
  }

  // 商品IDを取得
  const productMap = new Map<string, string>()
  for (const p of productsData) {
    const found = await prisma.product.findUnique({ where: { productCode: p.productCode } })
    if (found) productMap.set(p.productCode, found.id)
  }

  // ============================================================
  // ProductVariants（14件）
  // ============================================================
  const variantsData = [
    // リネンシャツ
    { productCode: "SKU001", color: "ベージュ",   size: "S",  janCode: "4901234567890", priceYen: BigInt(8900) },
    { productCode: "SKU001", color: "ベージュ",   size: "M",  janCode: "4901234567892", priceYen: BigInt(8900) },
    { productCode: "SKU001", color: "ブルー",     size: "S",  janCode: "4901234567893", priceYen: BigInt(8900) },
    { productCode: "SKU001", color: "ブルー",     size: "M",  janCode: "4901234567894", priceYen: BigInt(8900) },
    // ウールコート
    { productCode: "SKU005", color: "グレー",     size: "S",  janCode: "4901234567891", priceYen: BigInt(28000) },
    { productCode: "SKU005", color: "グレー",     size: "M",  janCode: "4901234567895", priceYen: BigInt(28000) },
    { productCode: "SKU005", color: "ブラック",   size: "S",  janCode: "4901234567896", priceYen: BigInt(28000) },
    { productCode: "SKU005", color: "ブラック",   size: "M",  janCode: "4901234567897", priceYen: BigInt(28000) },
    // デニムパンツ
    { productCode: "SKU003", color: "インディゴ", size: "28", janCode: "4901234567898", priceYen: BigInt(9800) },
    { productCode: "SKU003", color: "インディゴ", size: "30", janCode: "4901234567899", priceYen: BigInt(9800) },
    { productCode: "SKU003", color: "ブラック",   size: "28", janCode: "4901234567900", priceYen: BigInt(9800) },
    // コットンポロシャツ
    { productCode: "SKU002", color: "ホワイト",   size: "S",  janCode: "4901234567901", priceYen: BigInt(5800) },
    { productCode: "SKU002", color: "ホワイト",   size: "M",  janCode: "4901234567902", priceYen: BigInt(5800) },
    { productCode: "SKU002", color: "ブラック",   size: "S",  janCode: "4901234567903", priceYen: BigInt(5800) },
  ]

  for (const variant of variantsData) {
    const productId = productMap.get(variant.productCode)!
    await prisma.productVariant.upsert({
      where: { productId_color_size: { productId, color: variant.color, size: variant.size } },
      update: { janCode: variant.janCode, priceYen: variant.priceYen },
      create: { productId, color: variant.color, size: variant.size, janCode: variant.janCode, priceYen: variant.priceYen },
    })
    console.log(`✓ Upserted variant: ${variant.productCode} ${variant.color}/${variant.size} JAN:${variant.janCode}`)
  }

  // ============================================================
  // InventorySnapshotFact（14件, period_ym=2024-02-01）
  // ============================================================
  // period_ym = 2025-01-01（DBの既存売上データを考慮した上で確実に正の推定在庫になる値を設定）
  // closingQty = 2025-01-01以降の実際の売上合計 + 目標残在庫数
  const snapshotPeriod = new Date("2025-01-01")
  const snapshotImportId = "a1b2c3d4-0001-0001-0001-000000000001" // sales importのIDを流用
  const snapshotsData = [
    { id: "d0000001-0000-0000-0000-000000000001", janCode: "4901234567890", closingQty: 375  }, // sold_after=175, target=200
    { id: "d0000001-0000-0000-0000-000000000002", janCode: "4901234567891", closingQty: 365  }, // sold_after=235, target=130
    { id: "d0000001-0000-0000-0000-000000000003", janCode: "4901234567892", closingQty: 385  }, // sold_after=305, target=80
    { id: "d0000001-0000-0000-0000-000000000004", janCode: "4901234567893", closingQty: 665  }, // sold_after=620, target=45
    { id: "d0000001-0000-0000-0000-000000000005", janCode: "4901234567894", closingQty: 410  }, // sold_after=350, target=60
    { id: "d0000001-0000-0000-0000-000000000006", janCode: "4901234567895", closingQty: 575  }, // sold_after=525, target=50
    { id: "d0000001-0000-0000-0000-000000000007", janCode: "4901234567896", closingQty: 660  }, // sold_after=630, target=30
    { id: "d0000001-0000-0000-0000-000000000008", janCode: "4901234567897", closingQty: 40   }, // sold_after=0,   target=40
    { id: "d0000001-0000-0000-0000-000000000009", janCode: "4901234567898", closingQty: 55   }, // sold_after=0,   target=55
    { id: "d0000001-0000-0000-0000-000000000010", janCode: "4901234567899", closingQty: 70   }, // sold_after=0,   target=70
    { id: "d0000001-0000-0000-0000-000000000011", janCode: "4901234567900", closingQty: 25   }, // sold_after=0,   target=25
    { id: "d0000001-0000-0000-0000-000000000012", janCode: "4901234567901", closingQty: 85   }, // sold_after=0,   target=85
    { id: "d0000001-0000-0000-0000-000000000013", janCode: "4901234567902", closingQty: 90   }, // sold_after=0,   target=90
    { id: "d0000001-0000-0000-0000-000000000014", janCode: "4901234567903", closingQty: 35   }, // sold_after=0,   target=35
  ]

  for (const snap of snapshotsData) {
    await prisma.inventorySnapshotFact.upsert({
      where: { id: snap.id },
      update: { closingQty: snap.closingQty, periodYm: snapshotPeriod },
      create: {
        id: snap.id,
        importId: snapshotImportId,
        periodYm: snapshotPeriod,
        janCode: snap.janCode,
        closingQty: snap.closingQty,
      },
    })
    console.log(`✓ Upserted snapshot: JAN:${snap.janCode} closingQty:${snap.closingQty}`)
  }

  // ============================================================
  // InventoryStock（14件: 全バリアント × 本社倉庫）
  // ============================================================
  const stockOnHand: Record<string, number> = {
    "4901234567890": 180, "4901234567891": 130, "4901234567892": 82,
    "4901234567893": 47,  "4901234567894": 63,  "4901234567895": 52,
    "4901234567896": 33,  "4901234567897": 42,  "4901234567898": 58,
    "4901234567899": 72,  "4901234567900": 27,  "4901234567901": 88,
    "4901234567902": 93,  "4901234567903": 37,
  }
  for (const variant of variantsData) {
    const productId = productMap.get(variant.productCode)!
    const found = await prisma.productVariant.findUnique({
      where: { productId_color_size: { productId, color: variant.color, size: variant.size } },
    })
    if (!found) continue
    const onHand = stockOnHand[variant.janCode] ?? 0
    await prisma.inventoryStock.upsert({
      where: { variantId_warehouseId: { variantId: found.id, warehouseId } },
      update: { onHand },
      create: { variantId: found.id, warehouseId, onHand },
    })
  }
  console.log("✓ Upserted inventory stocks (14件)")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
