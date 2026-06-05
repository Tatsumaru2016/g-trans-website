# G.trans Website

G.trans 翻訳ツールのプロモーションサイト。3D 宇宙空間をスクロールしながら体験する scrollytelling 形式の Web アプリです。

## 公開サイト

**https://tatsumaru2016.github.io/g-trans-website/**

`main` ブランチへ push すると GitHub Actions が自動デプロイします。

## 技術スタック

- React 19 + TypeScript + Vite 6
- Three.js / React Three Fiber
- GSAP ScrollTrigger
- Tailwind CSS v4

## セットアップ

**前提:** Node.js 18 以上

```bash
npm install
```

環境変数（任意・将来の API 連携用）:

```bash
cp .env.example .env.local
```

`.env.local` の `GEMINI_API_KEY` を設定してください（現状のフロントエンド単体では未使用）。

## 開発

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## ビルド

```bash
npm run build
npm run preview
```

## プロジェクト構成

```
src/
├── App.tsx                 # ルート（ブートローダー + レイアウト）
├── components/
│   ├── DeepSpaceCanvas.tsx # 3D シーン本体
│   ├── ScrollyOverlay.tsx  # スクロール連動 HUD
│   └── ...                 # 各 3D コンポーネント
├── index.css               # グローバルスタイル
└── main.tsx                # エントリーポイント
```
