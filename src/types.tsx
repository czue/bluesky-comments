export interface CommentEmptyDetails {
  code: string;
  message: string;
}

export interface CommentOptions {
  uri?: string;
  author?: string;
  commentFilters?: Array<(arg: any) => boolean>;
  onEmpty?: (details: CommentEmptyDetails) => void;
}
