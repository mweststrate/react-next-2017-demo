import {
    getSnapshot,
    applySnapshot,
    onAction,
    applyAction,
    addMiddleware,
    recordPatches
} from "mobx-state-tree"

// naive atomic implementation for sync actions
export function atomic(call, next) {
    // record a preState
    const preState = getSnapshot(call.context)
    try {
        return next(call)
    } catch (e) {
        // exception: restore snapshot..
        applySnapshot(call.context, preState)
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
            runningActions.set(call.id, getSnapshot(call.context))
            break
        case "process_throw":
            applySnapshot(call.context, runningActions.get(call.id))
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
            const recorder = recordPatches(call.context)
            runningActions.set(call.rootId, recorder)
            try {
                return next(call)
            } finally {
                recorder.stop()
            }
        }
        case "process_yield":
        case "process_yield_error": {
            const recorder = runningActions.get(call.rootId)
            try {
                recorder.resume()
                return next(call)
            } finally {
                recorder.stop()
            }
        }
        case "process_throw":
            runningActions.get(call.rootId).undo()
            runningActions.delete(call.rootId)
            break
        case "process_return":
            runningActions.delete(call.rootId)
            break
    }
    return next(call)
}

const history = [] // { id, snapshot, call }[]

export function atomicAsyncAction(call, next) {
    const snapshot = getSnapshot(call.context)
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
                applySnapshot(call.context, snapshot)
                if (call.id === call.rootId) history.pop()
                throw e
            }
        case "process_throw":
            const idx = history.findIndex(item => item.id === call.rootId)
            applySnapshot(history[idx].call.context, history[idx].snapshot)
            const toReplay = history.splice(idx).slice(1)
            toReplay.forEach(item => {
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
