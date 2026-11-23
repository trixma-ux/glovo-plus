import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthThrottlerGuard } from './common/auth-throttler.guard';
import { ProxyModule } from './proxy/proxy.module';
// Limite uniquement login/inscription : AUTH_RATE_LIMIT requêtes par minute et par IP client (défaut 10)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: Number(process.env.AUTH_RATE_LIMIT || 10) }]),
    ProxyModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthThrottlerGuard }],
})
export class AppModule {}
