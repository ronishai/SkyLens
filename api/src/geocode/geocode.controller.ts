import { Controller, Get, Query } from "@nestjs/common";
import { GeocodeService } from "./geocode.service";

@Controller("geocode")
export class GeocodeController { 
    constructor(private readonly geocodeService: GeocodeService) {}

    @Get('search')
    async geocode(@Query("query") query: string) {
        if (!query || query.trim().length < 2)
            return [];
        return this.geocodeService.search(query.trim());
    }
}