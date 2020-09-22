import { Router } from 'https://deno.land/x/oak/mod.ts';
import { Database } from 'https://deno.land/x/mongo@v0.12.1/mod.ts';

import { getDb } from '../helpers/db_client.ts';

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

interface TodoSchema {
  _id: { $oid: string };
  text: string;
}

interface transformedTodo {
  id: string;
  text: string;
}

router.get('/todos', async (ctx) => {
  const todos: TodoSchema[] = await getDb()
    .collection<TodoSchema>('todos')
    .find(); // { _id: ObjectId(), text: '...' }[]
  const transformedTodos: transformedTodo[] = todos.map((todo: TodoSchema) => {
    return { id: todo._id.$oid, text: todo.text };
  });
  ctx.response.body = { todos: transformedTodos };
});

router.post('/todos', async (ctx) => {
  const result = ctx.request.body();
  const data = await result.value;

  const insertId = await getDb().collection<TodoSchema>('todos').insertOne({
    text: data.text,
  });

  ctx.response.body = { message: 'Created todo!', id: insertId };
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;
  const result = await ctx.request.body();
  const data = await result.value;
  // await console.log(data);

  await getDb()
    .collection<TodoSchema>('todos')
    .updateOne({ _id: { $oid: tid } }, { $set: { text: data.text } });

  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;

  await getDb()
    .collection('todos')
    .deleteOne({ _id: { $oid: tid } });

  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
