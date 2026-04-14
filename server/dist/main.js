"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const compression = require("compression");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.setGlobalPrefix('api');
    app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map