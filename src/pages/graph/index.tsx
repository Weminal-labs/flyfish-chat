import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
interface nodeType {
    id: string;
    name: string;
    color: string;
    type: string;
    description: string;
  }
  
  interface linkType {
    source: string;
    target: string;
  }
  
  interface graphDataType {
    nodes: nodeType[];
    links: linkType[];
  }
export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<nodeType|null>(null);
  useEffect(()=>{
    console.log("Select")
    console.log(selectedNode)
  },[selectedNode])
  const graphData:graphDataType = {
    nodes: [
      { id: 'parent', name: 'Node Cha', color: '#ff4444', type: 'parent', description: 'Đây là node cha chính' },
      { id: 'child1', name: 'Node Con 1', color: '#44ff44', type: 'child', description: 'Chi tiết về node con 1' },
      { id: 'child2', name: 'Node Con 2', color: '#44ff44', type: 'child', description: 'Chi tiết về node con 2' },
      { id: 'child3', name: 'Node Con 3', color: '#44ff44', type: 'child', description: 'Chi tiết về node con 3' },
      { id: 'child4', name: 'Node Con 4', color: '#44ff44', type: 'child', description: 'Chi tiết về node con 4' },
      { id: 'child5', name: 'Node Con 5', color: '#44ff44', type: 'child', description: 'Chi tiết về node con 5' }
    ],
    links: [
      { source: 'parent', target: 'child1' },
      { source: 'parent', target: 'child2' },
      { source: 'parent', target: 'child3' },
      { source: 'parent', target: 'child4' },
      { source: 'parent', target: 'child5' }
    ]
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    console.log('Selected node:', node);
  };

  const handleNodeHover = (node) => {
    if (node) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  return (
    <div className="flex w-full h-[600px] gap-4">
      {/* Cột trái: Graph */}
      <div className="flex-1 border rounded-lg shadow-sm">
        <ForceGraph2D 
          graphData={graphData}
          nodeColor={node => node.color}
          nodeRelSize={8}
          linkColor={() => '#999999'}
          linkWidth={2}
          d3VelocityDecay={0.1}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          width={800}
        />
      </div>

      {/* Cột phải: Thông tin chi tiết */}
      <div className="flex-1 border rounded-lg shadow-sm">
        {selectedNode ? (
          <div>
            <h2 className="text-xl font-bold mb-4">{selectedNode.name}</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Loại:</p>
                <p>{selectedNode.type === 'parent' ? 'Node Cha' : 'Node Con'}</p>
              </div>
              <div>
                <p className="font-semibold">ID:</p>
                <p>{selectedNode.id}</p>
              </div>
              <div>
                <p className="font-semibold">Mô tả:</p>
                <p>{selectedNode.description}</p>
              </div>
              <div className="mt-4">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedNode.color }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-8">
            Chọn một node để xem thông tin chi tiết
          </div>
        )}
      </div>
    </div>
  );
}