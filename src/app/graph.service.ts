import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private httpClient : HttpClient) { 

  }

  getGraphData(){
    return this.httpClient.get("assets/graphData.json");
  }
}
