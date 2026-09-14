# Profile Research Benchmark

`my_profile` の見せ方を、公開されているエンジニアプロフィールの表現パターンと比較するための研究基盤です。

## 目的

採用通過率そのものを推定するのではなく、以下の「見せ方」を相対比較します。

- 技術スタックが短時間で伝わるか
- 自分の責任範囲が明記されているか
- 数字・規模・改善率などの根拠があるか
- 実装内容だけでなく成果が書かれているか
- GitHub / 公開成果物 / 技術記事への証拠導線があるか
- 見出し構造が整理されているか

## 収集元

既定では次を利用します。

- GitHub REST API: `portfolio` 系公開リポジトリの所有者を発見し、公開プロフィールと公開READMEを分析
- Qiita API v2: React / TypeScript の公開記事からユーザーを発見し、公開プロフィールと記事タイトルを分析
- Zenn RSS: `sources.json` に明示したユーザーのみ
- 公開ポートフォリオ: `termsConfirmed=true` を明示したURLのみ。robots.txt も確認してから取得

LinkedIn / Wantedly は自動収集対象にしません。

## 保存方針

外部ページの本文・README・記事本文は保存しません。実行中だけメモリ上で処理し、保存するのは数値化・分類した特徴量です。

自動発見した人物名やユーザーIDも成果物へそのまま保存せず、`sourceKey` にハッシュ化します。出力には収集元ドメインと特徴量だけを残します。

## 実行

```bash
npm run test:profile-research
npm run profile:research
```

GitHub API のレート制限を緩和したい場合だけ `GITHUB_TOKEN` を設定できます。トークンは GitHub API へのリクエストにだけ送信されます。

```bash
GITHUB_TOKEN=... npm run profile:research
```

最大収集件数は変更できます。

```bash
PROFILE_RESEARCH_MAX_SOURCES=50 npm run profile:research
```

## 設定

`profile-research/sources.json` を編集します。

自動発見設定の例:

```json
{
  "enabled": true,
  "query": "portfolio in:name language:TypeScript stars:1..200",
  "limit": 12
}
```

Zennを個別追加する場合:

```json
{
  "type": "zenn",
  "user": "username",
  "enabled": true
}
```

一般公開ポートフォリオを追加する場合は、利用規約上の取得可否を人間が確認してから `termsConfirmed` を有効にします。

```json
{
  "type": "portfolio",
  "url": "https://example.com/",
  "termsConfirmed": true,
  "enabled": true
}
```

## 出力

`artifacts/profile-research/` に生成されます。このディレクトリはGit管理しません。

- `latest.json`: 比較用の構造化特徴量
- `latest.md`: 人間向け比較レポート

主な特徴量:

- `headingCount`
- `externalLinkCount`
- `techCount`
- `metricCount`
- `impactMetricCount`
- `ownershipTermCount`
- `outcomeTermCount`
- `evidenceTermCount`
- `score.clarity`
- `score.evidence`
- `score.ownership`
- `score.outcomes`

## スコアの解釈

このスコアは採用担当者の評価や内定確率を表すものではありません。「プロフィール上で確認できる証拠や表現の量」を比較するヒューリスティックです。

GitHubで公開活動が多い人、Qiitaで記事を書く人、ポートフォリオを公開する人に標本が偏るため、平均値を「一般的なエンジニアの平均」と解釈しないでください。今後は経験年数・職種・制作会社出身などでコホートを分ける前提です。
