import { BadRequestException, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DbService } from './shared/db.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly dbservice: DbService) { }

  @Get('/')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('/ping')
  async ping(): Promise<string> {
    return 'pong';
  }


  @Get('/get-aggregate/:id')
  async getAggregate(@Param('id') id: string) {
    const data = await this.appService.getAggregate(id);
    return data;
  }

  @Get('/masterCoinList')
  async getMasterCoinList() {
    const data = await this.appService.getMasterCoins();
    // console.log(data);
    return data;
  }

  @Post('/create/:name')
  async createWatchlist(@Param('name') name: string) {
    let regex = /^[a-zA-Z0-9]*$/;
    if (name.length >= 5 && name.length <= 20 && name.match(regex)) {
      const data = await this.dbservice.create(name, []);
      return data;
    } else {
      throw new BadRequestException('Watchlist name must be between 5 and 20 characters long')
    }

    // const coinList = await this.appService.getMasterCoins();

  }

  // @Put('/deleteTokens')
  // async deleteTokens() {
  //   const data = await this.dbservice.deleteTokens();
  //   return data;
  // }

  @Get('/getWatchlist/:name')
  async getWatchlist(@Param('name') name: string) {
    const data = await this.dbservice.find(name);
    return data;
  }




}




