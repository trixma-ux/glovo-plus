import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CircuitBreaker } from '../resilience/circuit-breaker';
import { retry } from '../resilience/retry.helper';
@Injectable() export class RestaurantClient { private baseUrl:string; private breaker=new CircuitBreaker(); constructor(config:ConfigService){this.baseUrl=config.get<string>('RESTAURANT_SERVICE_URL')!} async getProductsByIds(ids:string[]){ if(!this.breaker.canExecute()) throw new ServiceUnavailableException('Restaurant Service indisponible temporairement'); try{ const r=await retry(()=>axios.get(`${this.baseUrl}/products/batch?ids=${ids.join(',')}`,{timeout:Number(process.env.UPSTREAM_TIMEOUT_MS||3000)})); this.breaker.recordSuccess(); return r.data;} catch(e){this.breaker.recordFailure(); throw new ServiceUnavailableException('Impossible de récupérer les produits')} } }
