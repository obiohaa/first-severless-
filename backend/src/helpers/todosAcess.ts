import * as AWS from 'aws-sdk'
const AWSXRay = require ('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
// const todosTable = process.env.TODOS_TABLE
// const index = process.env.TODOS_CREATED_AT_INDEX
// const docClient: DocumentClient = createDynamoDBClient()
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

// // TODO: Implement the dataLayer logic

// GET ALL TODO ITEMS
async getTodos(userId: String): Promise<TodoItem[]> {
  try {
    const resultedItems = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return resultedItems.Items as TodoItem[]
  } catch (e) {
    console.log(e.message)
  }
}


//CREATE A TODO ITEM
  async createTodo(createTodoItem: TodoItem): Promise<TodoItem> {
    try {
      await this.docClient
        .put({
          TableName: this.todosTable,
          Item: createTodoItem
        })
        .promise()

      return createTodoItem
    } catch (e) {
      console.log(e.message)
    }
  }


  //UPDATE TODO ITEM
  async updateTodo(
    todoItemUpdate: TodoUpdate,
    userId: string,
    todoItemId: string
  ): Promise<TodoUpdate> {
    try {
      const updateItemResult = await this.docClient
        .update({
          TableName: this.todosTable,
          Key: {
            userId: userId,
            todoId: todoItemId
          },
          UpdateExpression:
            'SET #name = :name, #dueDate = :dueDate, #done= :done',
          ExpressionAttributeNames: {
            '#name': 'todoItemName',
            '#dueDate': 'ItemDueDate',
            '#done': 'itemStatus'
          },
          ExpressionAttributeValues: {
            ':name': todoItemUpdate['name'],
            ':dueDate': todoItemUpdate['dueDate'],
            ':done': todoItemUpdate['done']
          },
          ReturnValues: 'ALL_NEW'
        })
        .promise()
      return updateItemResult.Attributes as TodoUpdate
    } catch (e) {
      console.log(e.message)
    }
  }


  //DELETE A TODO ITEM
  async deleteTodo(userId: string, todoItemId: string): Promise<Boolean> {
    try {
      await this.docClient
        .delete({
          TableName: this.todosTable,

          Key: {
            userId: userId,
            todoId: todoItemId
          }
        })
        .promise()

      return true
    } catch (e) {
      console.log(e.message)
    }
  }
}


  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }