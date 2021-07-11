import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { HostListener } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.less']
})
export class GraphComponentComponent implements OnInit {
  @ViewChild('visNetwork') visNetwork: ElementRef;
  @ViewChild('contextMenu') contextMenu: ElementRef;
  @ViewChild('edgeForm') edgeForm: any;
  @ViewChild('nodeForm') nodeForm: any;
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
  selectedVersion:any;
  nodeData: any = [];
  params = {
    node: {
      moduleType: '',
      title: '',
      color: ''
    },
    edge: {
      from: '',
      to: ''
    }
  };
  constructor(private exportAsService: ExportAsService) { }

  ngOnInit(): void {
    this.nodes = new DataSet<any>(
      this.graphData.nodes
    );
    this.nodeData = this.nodes.get();
  }

  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    if (!this.contextMenu.nativeElement.contains(ev.target)) {
      this.showContext = false;
    }

  }

  ngAfterViewInit(): void {
    this.setGraphData();
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
    this.nodeData = this.nodes.get();
  }


  detachNode() {
    let edges = this.networkInstance.getConnectedEdges(this.nodeClicked);
    this.edges.remove(edges);
    this.showContext = false;
  }

  addNode() {
    var obj = {
      "id": `/api/3/${this.params.node.moduleType}/${uuidv4()}`,
      "moduleType": this.params.node.moduleType,
      "group": this.params.node.moduleType,
      "title": this.params.node.title,
      "label": this.params.node.title,
      "color": this.params.node.color
    }
    try {
      this.nodes.add(obj);
      this.nodeData = this.nodes.get();
      this.nodeForm.reset();
      this.params.node.color = ''
    } catch (err) {
      alert(err);
    }
  }

  addEdge() {
    this.edges.add({
      from:this.params.edge.from,
      to: this.params.edge.to
    });
    this.edgeForm.reset();
  }
  getNodes() {
  return this.nodes.getDataSet().get();
  }
  
  onRemoveGraph() {
    this.hideGraphEvent.emit(false);
  }

  setGraphData() {
    if(this.nodes)
    this.nodes.clear();
    if(this.edges)
    this.edges.clear();
    // create an array with nodes
    this.nodes = new DataSet<any>(
      this.graphData.nodes
    );

    // create an array with edges
    this.edges = new DataSet<any>(
      this.graphData.edges
    );

    let data = { nodes: this.nodes, edges: this.edges };
    this.nodeData = this.nodes.get();

    
    if (this.networkInstance) {
      this.networkInstance.destroy();
    }
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
      }
    });
    
    this.networkInstance.on("oncontext", (params) => {
      params.event.preventDefault();
      this.selectedParam = params;
      this.nodeClicked = this.networkInstance.getNodeAt(params.pointer.DOM);
      if (this.nodeClicked) {
        this.showContext = true;
        this.contextMenu.nativeElement.style.top = this.visNetwork.nativeElement.offsetTop + params.pointer.DOM.y + 'px';
        this.contextMenu.nativeElement.style.left = params.pointer.DOM.x + 'px';
      }
      else {
        this.showContext = false;

      }
    });
    this.resetGraph();
    this.networkInstance.stabilize();
    //this.setGraph(data);
    
  }

  resetGraph(){
    if(this.nodes)
    this.nodes.clear();
    if(this.edges)
    this.edges.clear();

    this.nodes.add(this.graphData.nodes);
    this.edges.add(this.graphData.edges);
    this.networkInstance.stabilize();
  }

  export(){
    this.exportAsService.save(this.exportAsConfig, 'nodegraph').subscribe(() => {
      // save started
    });  
  }

  versionArray = [];
  versionId = 0;
  saveVersion(){
    this.versionId++;
    let versionObject = {
      id:this.versionId,
      nodes:this.nodes,
      edges : this.edges
    }
    this.versionArray.push(versionObject);
  }

  changeVersion(_evt){
    let _version = this.versionArray.filter(i=>i.id === parseInt(_evt.target.value));
    this.nodes = _version[0].nodes;
    this.edges = _version[0].edges;
    let _data = { nodes:  this.nodes, edges: this.edges };
    this.networkInstance.setData(_data);
    this.networkInstance.stabilize();

    //this.setGraph(_data);
  }
}

