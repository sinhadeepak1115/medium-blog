import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signInput } from '../zod'

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  const { success } = signInput.safeParse(body);
  if (!success) {
    c.status(411)
    return c.text("Inputs not correct")
  }
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
    console.log(e);
    return c.status(403);
  }
})

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json();
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: body.username
      }
    });
    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" })
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.text(jwt);
  } catch (e) {
    console.log(e)
    return c.status(403)
  }
})


