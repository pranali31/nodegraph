import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { HostListener } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.less']
})
export class GraphComponentComponent implements OnInit {
  @ViewChild('visNetwork') visNetwork: ElementRef;
  @ViewChild('contextMenu') contextMenu: ElementRef;
  @Input() graphData;
  @Output() hideGraphEvent = new EventEmitter();
  private networkInstance: any;
  showContext: boolean = false;
  nodeClicked: any;
  selectedParam: any;
  nodes: any;
  edges: any;
  exportAsConfig: ExportAsConfig = {
    type: 'png', // the type you want to download
    elementIdOrContent: 'visNetwork', // the id of html/table element
  }

  constructor(private exportAsService: ExportAsService) { }

  ngOnInit(): void {

  }

  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    if (!this.contextMenu.nativeElement.contains(ev.target)) {
      this.showContext = false;
    }

  }

  ngAfterViewInit(): void {
    this.setGraph();
  }

  softDeleteNode(){
    let selectedEdges = this.networkInstance.getConnectedEdges(this.nodeClicked);
    selectedEdges.forEach(element => {
      this.edges.update([
        {
        id:element,
       dashes:true
      }
      ]);
    });
    
   this.showContext = false;
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

  onRemoveGraph() {
    this.hideGraphEvent.emit(false);
  }

  setGraph() {
    if (this.networkInstance) {
      this.networkInstance.destroy();
    }
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

  
  export(){
    this.exportAsService.save(this.exportAsConfig, 'nodegraph').subscribe(() => {
      // save started
    });  
  }
}

