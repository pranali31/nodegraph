import { Component } from '@angular/core';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nodeGraph';
  showGraph  = false;

  graphData={

    "nodes": [
  
      {
  
        "id": "/api/3/indicators/8914d9f6-bade-4f59-97d1-ac1b9049bb4c",
  
        "moduleType": "indicators",
  
        "group": "indicators",
  
        "title": "49424",
  
        "label": "49424",
  
        "color": "#6a9169"
  
      },
  
      {
  
        "id": "/api/3/indicators/aff51511-0537-4d8c-9702-e534578fbda0",
  
        "moduleType": "indicators",
  
        "group": "indicators",
  
        "title": "4444",
  
        "label": "4444",
  
        "color": "#6a9169"
  
      },
  
      {
  
        "id": "/api/3/alerts/949d4fe7-adeb-4333-8fed-43af72c7668f",
  
        "moduleType": "alerts",
  
        "group": "alerts",
  
        "title": "Metasploit Meterpreter Connection Attempt",
  
        "label": "Metasploit Meterpret...",
  
        "color": "#e31b1d"
  
      },
  
      {
  
        "id": "/api/3/incidents/c279bf4c-e565-4544-87b4-9681490ab072",
  
        "size": 30,
  
        "title": "Metasploit Meterpreter Connection Attempt",
  
        "label": "Metasploit Meterpret...",
  
        "color": "#D2AC1A",
  
        "moduleType": "incidents",
  
        "group": "incidents",
  
        "adjacencies": []
  
      }
  
    ],
  
    "edges": [
  
      {
  
        "from": "/api/3/incidents/c279bf4c-e565-4544-87b4-9681490ab072",
  
        "to": "/api/3/alerts/949d4fe7-adeb-4333-8fed-43af72c7668f"
  
      },
  
      {
  
        "from": "/api/3/alerts/949d4fe7-adeb-4333-8fed-43af72c7668f",
  
        "to": "/api/3/indicators/8914d9f6-bade-4f59-97d1-ac1b9049bb4c"
  
      },
  
      {
  
        "from": "/api/3/alerts/949d4fe7-adeb-4333-8fed-43af72c7668f",
  
        "to": "/api/3/indicators/aff51511-0537-4d8c-9702-e534578fbda0"
  
      },
  
      {
  
        "from": "/api/3/incidents/c279bf4c-e565-4544-87b4-9681490ab072",
  
        "to": "/api/3/indicators/8914d9f6-bade-4f59-97d1-ac1b9049bb4c"
  
      },
  
      {
  
        "from": "/api/3/incidents/c279bf4c-e565-4544-87b4-9681490ab072",
  
        "to": "/api/3/indicators/aff51511-0537-4d8c-9702-e534578fbda0"
  
      }
  
    ]
  
  }
  
onShowGraph(){
  this.showGraph  = true;
}

}

