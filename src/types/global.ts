export interface CommentInterface {
    comment: string;
    isTeacher: boolean;
    userName: string;
}

export interface NoteInterface {
    comments: CommentInterface;
    id: string;
    noteText: string;
    subject: string;
    teacher: string;
    userid: string;
}