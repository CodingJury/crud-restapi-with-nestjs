import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as pactum from "pactum"
import { AppModule } from 'src/app.module'
import { AuthDto } from 'src/auth/dto'
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { EditUserDto } from 'src/user/dto'

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduelRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduelRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }))
    await app.init()
    await app.listen(3333);

    prisma = app.get(PrismaService)
    await prisma.cleanDb() //! empty the database (start from fresh)
    pactum.request.setBaseUrl('http://localhost:3333')
  }, 10000) //time in millisecond to wait before doing anything (load modules)

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email:"dhananjay@gmail.com",
      password: "thispasswordisveryhard"
    }
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signup').withBody({password: dto.password}).expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signup').withBody({email: dto.email}).expectStatus(400)
      })
      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400)
      })
      it('should signup', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })
    })

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signin').withBody({password: dto.password}).expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signin').withBody({email: dto.email}).expectStatus(400)
      })
      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400)
      })
      it('should signin', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token')
      })
    })
  })

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/me').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200)
      })
    })

    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: 'Sanya',
        email: 'sanya@gmail.com'
      }
      it('should edit user', () => {
        return pactum.spec().patch('/users').withHeaders({Authorization: 'Bearer $S{userAt}'}).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email)
      })
    })
  })

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it("should get bookmarks", () => {
        return pactum.spec().get('/bookmarks').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200).expectBody([])
      })
    })

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: "First",
        link: "https://www.youtube.com"
      }
      it("should create bookmarks", () => {
        return pactum.spec().post('/bookmarks').withHeaders({Authorization: 'Bearer $S{userAt}'}).withBody(dto).expectStatus(201).stores('bookmarkId', 'id')
      })
    })

    describe('Get bookmarks', () => {
      it("should get bookmarks", () => {
        return pactum.spec().get('/bookmarks').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200).expectJsonLength(1)
      })
    })

    describe('Get bookmark by id', () => {
      it("should get bookmark by id", () => {
        return pactum.spec().get('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200).expectBodyContains('$S{bookmarkId}')
      })
    })

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Second',
        description: 'this is youtube link'
      }
      it("should edit bookmark by id", () => {
        return pactum.spec().patch('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({Authorization: 'Bearer $S{userAt}'}).withBody(dto).expectStatus(200).expectBodyContains(dto.title).expectBodyContains(dto.description).inspect()
      })
    })

    describe('Delete bookmark by id', () => {
      it("should delete bookmark by id", () => {
        return pactum.spec().delete('/bookmarks/{id}').withPathParams('id', '$S{bookmarkId}').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(204).inspect()
      })

      it('should get empty bookmark', () => {
        return pactum.spec().get('/bookmarks').withHeaders({Authorization: 'Bearer $S{userAt}'}).expectStatus(200).expectJsonLength(0).inspect()
      })
    })
  })
})