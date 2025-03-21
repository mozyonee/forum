import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class CorsMiddleware implements NestMiddleware {
	private readonly logger = new Logger(CorsMiddleware.name);

	constructor(private configService: ConfigService) { }

	use(req: Request, res: Response, next: NextFunction) {

		this.logger.log(CorsMiddleware.name);

		res.setHeader("Access-Control-Allow-Origin", this.configService.get<string>('CLIENT_URL'));
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,POST,PATCH,DELETE,OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");

		if (req.method === "OPTIONS") {
			return res.status(204).end();
		}

		next();
	}
}