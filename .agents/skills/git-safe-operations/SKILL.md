---
name: git-safe-operations
description: Git管理されたリポジトリで編集、stage、commit、normal push、通常mergeを安全に行う。作業開始前から存在する変更を保持し、今回の対象だけを検査・反映する。通常Git保存は都度ユーザー承認ではなく自己レビューで決定し、履歴改変・force push・破壊的操作・production境界だけを別gateとして扱う。
compatibility: Codex、ChatGPT、およびAgent Skills互換環境。Git作業ツリーまたはGitHubリポジトリの状態、差分、履歴を確認できること。
---

# Git安全操作

## 目的

Git作業で、今回の依頼と無関係な変更を壊したり混ぜたりせず、必要な変更を安全に正本へ保存する。

このSkillの既定は次。

```text
Git管理対象へのwrite依頼
→ 編集
→ 自己レビュー
→ 対象だけstage
→ normal commit
→ normal push
→ 必要なら通常merge
→ remote read-back
```

**normal commit / normal push / 通常mergeのために、都度ユーザーへ許可を取り直さない。**

ユーザーが明示的に`commitしない`、`pushしない`、`mergeしない`、`draftだけ`等と指定した場合は、その指定を優先する。

## 基本原則

### 1. write依頼には通常Git保存を含める

Git管理された正本・実装・設計・Prompt等について、ユーザーが作成、修正、実装、更新、反映を依頼した場合、通常のGit保存処理を作業完了までの一部として扱う。

通常Git保存:

- 対象差分のstage
- normal commit
- normal push
- 作業フロー上必要な通常merge
- push / merge後のremote read-back

これらは個別の追加承認を要求せず、後述の自己レビューgateで決定する。

read-only調査、レビューのみ、説明のみの依頼ではwriteを開始しない。

### 2. 自己レビューでcommit / push / mergeを判定する

commit、push、merge前に最低限次を確認する。

```text
scope: 今回の対象だけか
existing changes: 作業開始前の変更を混ぜていないか
secret/privacy: 秘密情報・個人情報を含まないか
verification: 必要なtest/lint/build/diff checkが妥当か
remote: upstream driftを確認したか
merge: 変更意図・CI・branch protection・production side effectを確認したか
```

自己レビューPASSなら通常操作を続行する。

自己レビューFAILなら、修正可能な問題は修正して再レビューする。正しい判断ができない競合、重大な検証失敗、production別gate不足などが残る場合だけ停止する。

### 3. 既存変更を今回の変更として扱わない

作業開始時に最低限次を確認する。

```bash
git status --short --branch
git diff --stat
git diff --cached --stat
```

必要に応じて:

```bash
git diff -- <target>
git diff --cached -- <target>
git log -n 5 --oneline --decorate
git rev-list --left-right --count @{upstream}...HEAD
```

作業開始前の変更は保持する。同一fileに既存変更がある場合はhunk単位で分離し、分離不能な箇所だけ停止する。

### 4. 一括stageを避ける

原則:

```bash
git add -- path/to/file1 path/to/file2
git add -p -- path/to/file
```

`git add .` / `git add -A`は、全変更が今回scopeであり、秘密情報・生成物・対象外変更がないことを実際に確認できた場合だけ使用できる。

### 5. commit前に差分を読む

最低限:

```bash
git diff --cached --stat
git diff --cached --check
git diff --cached
```

確認するもの:

- 対象外file/hunk混入なし
- 意図しない削除なし
- credential / token / `.env`等の混入なし
- debug・temporary outputなし
- generated file / lockfile差分が意図どおり
- 要件とtestsの整合

## Normal commit / push

### commit

自己レビューPASSならnormal commitを行う。

commit messageはrepo固有規約がなければ日本語を既定とする。

例:

```text
Git通常操作を自己レビュー判断へ変更
fix: 入力検証の境界条件を修正
```

commit後:

```bash
git show --stat --oneline --decorate HEAD
git status --short --branch
```

### push

可能ならpush前に:

```bash
git fetch --prune
git rev-list --left-right --count @{upstream}...HEAD
```

fast-forward可能で、関連検証がPASSし、対象branchが正しい場合はnormal pushを行う。

今回変更に関係する重大なtest failureが残る場合はpushしない。原因を修正できるなら修正して再レビューする。

## Normal merge

通常mergeも都度ユーザー承認を要求しない。

PRまたはbranchをmergeしてよい条件:

```text
対象PR/branch identity確認
差分scope確認
required CI / checks確認
既知review findings解消
branch protectionを迂回しない
merge conflictがない、または正しく解消可能
merge後の検証・read-back経路がある
```

merge conflictがある場合、両側の意図を根拠から判断できる箇所だけ解消する。対象外変更や意図不明箇所を推測で解消しない。

mergeがproduction deploy / irreversible applyを直接triggerする場合、**Git merge自体の追加承認は不要でも、production側の既存gateは解除しない。** production gateが未成立ならmergeを停止する。

## GitHub Contents API等

GitHub Contents APIのcreate/updateはwriteとcommitが同時に起きるため、通常Git保存の一種として扱う。

実行前に:

- repository / branch / path
- current blob SHA
- current contentと新contentの差分
- 並行更新の有無

を確認する。

Git管理対象へのwrite依頼がある場合、API direct commitのためだけに追加ユーザー承認を要求しない。

409等でSHA driftが発生した場合はlatestをfresh-readし、安全に再適用できる場合だけ再実行する。

## 別gateを維持する操作

以下はnormal Git保存へ含めない。

### 履歴改変・force系

- `git commit --amend`
- interactive rebase
- squash / drop / rewordによる公開履歴変更
- `git reset --soft|mixed|hard`
- `git push --force` / `--force-with-lease`
- 公開済みtag移動・上書き

必要なら影響と安全性を評価し、既存の履歴改変authorizationルールに従う。通常commit / push / mergeの自己レビュー許可を拡張しない。

### 破壊的worktree操作

既存変更を片付ける目的で次を黙って使わない。

- `git reset --hard`
- `git checkout -- <path>`
- `git restore <path>`
- `git clean -fd`
- stashの作成・適用・削除

### Git外の高リスク操作

次のauthorizationは本Skillで代替しない。

- production data write / delete
- irreversible migration
- credential / permission変更
- destructive filesystem delete
- physical data delete
- user-facing external send等、別Workflowで明示gateを持つ操作

## 実行フロー

```text
1. repo / branch / upstream / HEAD / worktreeを確認
2. 既存変更と今回scopeを分離
3. 編集
4. diff確認
5. 必要なtests / lint / build / verifier
6. 対象だけstage
7. staged diff自己レビュー
8. normal commit
9. remote drift確認
10. normal push
11. 必要ならPR/branchを自己レビューして通常merge
12. remote read-back / CI postcheck
13. 結果報告
```

## 停止条件

ユーザー再確認ではなく、**正しい判断不能または別gate不足**を停止理由とする。

停止する例:

- 既存変更と今回変更を安全に分離できない
- secret / credential混入疑い
- 今回変更に関係する重大なtest failureを解消できない
- remote driftの統合意図を判断できない
- merge conflictの正しい解消を判断できない
- branch / repository / target identityを確認できない
- mergeがproduction actionをtriggerし、production gateが未成立
- force push / history rewriteが必要

単に「commit / push / mergeのユーザー許可をまだ聞いていない」は停止理由にしない。

## 完了報告

最低限:

```text
変更scope
自己レビュー結果
検証結果
commit SHA
push branch / remote read-back
mergeした場合はmerge SHA / PR
保持した既存変更
残るblocker
```

## 完了条件

- 既存変更を保持した
- 今回scopeだけを反映した
- staged diffを自己レビューした
- 必要な検証を実施した
- normal commit / pushを必要に応じて完了した
- 通常mergeが必要なら自己レビューで可否を決定した
- force/history rewrite/production等の別gateを越権していない
- remote stateを確認した
- 結果を正確に報告した
