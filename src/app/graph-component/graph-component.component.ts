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
  selectedVersion: any = '';
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
  versionArray = [];
  versionId = 0;

  constructor(private exportAsService: ExportAsService) { }

  ngOnInit(): void {
    //initialize the nodes for from and to dropdown
    this.nodes = new DataSet<any>(
      this.graphData.nodes
    );
    this.nodeData = this.nodes.get();
  }

  //add listener on document to update events of context menu
  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    if (!this.contextMenu.nativeElement.contains(ev.target)) {
      this.showContext = false;
    }
  }

  ngAfterViewInit(): void {
    this.setGraphData(); // set graph data once graph is fully initialized
  }

  //to convert connected edges style from normal to dashed
  softDeleteNode() {
    let selectedEdges = this.networkInstance.getConnectedEdges(this.nodeClicked);
    selectedEdges.forEach(element => {
      this.edges.update([
        {
          id: element,
          dashes: true
        }
      ]);
    });
    this.showContext = false;
  }

  //to remove the selected node from graph
  deleteNode() {
    this.nodes.remove(this.nodeClicked)
    this.showContext = false;
    this.nodeData = this.nodes.get();
  }

  //to remove the edges of selected node from graph
  detachNode() {
    let edges = this.networkInstance.getConnectedEdges(this.nodeClicked);
    this.edges.remove(edges);
    this.showContext = false;
  }

  //to add a new random node to the existing graph
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
      this.params.node.moduleType = '';
      this.params.node.color = '';
    } catch (err) {
      alert(err);
    }
  }

  //to add edge between the selected nodes of from/to dropdown to the existing graph
  addEdge() {
    this.edges.add({
      from: this.params.edge.from,
      to: this.params.edge.to
    });
    this.edgeForm.reset();
    this.params.edge.from = '';
    this.params.edge.to = '';

  }

  //set graphData with nodes/edges and create instance of the graph
  setGraphData() {
    if (this.nodes)
      this.nodes.clear();
    if (this.edges)
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
    let _graphOptions = {
      height: '100%',
      width: '100%',
      nodes: {
        font: { color: "#FFFFFF" },
        borderWidth: 2
      },
      interaction: { hover: true, zoomView:false },
      manipulation: {
        enabled: true,
      }
    }
    //create graph instance
    this.networkInstance = new Network(container.nativeElement, data, _graphOptions);

    //add context event on right click of node
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

    //to save positions of nodes
    let positions = this.networkInstance.getPositions();
    this.graphData.nodes.forEach(node => {
      node.x = positions[node.id].x;
      node.y = positions[node.id].y;
    });
    this.networkInstance.stabilize();
  }

  //to reset graph to the original onLoad state
  resetGraph() {
    if (this.nodes)
      this.nodes.clear();
    if (this.edges)
      this.edges.clear();
    this.nodes = new DataSet(this.graphData.nodes);
    this.edges = new DataSet(this.graphData.edges);
    this.networkInstance.setData({ nodes: this.nodes, edges: this.edges });
    this.nodeData = this.nodes.get();
    this.networkInstance.stabilize();
  }

  //download snapshot of the current graph version
  export() {
    this.exportAsService.save(this.exportAsConfig, 'nodegraph').subscribe(() => {
    });
  }

  //save current graph version to view 
  saveVersion() {
    this.versionId++;
    let versionObject = {
      id: this.versionId,
      nodes: this.nodes.get(),
      edges: this.edges.get()
    }
    let positions = this.networkInstance.getPositions();
    versionObject.nodes.forEach(node => {
      if (positions[node.id]) {
        node.x = positions[node.id].x;
        node.y = positions[node.id].y;
      }
    });
    this.versionArray.push(versionObject);
  }

  //select version from dropdown to view graph state
  changeVersion(_evt) {
    let _version = this.versionArray.filter(i => i.id === parseInt(_evt.target.value));
    if (_version) {
      this.nodes = _version[0].nodes;
      this.edges = _version[0].edges;
      let _data = { nodes: this.nodes, edges: this.edges };
      this.networkInstance.setData(_data);
      this.networkInstance.stabilize();
    }
  }
}


