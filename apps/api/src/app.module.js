"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./modules/auth/auth.module");
const campaign_module_1 = require("./modules/campaign/campaign.module");
const creative_module_1 = require("./modules/creative/creative.module");
const metrics_module_1 = require("./modules/metrics/metrics.module");
const optimization_module_1 = require("./modules/optimization/optimization.module");
const organization_module_1 = require("./modules/organization/organization.module");
const user_module_1 = require("./modules/user/user.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
const prisma_module_1 = require("./database/prisma/prisma.module");
const redis_module_1 = require("./config/redis.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: true,
                delimiter: '.',
                maxListeners: 20,
                verboseMemoryLeak: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                { name: 'short', ttl: 1000, limit: 10 },
                { name: 'long', ttl: 60000, limit: 200 },
            ]),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            organization_module_1.OrganizationModule,
            campaign_module_1.CampaignModule,
            creative_module_1.CreativeModule,
            metrics_module_1.MetricsModule,
            optimization_module_1.OptimizationModule,
            webhook_module_1.WebhookModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map