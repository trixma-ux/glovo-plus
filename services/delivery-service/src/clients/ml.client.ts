import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Injectable() export class MlClient { private baseUrl:string; constructor(config:ConfigService){this.baseUrl=config.get<string>('ML_SERVICE_URL')!} async predictTime(distance:number, traffic:number, weather:number){ try{const r=await axios.post(`${this.baseUrl}/predict`,{distance,traffic,weather},{timeout:3000}); return r.data.estimated_time;}catch(e){return null;} } }
