import { useWallet } from '@suiet/wallet-kit';
import React, { useEffect, useState } from 'react';
import { GraphCanvas, GraphNode, InternalGraphNode } from "reagraph";
import { getFolderByUserAddress } from 'src/lib/CallData';
interface NodeType extends GraphNode {
  blobId: string | null;
  certifiedEpoch?: number | null;
  chunkSize?: number | null;
  createdAt?: string | null;
  data: { msg?: string | null; success?: boolean | null } | null;
  encryptedAesKey: string | null;
  erasureCodeType: string | null;
  expiresAt: string | null;
  mimeType: string | null;
  name: string | null;
  numberOfChunks: number | null;
  owner: string | null;
  parentId: string | null;
  partition: string | null;
  ref: string | null;
  sizeBlob: number | null;
  status: string | null;
  storedEpoch: number | null;
  updatedAt: string | null;
  uploadId: string | null;
  vaultId: string | null;
}


interface EdgeType {
  id: string;
  source: string;
  target: string;
  label: string;
}

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);
  const { address } = useWallet();
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    console.log("Selected Node:", selectedNode);
  }, [selectedNode]);

  useEffect(() => {
    console.log("Fetching data...");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getFolderByUserAddress("0xb4b291607e91da4654cab88e5e35ba2921ef68f1b43725ef2faeae045bf5915d");
      console.log(res);

      if (!res || res.length === 0) return;

      // Tạo nodes từ dữ liệu API
      const fetchedNodes: NodeType[] = res.map((item: any) => ({
        id: item.id,
        label: item.name || "Unnamed File",
        blobId: item.blobId ?? null,
        certifiedEpoch: item.certifiedEpoch ?? null,
        chunkSize: item.chunkSize ?? null,
        createdAt: item.createdAt ?? null,
        encryptedAesKey: item.encryptedAesKey ?? null,
        erasureCodeType: item.erasureCodeType ?? null,
        expiresAt: item.expiresAt ?? null,
        mimeType: item.mimeType ?? null,
        numberOfChunks: item.numberOfChunks ?? null,
        owner: item.owner ?? null,
        parentId: item.parentId ?? null,
        partition: item.partition ?? null,
        ref: item.ref ?? null,
        sizeBlob: item.size ??null,
        status: item.status ?? null,
        storedEpoch: item.storedEpoch ?? null,
        updatedAt: item.updatedAt ?? null,
        uploadId: item.uploadId ?? null,
        vaultId: item.vaultId ?? null
      }));
      

      // Tạo edges từ dữ liệu API (nếu có quan hệ parent-child)
      const fetchedEdges: EdgeType[] = res
        .filter((item: any) => item.parentId)
        .map((item: any) => ({
          id: `${item.parentId}->${item.id}`,
          source: item.parentId,
          target: item.id,
          label: "Contains",
        }));

      // Đặt dữ liệu vào state
      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally{
      setLoading(false)

    }
  };

  const handleNodeClick = (node: InternalGraphNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex w-full h-[600px] gap-4">
      {/* Graph Column */}
      <div className="flex-1 border rounded-lg shadow-sm relative">
       {loading?<span>Loading...</span>:
        <GraphCanvas
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        labelType="all"
        draggable={true}
      />}
      </div>

      {/* Information Column */}
      <div className="flex-1 border rounded-lg shadow-sm p-4 z-10 overflow-y-scroll">
        {selectedNode ? (
          <div>
             <h2 className="text-xl font-bold mb-4">Node: {selectedNode.id}</h2>
      
      {/* Manually List All Fields */}
      <div className="space-y-4 ">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Name:</p>
          <p className="text-gray-700">{selectedNode.label}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Blob ID:</p>
          <p className="text-gray-700">{selectedNode.blobId}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Owner:</p>
          <p className="text-gray-700">{selectedNode.owner}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Certified Epoch:</p>
          <p className="text-gray-700">{selectedNode.certifiedEpoch}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Chunk Size:</p>
          <p className="text-gray-700">{selectedNode.chunkSize}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Created At:</p>
          <p className="text-gray-700">{selectedNode.createdAt}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Encrypted AES Key:</p>
          <p className="text-gray-700">{selectedNode.encryptedAesKey}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Erasure Code Type:</p>
          <p className="text-gray-700">{selectedNode.erasureCodeType}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Expires At:</p>
          <p className="text-gray-700">{selectedNode.expiresAt}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Mime Type:</p>
          <p className="text-gray-700">{selectedNode.mimeType}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Number of Chunks:</p>
          <p className="text-gray-700">{selectedNode.numberOfChunks}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Parent ID:</p>
          <p className="text-gray-700">{selectedNode.parentId}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Partition:</p>
          <p className="text-gray-700">{selectedNode.partition}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Ref:</p>
          <p className="text-gray-700">{selectedNode.ref}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Size (Blob):</p>
          <p className="text-gray-700">{selectedNode.sizeBlob}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Status:</p>
          <p className="text-gray-700">{selectedNode.status}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Stored Epoch:</p>
          <p className="text-gray-700">{selectedNode.storedEpoch}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Updated At:</p>
          <p className="text-gray-700">{selectedNode.updatedAt}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Upload ID:</p>
          <p className="text-gray-700">{selectedNode.uploadId}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="font-semibold text-gray-700 mb-1">Vault ID:</p>
          <p className="text-gray-700">{selectedNode.vaultId}</p>
        </div>
      </div>
            {/* <div className="mt-4">
              <button
                className="text-sm text-blue-500 hover:text-blue-700"
                onClick={() => setSelectedNode(null)}
              >
                Clear Selection
              </button>
            </div> */}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg">No node selected</p>
            <p className="text-sm mt-2">Click on a node to view its details</p>
          </div>
        )}
      </div>
    </div>
  );
}
