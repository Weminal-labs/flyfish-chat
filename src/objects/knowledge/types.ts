export type KnowledgeReferenceType = {
  type: string;
  title: string;
  url: string;
};

export type KnowledgeTopicType = {
  id: string;
  title: string;
  content: string;
  references: Array<KnowledgeReferenceType>;
};

export type KnowledgeCategoryType = {
  id: number;
  name: string;
  topics: Array<KnowledgeTopicType>;
};

export type KnowledgeType = {
  text: string;
  authorFullname: string;
  authorUsername: string;
  authorImg: string;
  url: string;
  uploadInfo: any;
};
