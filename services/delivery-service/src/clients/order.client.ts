import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Injectable() export class OrderClient { private baseUrl:string; constructor(config:ConfigService){this.baseUrl=config.get<string>('ORDER_SERVICE_URL')!} async getOrderById(id:string){try{const r=await axios.get(`${this.baseUrl}/orders/${id}`,{timeout:3000, headers:{'x-internal-token':process.env.INTERNAL_SERVICE_TOKEN||''}}); return r.data;}catch(e){throw new ServiceUnavailableException('Impossible de vérifier la commande')}} }
