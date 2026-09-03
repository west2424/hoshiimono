自分専用のタスク管理 Web アプリです。[Next.js](https://nextjs.org) + [Firebase Firestore](https://firebase.google.com/docs/firestore) で作られていて、追加・完了・削除がリアルタイムに同期されるので、スマホとPCの両方から同じタスク一覧にアクセスできます。

## セットアップ

### 1. Firebase プロジェクトを作る

1. [Firebase コンソール](https://console.firebase.google.com/)で新しいプロジェクトを作成
2. 「Firestore Database」を有効化(テストモードで開始してOK)
3. 「プロジェクトの設定」→「全般」→「マイアプリ」でウェブアプリを追加し、SDK構成の値を控える

### 2. 環境変数を設定する

`.env.local.example` を `.env.local` にコピーし、Firebase の値を入力します。

```bash
cp .env.local.example .env.local
```

### 3. Firestore のセキュリティルールを設定する

このアプリはログイン機能を持たない、個人利用向けの簡易構成です。第三者に `tasks` コレクションを読み書きされないよう、Firestore のルールを自分専用に絞ってください(例: 特定のプロジェクトからのアクセスのみ許可する、Firebase Authenticationを別途組み込んで `request.auth != null` を条件にする、など)。

### 4. 開発サーバーを起動する

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## デプロイ(スマホからもアクセスできるようにする)

[Vercel](https://vercel.com/new) にこのリポジトリを import し、`.env.local` と同じ環境変数をVercelの Environment Variables に設定してデプロイすると、発行されたURLにスマホ・PCどちらからでもアクセスできます。
