import { Controller, Get, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { AstroService } from "./astro.service";
import { AstroSummaryQueryDto } from "./dto/astro-summary.query";

@Controller("astro")
export class AstroController {
    constructor(private readonly astroService: AstroService) {}

    @Get("summary")
    async getSummary(@Query() query: AstroSummaryQueryDto, @Res({ passthrough: true}) res: Response) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        console.log('Received query:', query);
        return this.astroService.getSummary(query);
    }
}