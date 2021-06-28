import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { HostListener } from '@angular/core';
declare let vis: any;

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.less']
})
export class GraphComponentComponent implements OnInit {
  @ViewChild('visNetwork') visNetwork: ElementRef;
  @ViewChild('contextMenu') contextMenu: ElementRef;
  @Input() graphData;
  private networkInstance: any;
  showContext: boolean = false;
  nodeClicked: any;
  selectedParam: any;
  nodes: any;
  edges: any;
  constructor() { }

  ngOnInit(): void {

  }

  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    if (!this.contextMenu.nativeElement.contains(ev.target)) {
      this.showContext = false;
    }

  }

  ngAfterViewInit(): void {
    // create an array with nodes
    this.nodes = new DataSet<any>(
      this.graphData.nodes
    );

    // create an array with edges
    this.edges = new DataSet<any>(
      this.graphData.edges
    );

    let data = { nodes: this.nodes, edges: this.edges };

    let container = this.visNetwork;
    this.networkInstance = new Network(container.nativeElement, data, {
      height: '100%',
      width: '100%',
      nodes: {
        font: { color: "#FFFFFF" },
        borderWidth: 2
      },
      interaction: { hover: true },
      manipulation: {
        enabled: true,
      },
    });

    this.networkInstance.on("oncontext", (params) => {
      params.event.preventDefault();
      this.selectedParam = params;
      this.nodeClicked = this.networkInstance.getNodeAt(params.pointer.DOM);
      if (this.nodeClicked) {
        this.showContext = true;
        this.contextMenu.nativeElement.style.top = params.pointer.DOM.y + 'px';
        this.contextMenu.nativeElement.style.left = params.pointer.DOM.x + 'px';
      }
      else {
        this.showContext = false;

      }
    });


  }

  deleteNode() {
    this.networkInstance.nodesHandler.nodesListeners.remove(this.selectedParam.event, { items: [this.nodeClicked] });
    this.showContext = false;

  }


  detachNode() {
    let edges = this.networkInstance.getConnectedEdges(this.nodeClicked);
    this.edges.remove(edges);
    this.showContext = false;
  }
}

