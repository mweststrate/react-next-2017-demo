/* eslint-disable */
import { getSnapshot, applySnapshot, recordPatches } from "mobx-state-tree"

// naive atomic implementation for sync actions
export function atomic(call, next) {
    // record a preState
    const preState = getSnapshot(call.tree)
    try {
        return next(call)
    } catch (e) {
        // exception: restore snapshot..
        applySnapshot(call.tree, preState)
        // ..and rethrow
        throw e
    }
}

// process supporting atomic implementation with snapshots
const runningActions = new Map()

export function atomicAsync(call, next) {
    switch (call.type) {
        case "action":
            return atomic(call, next)
        case "process_spawn":
            runningActions.set(call.id, getSnapshot(call.tree))
            break
        case "process_throw":
            applySnapshot(call.tree, runningActions.get(call.id))
            runningActions.delete(call.id)
            break
        case "process_return":
            runningActions.delete(call.id)
            break
    }
    return next(call)
}

export function atomicAsyncPatch(call, next) {
    switch (call.type) {
        case "action":
            return atomic(call, next)
        case "process_spawn": {
            const recorder = recordPatches(call.tree)
            runningActions.set(call.id, recorder)
            break
        }
        case "process_resume":
        case "process_resume_error": {
            const recorder = runningActions.get(call.id)
            try {
                recorder.resume()
                return next(call)
            } finally {
                recorder.stop()
            }
        }
        case "process_throw":
            runningActions.get(call.id).undo()
            runningActions.delete(call.id)
            break
        case "process_return":
            runningActions.delete(call.id)
            break
    }
    return next(call)
}

const history = [] // { id, snapshot, call }[]

export function atomicAsyncAction(call, next) {
    const snapshot = getSnapshot(call.tree)
    if (call.id === call.rootId) {
        history.push({
            id: call.id,
            snapshot,
            call
        })
    }

    switch (call.type) {
        case "action":
            try {
                return next(call)
            } catch (e) {
                // handle exception in a synchronous action
                if (call.id === call.rootId) {
                    history.pop()
                    applySnapshot(call.tree, snapshot)
                }
                throw e
            }
        case "process_throw":
            // handle exception in asynchronous process be rewinding and replaying actions
            const idx = history.findIndex(item => item.id === call.rootId)
            applySnapshot(history[idx].call.tree, history[idx].snapshot)
            const toReplay = history.splice(idx).slice(1)
            toReplay.forEach(async (item, i) => {
                await delay(2000 * (i + 1))
                item.call.context[item.call.name].apply(null, item.call.args)
            })
            break
    }
    return next(call)
}

export function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
