import {
    getSnapshot,
    applySnapshot,
    onAction,
    applyAction,
    addMiddleware,
    recordPatches
} from "mobx-state-tree"

export function atomicActions(call, next) {
    // we are only interested in "root" actions
    if (call.id !== call.rootId) return next(call)
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
