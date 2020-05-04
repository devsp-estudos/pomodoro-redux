const toDoList = {
    add: (indicator, name) => ({
        type: 'ADD_TASK',
        value: {
            done: false,
            indicator,
            name
        }
    }),

    edit: (indicator, name) => ({
        type: 'EDIT_TASK',
        value: {
            indicator,
            name,
        }
    }),

    del: (indicator) => ({
        type: 'DEL_TASK',
        value: indicator
    }),

    change: (indicator) => ({
        type: 'CHANGE_DONE',
        value: indicator
    }),
}

export default toDoList
