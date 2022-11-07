import { TodosAccess } from '../helpers/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'


// TODO: Implement businessLogic
const todoAccess = new TodosAccess()
const s3attachment = process.env.ATTACHMENT_S3_BUCKET

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getTodos(userId)
}

export function createTodo(
  createNewItemRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid()
  const createItemParams = {
    userId: userId,
    todoId,
    attachmentUrl: `https://${s3attachment}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().toISOString(),
    done: false,
    ...createNewItemRequest
  }

  return todoAccess.createTodo(createItemParams)
}

export function deleteTodo(userId: string, todoId: string): Promise<Boolean> {
  return todoAccess.deleteTodo(userId, todoId)
}

export function updateTodo(
  updateItemRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<TodoUpdate> {
  return todoAccess.updateTodo(updateItemRequest, userId, todoId)
}
