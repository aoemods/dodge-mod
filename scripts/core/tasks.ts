export type TaskDefinition = {
    periodic?: boolean
    interval: number
    callback: () => void
}

export type Task = {
    id: number
}

let nextTaskIndex = 0

export function createTask(def: TaskDefinition): Task {
    const { periodic, interval, callback } = def

    const g = globalThis as any
    const taskName = `task_${nextTaskIndex++}`
    g[taskName] = callback

    const id = periodic ?
        Rule_AddInterval(g[taskName], interval) :
        Rule_AddOneShot(g[taskName], interval)

    print(`Started task ${id}`)

    return {
        id
    }
}

export function stopTask(task: Task) {
    if (Rule_ExistsWithID(task.id)) {
        print(`Stopping task ${task.id}`)
        Rule_RemoveWithID(task.id)
    }
}
