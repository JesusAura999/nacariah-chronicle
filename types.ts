
export interface ChronicleSectionData {
  id: string;
  title: string;
  content: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}
