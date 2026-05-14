import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CircuitBreaker } from '../resilience/circuit-breaker';
import { retry } from '../resilience/retry.helper';
@Injectable() export class UserClient { private baseUrl:string; private breaker=new CircuitBreaker(); constructor(config:ConfigService){this.baseUrl=config.get<string>('USER_SERVICE_URL')!} async getUserById(id:string){ if(!this.breaker.canExecute()) throw new ServiceUnavailableException('User Service indisponible temporairement'); try{ const r=await retry(()=>axios.get(`${this.baseUrl}/users/${id}`,{timeout:3000})); this.breaker.recordSuccess(); return r.data;} catch(e){this.breaker.recordFailure(); throw new ServiceUnavailableException('Impossible de vérifier l’utilisateur')} } }
