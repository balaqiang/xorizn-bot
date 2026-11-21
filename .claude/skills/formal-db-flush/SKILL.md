---
name: formal-db-flush
description: Exhaustively checks every ordering of app writes, flush timers, driver saves (success or failure), and shutdown against the real Database class in src/core/database/index.js. It proves the bot's data reaches storage, with one save in flight at a time and nothing lost on shutdown. Use it before and after any change to Database.save/flush/diff/close/init, to a driver's save/close in src/core/database/drivers/, or to shutdown in src/core/lifecycle.js.
---

# Formal check: database flush and shutdown

All bot state (users, groups, settings, dashboard sessions, custom commands, stats) lives in memory in `Database.data` and is copied to storage by `flush()`. Three things can trigger a flush: a 2 s debounce after each `save()`, a 10 s `setInterval`, and `close()` at shutdown. Any of them can fire while a slow driver save is still running. Ordinary tests never hit those overlaps. This check tries all of them.

## The properties

| id | property, in one sentence | harm when broken |
| --- | --- | --- |
| P1 close-durable | When `close()` resolves, storage holds every document as memory held it when `close()` was called. | `lifecycle.shutdown()` calls `realExit()` right after `close()`, so anything not yet stored is lost on `.restart`, a dashboard restart, or Ctrl-C. |
| P2 converges | If the app stops writing and the bot keeps running, storage ends equal to memory. | A change marked as saved but never written is lost forever, even with no restart. |
| P3 one-writer | Never more than one `driver.save()` in flight. | Two overlapping saves can finish out of order. An older snapshot then overwrites a newer one (JSON file, or SQL rows). |
| close-hangs | `close()` resolves once every save has completed. | Shutdown waits for the 8 s fallback timer instead. |

A save that fails after `close()` was called exempts that path from P1. That loss is already logged as `flush terakhir gagal`.

## Tool, and why this one

`explore.mjs` is a stateless model checker that runs on the real code. It imports the real `Database` class, replaces `setTimeout`/`setInterval` with fakes it fires itself, and gives the class a fake driver whose `save()` promises it resolves or rejects itself. It then runs a breadth-first search over every order of these events:

- `set:a`, `set:b`, `del:a`: app writes
- `tick`: the interval fires
- `debounce`: the debounce timer fires
- `done:N`, `fail:N`: save N completes or fails
- `close`: shutdown calls `close()`

After each event it drains all microtasks, so the code runs exactly as it would up to its next await on the driver.

JavaScript is single-threaded, so the only interleavings are at those awaits and timer callbacks, and the explorer controls all of them. Checking the code itself, not a hand-written TLA+ model, means the check cannot drift from the code. It needs only Node. Java and TLC are not installed here. The search is not a TLA+ model, so `/statechart` does not apply.

It runs the search twice, once for each storage semantic the drivers have:

- `json`: `drivers/json.js` takes `JSON.stringify(data)` synchronously when `save()` is called and writes the whole file atomically (tmp + rename).
- `rows`: `drivers/sqlite.js`, `mysql.js`, and `postgres.js` apply the given upserts and deletes in one transaction.

## Run it

```
node .claude/skills/formal-db-flush/explore.mjs              # depth 8, both drivers, ~2 s
node .claude/skills/formal-db-flush/explore.mjs --depth 10   # near the whole reachable state space (~4,300 states), ~2 s
node .claude/skills/formal-db-flush/explore.mjs --depth 6 --no-dedupe   # cross-check the state merging (tree search, no merging)
```

Exit 0 means no violation in scope. Exit 1 means a violation, and the script prints the shortest counterexample for each failed property as numbered steps in the code's terms. Exit 2 or a stack trace is a harness error, not a verdict.

**Expected today: exit 0, every property ok, for both drivers.** F1 below is fixed. Any FAIL after your change is new.

## Reading a result

- **A FAIL on P2 or P3, or a new P1 schedule.** Read the trace. Each line names the call (`db.set`, `flush()`, `driver.save #N`, `close() RESOLVED`) and shows memory and storage. If the same order can happen in the real bot, it is a real bug. Report it with the trace, and do not weaken the property.
- **When it is a modeling error instead.** It is a modeling error only if the fake world allows something the real one cannot. For example, a driver whose `save()` completes synchronously, as `sqlite.js` does with `exec` (see Scope). Or an event the code can no longer produce, such as a timer you removed. Fix `explore.mjs`, which owns `enabled()` and the fake driver, and say why in the coverage record.
- **States and runs counts.** These show how much was searched. A big drop after a change means the search space shrank. Check that the events still fire.

## Coverage record

Last confirmed in sync at commit `188b8ba7b1bed446c343d77e8937e17cb5c4166e`, plus the F1 fix in `Database.flush()`, which was not yet committed at that point. Once the fix is committed, rerun the check. If it still exits 0, move the sync commit to that commit. Until then, the `git diff` below also shows the F1 fix itself, and that part is already verified.

| code | what the check relies on |
| --- | --- |
| `src/core/database/index.js`: `Database.save`, `flush`, `diff`, `close`, `init` (the `setInterval`), `set`, `delete` | run for real |
| `src/core/database/drivers/json.js`: `save`, `close` | modeled as `json`: a snapshot taken at call time, applied atomically on completion |
| `src/core/database/drivers/{sqlite,mysql,postgres}.js`: `save`, `close` | modeled as `rows`: the upserts and deletes applied atomically on completion |
| `src/core/lifecycle.js`: `shutdown` | assumed: `realExit()` runs as soon as `close()` resolves (this is what makes P1 matter) |

To see whether a change touches the verified code:

```
git diff 188b8ba7b1bed446c343d77e8937e17cb5c4166e -- src/core/database/index.js src/core/database/drivers/ src/core/lifecycle.js
```

If that diff is non-empty, run the check, read the result, and update `explore.mjs` if the change was intended (new events or new driver behavior). Move the sync commit above only after you have confirmed that the explorer again describes the code at the new commit.

## Scope and bounds

- **Bounds.** Up to 3 app writes across 2 documents (with deletes), 2 interval ticks, and 1 failed save, in schedules of up to 8 events (10 with `--depth`). After each schedule an idle phase runs: saves succeed and timers fire.
- **Real time is ignored.** The 2 s and 10 s timers may fire in any order relative to saves. That is a superset of real behavior, so a pass is conservative. A FAIL still needs the plausibility check in "Reading a result".
- **Out of scope.** `init()`/`load()` handling of corrupt rows, `exportTo()` and migration, `blob()`, a process killed mid-write (atomicity of tmp+rename or of a transaction is assumed), several processes on one database, the driver internals.
- **SQLite.** `sqlite.js` runs its transaction synchronously inside `save()`, so in practice no app write can land between start and completion. F1's window is real for `json` (async `writeFile`), `mysql`, and `postgres`.

## Findings

**F1 (fixed): `close()` could resolve before the last changes were stored (P1).** Shortest schedule on the old code:

1. app: `db.set('users','a',{v:1})`
2. the 10 s interval fires `flush()`, and `driver.save #1` starts with `a=1`
3. app: `db.set('users','a',{v:2})` (a message arrives during the save)
4. shutdown: `close()` calls `flush()`. That call sees `this.flushing`, sets `pending = true`, and returns save #1's promise.
5. save #1 completes, storage holds `a=1`. The first `flush()` starts `driver.save #2` for `a=2`. But `close()` was only waiting on save #1: it calls `driver.close()` and resolves, then `lifecycle.shutdown()` calls `realExit()` while save #2 is still running. `a=2` is lost.

Fix in `Database.flush()`: a caller that finds a flush in flight now waits for it, then flushes again. So it returns only after its own changes are stored.

```js
if (this.flushing) {
  this.pending = true
  await this.flushing.catch(() => {})
  return this.flush()
}
```

After the fix, every property passes at depth 10 for both drivers (4,152 states). The cross-check at depth 6 without state merging agrees. The real app was also run with `verify-xorizn-bot`: data changed just before a graceful shutdown was in `data/database.json` afterwards.

To see the old failure again, put the old two lines back in a scratch change (`this.pending = true` then `return this.flushing`). The check exits 1 with the schedule above. Then restore the file.

## Proof this check can fail

Each property was shown failing on a scratch change to the real `src/core/database/index.js`, which was then restored (`git diff` against HEAD was empty again):

- **B1.** Removed the `if (this.flushing) { … }` guard. P3 failed in 3 events (`set:a → tick → tick`). P2 also failed, because an older save finished last.
- **B2.** After a save, set the snapshot from current memory instead of from the rows that were saved. P2 failed in 3 events (`set:a → tick → set:a`).
- **F1, the reverse direction.** Before the fix, the unchanged code failed P1, and the fix made it pass. So the check tells the old `flush()` from the new one.
