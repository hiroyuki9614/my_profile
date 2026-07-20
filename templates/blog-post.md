# ブログ記事テンプレート

このファイルのフロントマターを、新しく作成する `src/content/posts/*.md` の先頭へコピーして使用します。

## 使用できる値

- `category`: `"日記"` / `"メモ"` / `"知識"` / `"仕事"`
- `status`: `"published"` / `"unpublished"`
- `description`: 任意
- `image`: 任意
- `tags`: 任意

公開前の誤表示を避けるため、初期状態は `unpublished` とします。

```markdown
---
title: "記事タイトル"
date: 2026-07-20
category: "日記"
description: ""
tags: []
image: ""
status: "unpublished"
---

## はじめに

記事の背景や、この記事で扱う問いを書きます。

## 本文

具体的な経験、事実、考察を書きます。

## まとめ

記事を通して分かったことや、現時点での結論を書きます。
```
