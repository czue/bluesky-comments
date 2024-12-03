export interface CommentEmptyDetails {
  code: string;
  message: string;
}

export interface CommentOptions {
  uri?: string;
  author?: string;
  filte
  onEmpty?: (details: CommentEmptyDetails) => void;
}
