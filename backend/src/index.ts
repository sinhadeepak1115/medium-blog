import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();


app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password
      }
    });
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);
    return c.text(jwt);
  } catch (e) {
    console.log(c.env.DATABASE_URL)
    console.log(e);
    return c.status(403);
  }
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('signin route')
})

app.post('/api/v1/blog', (c) => {
  return c.text('post blog')
})
app.put('/api/v1/blog', (c) => {
  return c.text('put blog')
})
app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  console.log(id)
  return c.text('get blog route')
})
app.get('/api/v1/blog/bluk', (c) => {
  return c.text('get blog bulk')
})

export default app
