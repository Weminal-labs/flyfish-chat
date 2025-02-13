import { useWallet } from "@suiet/wallet-kit";
import React, { useEffect, useState } from "react";
import { GraphCanvas, GraphNode, InternalGraphNode } from "reagraph";
import { getFolderByUserAddress } from "src/lib/CallData";
import { formatTimestamp } from "src/utils/helper.ts/formatTimestamp";
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("Selected Node:", selectedNode);
  }, [selectedNode]);

  useEffect(() => {
    console.log("Fetching data...");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getFolderByUserAddress(
        "0xb4b291607e91da4654cab88e5e35ba2921ef68f1b43725ef2faeae045bf5915d"
      );
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
        sizeBlob: item.size ?? null,
        status: item.status ?? null,
        storedEpoch: item.storedEpoch ?? null,
        updatedAt: item.updatedAt ?? null,
        uploadId: item.uploadId ?? null,
        vaultId: item.vaultId ?? null,
      }));

      // Tạo edges từ dữ liệu API (nếu có quan hệ parent-child)
      const fetchedEdges: EdgeType[] = res
        .filter((item: any) => item.parentId)
        .map((item: any) => ({
          id: `${item.parentId}->${item.id}`,
          source: item.id,
          target: "1a8c7573-5ab4-4096-9e28-65ffac188a38",
          label: "",
        }));

      // Đặt dữ liệu vào state
      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: InternalGraphNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex w-full h-[600px] gap-4">
      {/* Graph Column */}
      <div className="flex-1 border rounded-lg shadow-sm relative">
        {loading ? (
          <span>Loading...</span>
        ) : (
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            labelType="all"
            draggable={true}
          />
        )}
      </div>

      {/* Information Column */}
      <div className="flex-1 border rounded-lg shadow-sm p-4 z-10 overflow-y-scroll">
        {selectedNode ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Node: {selectedNode.id}</h2>

            {/* Manually List All Fields */}
            <div className="space-y-4 p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Grid Layout cho các field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information Group */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Name" value={selectedNode.label} />
                    <InfoField label="Blob ID" value={selectedNode.blobId} />
                    <InfoField label="Owner" value={selectedNode.owner} />
                    <InfoField label="Status" value={selectedNode.status} />
                  </div>
                </div>

                {/* Technical Details Group */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Technical Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      label="Mime Type"
                      value={selectedNode.mimeType}
                    />
                    <InfoField
                      label="Chunk Size"
                      value={selectedNode.chunkSize}
                    />
                    <InfoField
                      label="Number of Chunks"
                      value={selectedNode.numberOfChunks}
                    />
                    <InfoField
                      label="Size (Blob)"
                      value={selectedNode.sizeBlob}
                    />
                    <InfoField
                      label="Erasure Code Type"
                      value={selectedNode.erasureCodeType}
                    />
                    <InfoField
                      label="Encrypted AES Key"
                      value={selectedNode.encryptedAesKey}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Timestamps
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      label="Created At"
                      value={selectedNode.createdAt}
                      isTimestamp={true}
                    />
                    <InfoField
                      label="Updated At"
                      value={selectedNode.updatedAt}
                      isTimestamp={true}
                    />
                    <InfoField
                      label="Expires At"
                      value={selectedNode.expiresAt}
                      isTimestamp={true}
                    />
                  </div>
                </div>

                {/* System Information Group */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    System Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      label="Partition"
                      value={selectedNode.partition}
                    />
                    <InfoField label="Vault ID" value={selectedNode.vaultId} />
                    <InfoField
                      label="Upload ID"
                      value={selectedNode.uploadId}
                    />
                    <InfoField
                      label="Parent ID"
                      value={selectedNode.parentId}
                    />
                    <InfoField label="Ref" value={selectedNode.ref} />
                  </div>
                </div>

                {/* Epoch Information Group */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Epoch Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      label="Certified Epoch"
                      value={selectedNode.certifiedEpoch}
                    />
                    <InfoField
                      label="Stored Epoch"
                      value={selectedNode.storedEpoch}
                    />
                  </div>
                </div>
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
interface InfoFieldProps {
  label: string;
  value: string | number | undefined;
  isTimestamp?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isTimestamp }) => {
  const displayValue = isTimestamp ? formatTimestamp(value) : value;

  return (
    <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-gray-800 break-all">
        {isTimestamp ? (
          <span className="flex flex-col">
            <span className="text-base">{displayValue}</span>
            <span className="text-xs text-gray-500 mt-1">
              Timestamp: {value}
            </span>
          </span>
        ) : (
          displayValue || (
            <span className="text-gray-400 italic">Not available</span>
          )
        )}
      </p>
    </div>
  );
};





