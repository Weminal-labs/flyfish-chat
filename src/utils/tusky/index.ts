import { Upload } from "tus-js-client";

// Import utils
import { StringUtils } from "../string";

const tuskyURL = import.meta.env.VITE_TUSKY_URL;
const tuskyAPIKey = import.meta.env.VITE_TUSKY_API_KEY;
const defaultVaultId = import.meta.env.VITE_DEFAULT_VAULT_ID;
const defaultParentId = import.meta.env.VITE_DEFAULT_PARENT_ID;

console.log(tuskyURL, tuskyAPIKey, defaultVaultId, defaultParentId);
//to check that user have been created a folder and create if not
async function checkUserFolder(folderName: string) {
  if (!tuskyURL || !tuskyAPIKey)
    throw new Error("tuskyURL or tuskyAPIKey is not set");
  const folders = await fetch(
    `${tuskyURL}/folders?vaultId=${defaultVaultId}&parentId=${defaultParentId}`,
    {
      method: "GET",
      headers: {
        "Api-Key": tuskyAPIKey,
      },
    }
  ).then((response) => response.json());
  console.log(folders);
  const folder = folders.items.find((folder: any) => folder.name == folderName);
  if (folder) {
    return folder;
  } else {
    console.log("Creating new folder..");
    return createFolder(folderName);
  }
  //get list folder
}

async function getFolderByUserAddress(userAddress: string) {
  if (!tuskyURL || !tuskyAPIKey)
    throw new Error("tuskyURL or tuskyAPIKey is not set");
  const folder = await checkUserFolder(userAddress);
  console.log(folder);
  const response = await fetch(
    `${tuskyURL}/files?vaultId=${defaultVaultId}&parentId=${folder.id}`,
    {
      method: "GET",
      headers: {
        "Api-Key": tuskyAPIKey,
      },
    }
  ).then((response) => response.json());
  const data = await Promise.all(
    response.items.map(async (item: any) => {
      const file = await getDataByID(item.id);
      return {
        ...item,
        data: file,
      };
    })
  );
  return data;
}

// to upload file users folder
async function uploadFile(
  jsonObject: JSON,
  folderName: string,
  onLoad: (percentage: number) => void,
  onSuccess: (upload: Upload) => void,
  onError: () => void
) {
  console.log("Uploading file... iner");
  if (!tuskyURL || !tuskyAPIKey || !defaultVaultId) {
    console.log("tuskyURL or tuskyAPIKey is not set");
    throw new Error("tuskyURL or tuskyAPIKey is not set");
  }
  const folder = await checkUserFolder(folderName);
  console.log(folder);
  const jsonBlob = new Blob([JSON.stringify(jsonObject)], {
    type: "application/json",
  });

  console.log("Uploading file...");
  const upload = new Upload(jsonBlob, {
    endpoint: `${tuskyURL}/uploads`,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    headers: {
      "Api-Key": tuskyAPIKey,
    },
    metadata: {
      filename: `${StringUtils.generateRandomString(10)}.json`,
      filetype: "application/json",
      vaultId: defaultVaultId, // ID of the vault where the file will be stored
      parentId: folder.id, // ID of the folder where the file will be stored
    },
    uploadSize: jsonBlob.size,
    onError: (error) => {
      onError();
      console.error("Upload failed:", error.message);
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      onLoad(Number(percentage));
      console.log(`Upload progress: ${percentage}%`);
    },
    onSuccess: () => {
      onSuccess(upload);
    },
  });
  await upload.start();
}

// create vault to store files, Vaults in Tusky are secure storage containers for files.
async function createVault(vaultName: string) {
  if (!tuskyURL || !tuskyAPIKey) {
    throw new Error("tuskyURL or tuskyAPIKey is not set");
  }
  const response = await fetch(`${tuskyURL}/vaults`, {
    method: "POST",
    headers: {
      "Api-Key": tuskyAPIKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: vaultName,
    }),
  });

  const vault = await response.json();
  return vault;
}

//get file binary data from id
async function getDataByID(id: string) {
  if (!tuskyURL || !tuskyAPIKey) {
    throw new Error("tuskyURL or tuskyAPIKey is not set");
  }
  const response = await fetch(`${tuskyURL}/files/${id}/data`, {
    headers: {
      "Api-Key": tuskyAPIKey,
    },
  });
  return await response.json();
}

// get all file by a vault
async function getDataFromVault(vaultId: string) {
  if (!tuskyURL || !tuskyAPIKey) {
    throw new Error("tuskyURL or tuskyAPIKey is not set");
  }
  const response = await fetch(`${tuskyURL}/files?vaultId=${vaultId}`, {
    headers: {
      "Api-Key": tuskyAPIKey,
    },
  });
  const data = await response.json();
  return data?.items;
}

async function getFileInfo(id: string) {
  if (!tuskyURL || !tuskyAPIKey) {
    throw new Error("tuskyURL or tuskyAPIKey is not set");
  }
  const response = await fetch(`${tuskyURL}/files/${id}`, {
    headers: {
      "Api-Key": tuskyAPIKey,
    },
  });
  return await response.json();
}

async function createFolder(folderName: string) {
  try {
    if (!tuskyURL || !tuskyAPIKey) {
      throw new Error("tuskyURL or tuskyAPIKey is not set");
    }
    const response = await fetch(`${tuskyURL}/folders`, {
      method: "POST",
      headers: {
        "Api-Key": tuskyAPIKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        vaultId: defaultVaultId,
        parentId: defaultParentId,
      }),
    });
    return await response.json();
  } catch (error) {
    return error;
  }
}

export const TuskyUtils = {
  checkUserFolder,
  getFolderByUserAddress,
  uploadFile,
  createVault,
  getDataByID,
  getDataFromVault,
  getFileInfo,
  createFolder,
};

//sapmle parent 2f3e73f9-77c2-473a-b8cd-0776e1b79cc3
