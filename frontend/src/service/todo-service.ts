/* import { produce } from 'immer'
import {Model, Todo, store} from '../model'

class TodoService{

    async getAll() {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const todos: Todo[] = await response.json()
        console.log(todos)

        const model = produce(store.getValue(), draft => {
            draft.todos = todos
        })

        store.next(model)
    }
}

const todoService = new TodoService()
export default todoService
*/