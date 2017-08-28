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

export function atomicAsync2(call, next) {
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

export function synchronizeActions(stores, actionNames) {
    stores.forEach(source => {
        onAction(source, action => {
            if (actionNames.includes(action.name))
                stores.forEach(target => {
                    if (target !== source) applyAction(target, action)
                })
        })
    })
}

export function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

export function undoRedoMiddleware(store, actionNames) {
    let idx = -1
    const undoStack = []

    addMiddleware(store, (call, next) => {
        if (actionNames.includes(call.name)) {
            const recorder = recordPatches(store)
            const res = next(call)
            recorder.stop()
            idx++
            undoStack.splice(idx)
            undoStack.push(recorder)
            return res
        } else {
            return next(call)
        }
    })

    return {
        undo() {
            if (idx >= 0) {
                undoStack[idx].undo()
                idx--
            }
        },
        redo() {
            if (idx < undoStack.length - 1) {
                idx++
                undoStack[idx].replay()
            }
        }
    }
}
