export interface SemanticTag {
  name: string;
  category: "structure" | "content" | "media" | "interactive" | "inline";
  description: string;
  usage: string;
  donts: string;
  codeSnippet: string;
  tagsAssociated?: string[];
}

export interface SemanticeErrorSample {
  id: string;
  title: string;
  description: string;
  badCode: string;
  goodCode: string;
  explanation: string;
}

export interface AuditIssue {
  type: "error" | "warning" | "success";
  message: string;
  suggestion: string;
  originalCodeSnippet: string;
  replacementCodeSnippet: string;
}

export interface AuditResult {
  score: number;
  generalAnalysis: string;
  issues: AuditIssue[];
}

export interface GameBlock {
  id: string;
  label: string;
  correctTag: string;
  description: string;
  selectedTag?: string;
  isCorrect?: boolean;
}
