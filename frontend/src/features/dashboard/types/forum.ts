export interface vnsocialTopic{
    id: string;
    name: string;
    type: string;
    created_date: string;
    created_by: string;
    updated_date: string;
    status: boolean
}

// Backend ForumPackage type
export interface ForumPackage {
    _id: string;
    packageTitle: string;
    packageSummary: string;
    sourceArticle: {
        articleId: string;
        title?: string;
        url?: string;
    };
    vnsocialTopic: {
        topicId: string;
        name?: string;
    };
    createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    forumTopics: ForumTopic[]; // Properly typed as ForumTopic array
    status: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

// Forum Article from VnSocial
export interface ForumArticle {
    id: string; // Changed from number to string to match _id
    title: string;
    content: string[];
    excerpt: string;
    category: string;
    categoryColor: string;
    source: string;
    sourceUrl: string;
    timeAgo: string;
    views: number;
    likes: number;
    discussionPostsCount: number;
    commentsCount: number;
    isTrending: boolean;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
    relatedExamId?: string;
    forumTopics: ForumTopic[]; // Include forum topics for data access
}

// ForumTopic from backend
export interface ForumTopic {
    _id: string;
    title: string;
    packageId: string;
    examId?: string;
    sourceArticle?: {
        articleId: string;
        title?: string;
        url?: string;
    };
    vnsocialTopic?: {
        topicId: string;
        name?: string;
    };
    createdBy: {
        _id: string;
        name?: string;
        email?: string;
    };
    seedComment: string;
    essayPrompt: string;
    status: string;
    stats: {
        totalComments: number;
        totalLikes: number;
        totalViews: number;
    };
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

// AI-generated discussion post or student-created question
export interface ForumDiscussionPost {
    id: string;
    articleId: number;
    type: "ai-generated" | "student-created";
    question: string;
    description: string;
    commentsCount: number;
    likes: number;
    createdAt: string;
    generatedBy?: string;
    createdBy?: string;
    authorName?: string;
    authorAvatar?: string;
}

// Legacy interface for backward compatibility
export interface ForumPost extends ForumArticle {
    // Keep for backward compatibility
}

export interface ForumComment {
    _id: string;
    topicId: string;
    userId: string | {
        _id: string;
        name: string;
        email: string;
        role?: string;
        avatar?: string;
    };
    content: string;
    parentComment?: string | null; // For nested replies
    likes: string[]; // Array of user IDs who liked
    replies: ForumComment[]; // Nested replies
    isAISeed?: boolean; // Is this an AI-generated seed comment
    author?: {
        _id: string;
        name: string;
        email: string;
        role?: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
    status?: string;
}

export interface DiscussionThread {
    id: string;
    articleId: number;
    type: "ai-suggestion" | "student-question";
    question: string;
    aiGenerated?: boolean;
    authorName?: string;
    authorAvatar?: string;
    timeAgo?: string;
    comments: ForumComment[];
    createdAt: string;
}

export interface RelatedExam {
    id: string;
    articleId: number;
    examId: string;
    title: string;
    subject: string;
    duration: number;
    questionCount: number;
    relevanceScore: number;
}

export interface ForumCategory {
    id: string;
    name: string;
    color: string;
    description?: string;
    articlesCount?: number;
}

export interface ForumStats {
    totalArticles: number;
    totalDiscussionPosts: number;
    totalComments: number;
    activeUsers: number;
}

export type ForumFilter = "trending" | "newest" | "popular" | "following" | "community";