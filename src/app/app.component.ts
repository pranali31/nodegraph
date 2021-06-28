import { Component, OnInit } from '@angular/core';
import { GraphService } from './graph.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'nodeGraph';
  showGraph  = false;

  graphData : any;
  constructor(private graphService : GraphService){

  }

  ngOnInit(){
    this.graphService.getGraphData().subscribe(data=>{
      this.graphData = data;
    })
  }

onShowGraph(){
  this.showGraph  = true;
}

onRemoveGraph(){
  this.showGraph  = false;

}

}

