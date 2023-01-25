import { HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
// import { catchError, map } from 'rxjs';
// import { map } from 'rxjs';
import { DbService } from './shared';
import { catchError, firstValueFrom, map } from 'rxjs';
// import { formatCurrency } from "@coingecko/cryptoformat";

const axios = require('axios');
@Injectable()
export class AppService {
  constructor(private readonly db: DbService, private readonly httpService: HttpService) { }

  async getHello(): Promise<string> {
    const result = await this.db.create('vitalikWatchlist', ['matic-network']);
    return `Hello Wold! ${JSON.stringify(result)}`;
  }



  async getMasterCoins() {
    const url = 'https://api.coingecko.com/api/v3/coins/list';
    const { data } = await axios.get(url, {
      headers: { "Accept-Encoding": "gzip,deflate,compress" }
    });
    // console.log(data);
    return data;
  }


  async getAggregate(id: string) {
    const url = `https://api.covalenthq.com/v1/1/address/${id}/balances_v2/?key=ckey_966338357de74473a6d53a89a0d`;
    const { data } = await firstValueFrom(
      this.httpService.get<any>(url, {
        headers: { "Accept-Encoding": "gzip,deflate,compress" }
      }).pipe(
        map((v) => { return v.data }),
        catchError((error) => {
          throw error;
        }),
      ),
    );
    // var output = a.substring(0, position) + b + a.substring(position);
    const obj: any = {
      address: id,
      balances: {

      },
      totalBalanceInUSD: 0.0
    }

    data.items.forEach((item: any) => {
      var newBalance: any = item.balance.padStart(parseInt(item.contract_decimals), '0');
      if (item.contract_decimals > item.balance.length) {
        newBalance = '0.' + newBalance;
      } else {
        const position = item.balance.length - item.contract_decimals;
        var newBalance: any = item.balance.substring(0, position) + '.' + item.balance.substring(position);
      }
      obj.totalBalanceInUSD += parseFloat(newBalance);
      const contractName: string = item.contract_name.toLowerCase();
      obj.balances[contractName] = [{
        name: item.contract_name,
        symbol: item.contract_ticker_symbol,
        decimals: item.contract_decimals,
        contractAddress: item.contract_address,
        contractDeicmals: item.contract_decimals,
        logo: item.logo_url,
        balance: item.balance,
        balanceInUSD: newBalance
      }];
    })
    return obj
  }

}
