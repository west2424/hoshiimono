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

### 3. Google ログインを有効にする

1. Firebase コンソールの「Authentication」→「Sign-in method」を開く
2. 「Google」を選び、有効にして保存

### 4. Firestore のセキュリティルールを設定する

このアプリはGoogleログインしたアカウントの中でも、特定の1人だけがタスクを読み書きできるように制限します。

1. `firestore.rules` を開き、`YOUR_EMAIL@example.com` を自分がログインに使うGoogleアカウントのメールアドレスに書き換える
2. Firebase コンソールの「Firestore Database」→「ルール」を開き、その内容をまるごと貼り付けて「公開」

これで、指定したメールアドレス以外のGoogleアカウントではタスクの読み書きができなくなります。

### 5. 開発サーバーを起動する

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## デプロイ(スマホからもアクセスできるようにする)

[Vercel](https://vercel.com/new) にこのリポジトリを import し、`.env.local` と同じ環境変数をVercelの Environment Variables に設定してデプロイすると、発行されたURLにスマホ・PCどちらからでもアクセスできます。

デプロイ後、発行されたURL(例: `hoshiimono.vercel.app`)を Firebase コンソールの「Authentication」→「Settings」→「承認済みドメイン」に追加してください。追加しないと、そのURL上でGoogleログインが失敗します。
