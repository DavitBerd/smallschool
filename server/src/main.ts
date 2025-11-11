import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
dotenv.config();

const createAdminIfNotExists = async (usersService: UsersService) => {
  const adminEmail = 'admin@example.com';
  const existingAdmin = await usersService.findByEmail(adminEmail);
  if (!existingAdmin) {
    await usersService.create({
      email: adminEmail,
      password: 'admin12345',
      role: 'admin',
      semesters: [0, 0, 0],
      missedLectures: 0,
      group: '',
    });
    console.log('Admin user created: admin@example.com / admin12345');
  }
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);

  const usersService = app.get(UsersService);
  await createAdminIfNotExists(usersService);
}
bootstrap();
